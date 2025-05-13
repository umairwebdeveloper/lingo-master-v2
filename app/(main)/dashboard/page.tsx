import type { NextPage } from "next";
import Chart from "./_components/chart_card";
import PackageCard from "./_components/package_card";
import WeekStreakCard from "./_components/streak_card";
import ExamCard from "./_components/exam_card";
import VideoCard from "./_components/video_card";

const Home: NextPage = () => {
    return (
        <div className="container max-w-[1650px] px-3 md:px-6 pt-1 pb-5 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-4">
                <div className="col-span-2">
                    <VideoCard className="p-[20px] gap-5 rounded-3xl" />
                </div>
                <div>
                    <ExamCard className="p-[20px] h-full rounded-3xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-4">
                <div className="col-span-2 h-fit">
                    <Chart />
                </div>
                <div className="flex flex-col col-span-1 gap-y-4">
                    <WeekStreakCard />
                    <PackageCard />
                </div>
            </div>
        </div>
    );
};

export default Home;
