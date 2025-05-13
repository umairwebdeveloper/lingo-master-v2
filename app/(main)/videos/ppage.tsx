import { getCourses } from "@/db/queries";
import React from "react";
// import { redirect } from "next/navigation";
import List from "./list";

// import UnitsWithVideos from "./units-videos";

const LearnPage = async () => {
    const coursesData = getCourses();

    const [courses] = await Promise.all([coursesData]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl text-center font-bold text-neutral-700">
                Video Courses
            </h1>
            <List courses={courses} />
        </div>
    );
};

export default LearnPage;
