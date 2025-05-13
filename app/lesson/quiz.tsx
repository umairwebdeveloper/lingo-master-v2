"use client";
import { challenges, challengeOptions, userSubscription } from "@/db/schema";
import { useState, useTransition, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import { ResultCard } from "./result-card";
import Challenge from "./challenge";
import QuestionBubble from "./question-bubble";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePraticesModal } from "@/store/use-pratice-modal";
import axios from "axios";

interface QuizProps {
    initialLessonId: number;
    initialPercentage: number;
    initialHearts: number;
    userSubscription:
        | (typeof userSubscription.$inferSelect & { isActive: boolean })
        | null;

    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: (typeof challengeOptions.$inferSelect)[];
    })[];
}

const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonChallenges,
    initialLessonId,
    userSubscription,
}: QuizProps) => {
    const [questionImageSrc, setQuestionImageSrc] = useState<string | null>(
        null
    );

    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPraticeModal } = usePraticesModal();
    useMount(() => {
        if (initialPercentage === 100) {
            openPraticeModal();
        }
    });
    const { width, height } = useWindowSize();
    const router = useRouter();
    const [finishAudio, _f, finishControls] = useAudio({
        src: "/finish.mp3",
        autoPlay: true,
    });
    const [correctAudio, _c, correctControls] = useAudio({
        src: "/correct.wav",
    });
    const [incorrectAudio, _i, incorrectControls] = useAudio({
        src: "/incorrect.wav",
    });
    const [peding, startTransition] = useTransition();
    const [lessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex(
            (challenge) => !challenge.completed
        );
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });
    const [selectedOption, setSelectedOptions] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
    const [summary, setSummary] = useState([]);

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const fetchChallengesSummary = async () => {
        try {
            const response = await axios.get("/api/lessons/complete/", {
                params: { lessonId },
            });
            setSummary(response.data);
        } catch (error: any) {
            console.error("Error fetching challenges:", error);
        }
    };

    useEffect(() => {
        const imageSrc = challenge?.questionImagesrc || null; // Gebruik questionImagesrc in plaats van imageSrc
        setQuestionImageSrc(imageSrc);
    }, [challenge]);

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOptions(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOptions(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) return;

        if (correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }
                        correctControls.play();
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);
                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() =>
                        toast.error("Something went wrong. Please try again.")
                    );
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }
                        incorrectControls.play();
                        setStatus("wrong");

                        if (!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() =>
                        toast.error("Something went wrong. Please try again.")
                    );
            });
        }
    };

    const onSelect = (id: number | undefined) => {
        if (status !== "none") return;
        setSelectedOptions(id);
    };

    if (!challenge) {
        fetchChallengesSummary();
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto  text-center items-center justify-center h-full">
                    <Image
                        src="/finish.svg"
                        alt="Finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image
                        src="/finish.svg"
                        alt="Finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job! <br /> You&apos;ve completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard variant="hearts" value={hearts} />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-center my-4">Summary</h3>
                <div className="max-w-[1140px] h-full mx-auto flex items-start justify-between px-6 lg:px-10 mb-4">
                    {summary.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {summary.map((challenge: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded shadow-sm bg-white"
                                >
                                    <h2 className="text-lg font-semibold mb-2">
                                        {challenge.question}
                                    </h2>
                                    <p className="text-gray-700 mb-2">
                                        {challenge.explanation}
                                    </p>
                                    <p className="font-bold text-green-600">
                                        Correct Answer:{" "}
                                        {challenge.correctAnswer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        );
    }
    const title =
        challenge.type === "ASSIST"
            ? "Select the correct meaning"
            : challenge.question;

    return (
        <>
            {correctAudio}
            {incorrectAudio}
            <Header
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className=" lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start mt-3 font-bold text-neutral-700 ">
                            {title}
                        </h1>
                        {questionImageSrc && (
                            <div className="relative w-full rounded-lg overflow-hidden">
                                <img
                                    src={questionImageSrc}
                                    alt={questionImageSrc}
                                    className=""
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question} />
                            )}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {status !== "none" && challenge.explanation && (
                <div className="max-w-[1140px] mx-auto mb-4">
                    <div
                        className={`mt-4 p-4 rounded-lg ${
                            status === "correct" ? "bg-green-100" : "bg-red-100"
                        } text-neutral-700`}
                    >
                        <h1 className="font-bold text-lg">Explanation:</h1>
                        <h2 className="font-bold text-md">
                            {status === "correct"
                                ? "Correct Answer!"
                                : "Incorrect Answer!"}
                        </h2>
                        <p>{challenge.explanation}</p>
                    </div>
                </div>
            )}

            <Footer
                status={status}
                onCheck={onContinue} // Functie voor de Check-knop
                onPrevious={() =>
                    setActiveIndex((current) => Math.max(0, current - 1))
                } // Ga één vraag terug
                disablePrevious={activeIndex === 0} // Schakel Vorige-knop uit bij de eerste vraag
                disabled={!selectedOption} // Check-knop uitschakelen als geen optie is geselecteerd
                lessonId={lessonId}
            />
        </>
    );
};

export default Quiz;
