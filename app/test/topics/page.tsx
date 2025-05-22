"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NextPage } from "next";
import ExamCard from "./_components/exam_card";
import { Exam } from "./_components/types";

// Define the type for the API exam data.
interface APIExam {
    id: number;
    topic: string;
    category: string;
    questionCount: string;
    correctCount: string;
    incorrectCount: string;
    completedCount: string;
}

const ExamsPage: NextPage = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axios
            .get<APIExam[]>("/api/topics/user")
            .then((response) => {
                const apiExams = response.data;
                const transformedExams: any = apiExams.map((apiExam) => {
                    const questionsCount = Number(apiExam.questionCount);
                    const completedCount = Number(apiExam.completedCount);
                    const correctCount = Number(apiExam.correctCount);
                    const incorrectCount = Number(apiExam.incorrectCount);
                    const questionCount = Number(apiExam.questionCount);

                    const progress = questionsCount
                        ? Math.round((completedCount / questionsCount) * 100)
                        : 0;

                    let status = "";
                    if (
                        completedCount < questionsCount ||
                        questionsCount === 0
                    ) {
                        status = "In Progress";
                    } else {
                        const correctRatio = questionsCount
                            ? correctCount / questionsCount
                            : 0;
                        status = correctRatio >= 0.5 ? "Complete" : "Fail";
                    }

                    return {
                        id: apiExam.id,
                        name: apiExam.topic,
                        category: apiExam.category,
                        questionsCount: questionsCount,
                        status: status,
                        progress: progress,
                        correctCount: correctCount,
                        incorrectCount: incorrectCount,
                        questionCount: questionCount,
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
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
            ))}
        </div>
    );
};

export default ExamsPage;
