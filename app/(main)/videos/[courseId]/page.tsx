import { Header } from "../header";
import UnitsWithVideos from "./units-videos";
import { courses } from "@/db/schema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";

type Props = {
    params: {
        courseId: number;
    };
};

const CoursePage = async ({ params }: Props) => {
    const course: any = await db.query.courses.findFirst({
        where: eq(courses.id, params.courseId),
    });

    return (
        <div>
            <Header title={course.title} />
            <UnitsWithVideos courseId={params.courseId} />
        </div>
    );
};

export default CoursePage;
