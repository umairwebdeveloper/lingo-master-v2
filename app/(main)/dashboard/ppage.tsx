"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
// import { useRedirectIfNoPayment } from "@/lib/useRedirectIfNoPayment";
import VideoSection from "./video-section";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import axios from "axios";
import Link from "next/link";
import "react-circular-progressbar/dist/styles.css";
// import { Header } from "./header";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    // const { loading, responseData }: any = useRedirectIfNoPayment();
    // const [practiceExam, setPracticeExam] = useState<any>(null);
    // const [examLoading, setExamLoading] = useState(true);

    // Ensure `responseData` is valid before accessing its properties
    // const totalDays = responseData?.totalDays || 0;
    // const daysLeft = responseData?.daysLeft || 0;

    // Calculate percentage safely
    // const percentage =
    //     totalDays > 0 ? ((totalDays - daysLeft) / totalDays) * 100 : 0;

    const data = {
        labels: ["ma", "di", "wo", "do", "vr", "za", "zo"],
        datasets: [
            {
                label: "Jij",
                data: [2, 2.5, 2, 1.8, 2.2, 2.5, 3],
                borderColor: "#1E40AF",
                backgroundColor: "rgba(30, 64, 175, 0.1)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Andere cursisten",
                data: [1.8, 2, 2.5, 2, 1.7, 2, 2.2],
                borderColor: "#F59E0B",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Fetch Practice Exam data from API
    // useEffect(() => {
    //     const fetchPracticeExam = async () => {
    //         try {
    //             setExamLoading(true);
    //             const res = await axios.get("/api/challenges/progress");
    //             setPracticeExam(res.data);
    //         } catch (error) {
    //             console.error("Error fetching practice exam data:", error);
    //         } finally {
    //             setExamLoading(false);
    //         }
    //     };

    //     fetchPracticeExam();
    // }, []);

    // if (loading || examLoading) {
    //     return <div className="text-center mt-5">Loading...</div>;
    // }

    // if (!responseData) {
    //     return (
    //         <div className="text-center mt-5">
    //             No payment data available. Please check your subscription.
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="container py-6 mt-5">
                <div className="grid grid-cols-1 gap-5">
                    {/* <VideoSection /> */}
                </div>
                {/* Week Streak, Huidig Pakket, and Productiviteit */}
                <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-[30%,30%,30%] mb-8">
                    <div className="border-2 rounded-xl p-4 space-y-4">
                        <h2 className="text-xl font-bold">Practice exam</h2>
                        <Link href={"/learn"}>
                            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                                Start →
                            </button>
                        </Link>
                        {/* <div style={{ marginTop: "3rem" }}>
                            <div className="flex justify-between items-center w-100">
                                <span>
                                    Exam {practiceExam.completedChallenges} by{" "}
                                    {practiceExam.totalChallenges}
                                </span>
                                <span>{practiceExam.progressPercentage}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                        width: `${practiceExam.progressPercentage}%`,
                                    }}
                                />
                            </div>
                        </div> */}
                    </div>

                    {/* Right Column: Productiviteit */}
                    <div className="border-2 rounded-xl p-4 space-y-4 col-span-2 md:col-span-1">
                        <h3 className="text-lg font-semibold">
                            Productiviteit
                        </h3>
                        <Line data={data} />
                    </div>
                    {/* <div className="border-2 rounded-xl p-4 space-y-4 col-span-2 md:col-span-1">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Remaining Time
                            </h2>
                            <span className="text-sm bg-blue-300 rounded px-1">
                                {responseData?.payment?.planType}
                            </span>
                        </div>
                        <div className="flex justify-center items-center">
                            <div style={{ width: 120, height: 120 }}>
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${daysLeft} days left`}
                                    styles={buildStyles({
                                        textColor: "#4caf50",
                                        pathColor: "#4caf50",
                                        trailColor: "#d6d6d6",
                                        textSize: "12px",
                                    })}
                                />
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
