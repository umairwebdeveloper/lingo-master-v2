import { lessons, units } from "@/db/schema";
import VideoPlayer from "./lesson-button"

type unitProps = {
    id: number;
    order: number;
    title: string;
    description: string;
    lessons: (typeof lessons.$inferSelect & { completed: boolean })[];
    activeLesson: typeof lessons.$inferSelect & { unit: typeof units.$inferSelect } | undefined;
    activeLessonPercentage: number;
}

const Unit = ({
    id,
    order,
    title,
    description,
    lessons,
    activeLesson,
    activeLessonPercentage
}: unitProps) => {
    return (
        <>
            <div className="flex items-center justify-between w-full bg-green-500 rounded-xl text-white p-5">
                <div className="space-y-2 5">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <p className="text-lg">{description}</p>
                </div>
            </div>
            <div className="flex flex-col relative">
                {lessons.map((lesson, index) => {
                    const isCurrent = lesson.id === activeLesson?.id;
                    const isLocked = !lesson.completed && !isCurrent;
                    return <VideoPlayer key={lesson.id} />;
                })}
            </div>
        </>
    );
}

export default Unit