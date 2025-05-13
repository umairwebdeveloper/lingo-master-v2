"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NextPage } from "next";
import ExamCard from "./_components/exam_card";
import { Exam } from "./_components/types";
import Loader from "@/components/loader";
import ErrorComponent from "@/components/error-component";
import ModeToggle from "./_components/mode_toggle";
import ExamTimer from "./_components/exam_timer";

// Define the type for the API exam data.
interface APICategoryStat {
    category: string;
    submissionCount: number;
    correctCount: number;
    incorrectCount: number;
    correctRatio: number;
}

interface APIExam {
    id: number;
    topic: string;
    category: string;
    questionCount: string;
    correctCount: string;
    incorrectCount: string;
    completedCount: string;
    categoryStats: APICategoryStat[];
}

// Define the API response that includes both exams and the allowed exam access count.
interface APIResponse {
    exams: APIExam[];
    examAccessCount: number; // The number of exams the user is allowed to access
}

const ExamsPage: NextPage = () => {
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("examMode") === "true";
        }
        return false;
    });
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axios
            .get<APIResponse>("/api/topics/user")
            .then((response) => {
                const apiExams: any = response.data;
                const transformedExams: any = apiExams.map((apiExam: any) => {
                    const questionsCount = Number(apiExam.questionCount);
                    const completedCount = Number(apiExam.completedCount);
                    const correctCount = Number(apiExam.correctCount);
                    const incorrectCount = Number(apiExam.incorrectCount);

                    const progress = questionsCount
                        ? Math.round((completedCount / questionsCount) * 100)
                        : 0;

                    let status = "";
                    if (
                        completedCount < questionsCount ||
                        questionsCount === 0
                    ) {
                        status = "Open";
                    } else {
                        const correctRatio = questionsCount
                            ? correctCount / questionsCount
                            : 0;
                        status = correctRatio >= 0.5 ? "Geslaagd" : "Gezakt";
                    }

                    return {
                        id: apiExam.id,
                        name: apiExam.topic,
                        category: apiExam.category,
                        questionsCount,
                        status,
                        progress,
                        correctCount,
                        incorrectCount,
                    };
                });

                setExams(transformedExams);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching exams:", err);
                setError("Failed to fetch exams.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <ErrorComponent message={error} />;
    }

    return (
        <div className="container max-w-[1650px] pt-1 px-3 md:px-6 pb-6">
            <ModeToggle enabled={enabled} onChange={setEnabled} />
            <ExamTimer
                examId="1"
                onComplete={() => console.log("complete")}
            />
            {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
            ))}
        </div>
    );
};

export default ExamsPage;
