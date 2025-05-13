"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
    ChartData,
    TimeScale,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { DateRangePicker as DateRangePickerBase } from "react-date-range";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Loader from "@/components/loader";
import { Albert_Sans } from '@next/font/google';
import { Inter } from '@next/font/google';



const albertSans = Albert_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})


ChartJS.register(
    Filler,
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DateRangePicker: any = DateRangePickerBase;
const today = new Date();
const pastSevenDays = new Date(today);
pastSevenDays.setDate(today.getDate() - 7);

type ViewMode = "days";

const TABS = [
    { label: "Days", value: "days" },
];

const Chart = () => {
    // Date range picker state with default values
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: pastSevenDays,
            endDate: today,
            key: "selection",
        },
    ]);

    // New state for view mode: "days", "weeks", or "months"
    const [viewMode, setViewMode] = useState<ViewMode>("days");

    // State to store fetched chart data and raw data for re-aggregation
    const [chartData, setChartData] = useState<ChartData<"line">>({
        labels: [],
        datasets: [],
    });
    const [rawData, setRawData] = useState<any[]>([]);

    // Loading state to show a loading indicator
    const [loading, setLoading] = useState<boolean>(false);

    // Refs for the date button and the popover container
    const dateButtonRef = useRef<HTMLButtonElement>(null);
    const datePopoverRef = useRef<HTMLDivElement>(null);

    // Hide the date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                datePopoverRef.current &&
                !datePopoverRef.current.contains(e.target as Node) &&
                dateButtonRef.current &&
                !dateButtonRef.current.contains(e.target as Node)
            ) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Hardcoded values for "Other Users" per day of week (in minutes)
    const otherUserHardcodedValues: { [key: number]: number } = {
        0: 50,
        1: 70,
        2: 30,
        3: 80,
        4: 60,
        5: 90,
        6: 40,
    };

    // Helper function to aggregate raw data based on view mode.
    function aggregateData(data: any[], mode: ViewMode) {
        // If in "days" mode, just use each data point directly.
        if (mode === "days") {
            const labels = data.map((item) => item.date);
            const totalData = data.map((item) =>
                Math.floor(item.timeSpent / 60)
            );
            const otherUserData = data.map((item) => {
                const day = new Date(item.date).getDay();
                return otherUserHardcodedValues[day] || 0;
            });
            return { labels, totalData, otherUserData };
        } else {
            // Otherwise, group by "weeks" or "months"
            const groups: { [key: string]: any[] } = {};
            data.forEach((item) => {
                const date = new Date(item.date);
                let key = "";
                if (mode === "weeks") {
                    // e.g., "2023-W12"
                    key = format(date, "yyyy-'W'ww");
                } else if (mode === "months") {
                    // e.g., "2023-02"
                    key = format(date, "yyyy-MM");
                }
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(item);
            });

            // Sort keys so data appears in chronological order
            const sortedKeys = Object.keys(groups).sort();
            const labels: string[] = [];
            const totalData: number[] = [];
            const otherUserData: number[] = [];

            sortedKeys.forEach((key) => {
                const groupItems = groups[key];
                labels.push(key);
                const sumTotal = groupItems.reduce(
                    (acc, item) => acc + Math.floor(item.timeSpent / 60),
                    0
                );
                totalData.push(sumTotal);

                const sumOther = groupItems.reduce((acc, item) => {
                    const day = new Date(item.date).getDay();
                    return acc + (otherUserHardcodedValues[day] || 0);
                }, 0);
                otherUserData.push(sumOther);
            });

            return { labels, totalData, otherUserData };
        }
    }

    // Fetch raw chart data from the API when the date range changes.
    useEffect(() => {
        async function fetchChartData() {
            setLoading(true);
            try {
                const start = dateRange[0].startDate
                    ? format(dateRange[0].startDate, "yyyy-MM-dd")
                    : "";
                const end = dateRange[0].endDate
                    ? format(dateRange[0].endDate, "yyyy-MM-dd")
                    : "";

                const response = await axios.get(
                    `/api/track-time?startDate=${start}&endDate=${end}`
                );
                const data = response.data.data;
                setRawData(data);

                // Aggregate data based on current view mode
                const aggregated = aggregateData(data, viewMode);
                setChartData({
                    labels: aggregated.labels,
                    datasets: [
                        {
                            label: "Jij",
                            data: aggregated.totalData,
                            borderColor: "#4299e1",
                            tension: 0.4,
                            fill: "origin",
                            backgroundColor: (context: any) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) {
                                    return "rgba(66, 153, 225, 0.2)";
                                }
                                const gradient = ctx.createLinearGradient(
                                    0,
                                    chartArea.top,
                                    0,
                                    chartArea.bottom
                                );
                                gradient.addColorStop(
                                    0,
                                    "rgba(66, 153, 225, 0.5)"
                                );
                                gradient.addColorStop(
                                    1,
                                    "rgba(66, 153, 225, 0)"
                                );
                                return gradient;
                            },
                        },
                        {
                            label: "Other Users",
                            data: aggregated.otherUserData,
                            borderColor: "#FBBF24",
                            tension: 0.4,
                            fill: "origin",
                            backgroundColor: (context: any) => {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) {
                                    return "rgba(251, 191, 36, 0.2)";
                                }
                                const gradient = ctx.createLinearGradient(
                                    0,
                                    chartArea.top,
                                    0,
                                    chartArea.bottom
                                );
                                gradient.addColorStop(
                                    0,
                                    "rgba(251, 191, 36, 0.5)"
                                );
                                gradient.addColorStop(
                                    1,
                                    "rgba(251, 191, 36, 0)"
                                );
                                return gradient;
                            },
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching chart data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchChartData();
    }, [dateRange]);

    // Re-aggregate and update chart data when view mode changes.
    useEffect(() => {
        if (rawData.length > 0) {
            const aggregated = aggregateData(rawData, viewMode);
            setChartData({
                labels: aggregated.labels,
                datasets: [
                    {
                        label: "Jij",
                        data: aggregated.totalData,
                        borderColor: "#4299e1",
                        tension: 0.4,
                        fill: "origin",
                        backgroundColor: (context: any) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) {
                                return "rgba(66, 153, 225, 0.2)";
                            }
                            const gradient = ctx.createLinearGradient(
                                0,
                                chartArea.top,
                                0,
                                chartArea.bottom
                            );
                            gradient.addColorStop(0, "rgba(66, 153, 225, 0.5)");
                            gradient.addColorStop(1, "rgba(66, 153, 225, 0)");
                            return gradient;
                        },
                    },
                    {
                        label: "Anderen",
                        data: aggregated.otherUserData,
                        borderColor: "#FBBF24",
                        tension: 0.4,
                        fill: "origin",
                        backgroundColor: (context: any) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) {
                                return "rgba(251, 191, 36, 0.2)";
                            }
                            const gradient = ctx.createLinearGradient(
                                0,
                                chartArea.top,
                                0,
                                chartArea.bottom
                            );
                            gradient.addColorStop(0, "rgba(251, 191, 36, 0.5)");
                            gradient.addColorStop(1, "rgba(251, 191, 36, 0)");
                            return gradient;
                        },
                    },
                ],
            });
        }
    }, [viewMode, rawData]);
    

    // Chart options
    const chartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 20,
                    callback: function (value: number) {
                        return `${value} m`;
                    },
                },
                grid: {
                    display: false,
                },
                title: {
                    display: false,
                },
            },
            x: {
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "dd",
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            tooltip: {
                backgroundColor: "#ffffff",
                titleColor: "#000000",
                bodyColor: "#000000",
                borderColor: "#e2e8f0",
                borderWidth: 1,
                mode: "index",
                intersect: false,
                callbacks: {
                    title: function (context: any) {
                        const dateLabel = context[0].label;
                        const dateObj = new Date(dateLabel);
                        return format(dateObj, "MMM d, yyyy");
                    },
                    label: function (context: TooltipItem<"line">) {
                        const label = context.dataset.label || "";
                        const value = context.parsed.y;
                        return `${label}: ${value} m`;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
    };

    // Format the date range text (e.g., "14 Feb - 21 Feb")
    const startText = dateRange[0].startDate
        ? format(dateRange[0].startDate, "dd MMM")
        : "";
    const endText = dateRange[0].endDate
        ? format(dateRange[0].endDate, "dd MMM")
        : "";

    // Determine the active tab's index so we can animate the slider
    const activeIndex = TABS.findIndex((t) => t.value === viewMode);

    return (
        <div className="relative">
            <div className="p-[20px] bg-white rounded-3xl border">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between">
                    <h1 className={`${albertSans.className} text-2xl text-[#3D3D3D] font-semibold leading-normal`}>
                        Productiviteit
                    </h1>
                    <div className="flex gap-3">
                       
                        <div className="relative">
                            <button
                                ref={dateButtonRef}
                                onClick={() =>
                                    setShowDatePicker((prev) => !prev)
                                }
                                className="mt-2 md:mt-0 bg-gray-100 text-gray-600 py-[10px] px-[20px] rounded-full hover:bg-gray-200 flex items-center space-x-1 border-1"

                            >
                                <ChevronLeft size={16} />
                                <span className={`${inter.className} text-[14px] font-medium leading-[150%] text-[#6D6D6D]`}>
                                    {startText} - {endText}
                                </span>
                                <ChevronRight size={16} />
                            </button>

                            {showDatePicker && (
                                <div
                                    ref={datePopoverRef}
                                    className="absolute right-0 my-2 bg-white p-4 shadow-lg z-50 rounded border-2"
                                >
                                    <DateRangePicker
                                        onChange={(item: any) =>
                                            setDateRange([item.selection])
                                        }
                                        ranges={dateRange}
                                        moveRangeOnFirstSelection={false}
                                        rangeColors={["#3B82F6"]}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="mt-6 h-64 flex items-center justify-center">
                    {loading ? (
                        <Loader />
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chart;
