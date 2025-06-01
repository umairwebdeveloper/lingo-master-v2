// QuizQuestionManager.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "@/components/back-button";
import QuestionForm, { QuestionFormData } from "./_components/question_form";
import QuestionList from "./_components/question_list";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const QuizQuestionManager = () => {
    const [topics, setTopics] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [formData, setFormData] = useState<QuestionFormData>({
        selectedQuestionId: "",
        questionType: "multiple-choice", // default
        question: "",
        numOptions: 4, // ≤ 4
        options: ["", "", "", ""],
        optionImages: [null, null, null, null],
        correctAnswer: "",
        explanation: "",
        topicId: "",
        category: "",
        description: "",
        image: null,
        imageUrl: undefined,
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchTopicsAndQuestions = async () => {
        try {
            const topicsResponse = await axios.get("/api/topics");
            setTopics(topicsResponse.data);

            const questionsResponse = await axios.get("/api/questions");
            setQuestions(questionsResponse.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchTopicsAndQuestions();
    }, []);

    const resetForm = () => {
        setFormData({
            selectedQuestionId: "",
            questionType: "multiple-choice",
            question: "",
            numOptions: 4,
            options: ["", "", "", ""],
            optionImages: [null, null, null, null],
            correctAnswer: "",
            explanation: "",
            topicId: "",
            category: "",
            description: "",
            image: null,
            imageUrl: undefined,
        });
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const payload = new FormData();
            payload.append("question_type", formData.questionType);
            payload.append("question", formData.question);

            // Only send as many options as numOptions
            const trimmedOptions = formData.options.slice(
                0,
                formData.numOptions
            );
            payload.append("options", JSON.stringify(trimmedOptions));

            // Determine correctAnswer value
            if (formData.questionType === "multiple-choice") {
                // correctAnswer holds the 1-based index
                const idx = Number(formData.correctAnswer) - 1;
                payload.append("correctAnswer", trimmedOptions[idx] || "");
            } else {
                // for "multiple-choice-with-image" or others, use the raw value
                payload.append("correctAnswer", formData.correctAnswer);
            }

            payload.append("explanation", formData.explanation);
            payload.append("topicId", formData.topicId);
            payload.append("category", formData.category);
            payload.append("description", formData.description);

            if (formData.image) {
                payload.append("image", formData.image);
            }
            if (formData.selectedQuestionId) {
                payload.append("id", formData.selectedQuestionId);
            }

            // For image-based options, append only the first numOptions files
            if (formData.questionType === "multiple-choice-with-image") {
                formData.optionImages
                    .slice(0, formData.numOptions)
                    .forEach((file, index) => {
                        if (file) {
                            payload.append(`optionImages[]`, file);
                        }
                    });
            }

            if (formData.selectedQuestionId) {
                await axios.put("/api/questions", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSuccessMessage("Question updated successfully!");
                toast.success("Question updated successfully!");
            } else {
                await axios.post("/api/questions", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSuccessMessage("Question created successfully!");
                toast.success("Question created successfully!");
            }

            await fetchTopicsAndQuestions();
            resetForm();
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to save question. Try again."
            );
            toast.error("Failed to save question. Try again.");
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) {
            return;
        }

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await axios.delete("/api/questions", { data: { id } });
            setSuccessMessage("Question deleted successfully!");
            toast.success("Question deleted successfully!");
            await fetchTopicsAndQuestions();
            resetForm();
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to delete question. Try again."
            );
            toast.error("Failed to delete question. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        const questionToEdit = questions.find((q: any) => q.id === id);
        if (questionToEdit) {
            const existingOptions: string[] = questionToEdit.options || [];
            const count = Math.min(existingOptions.length, 4);
            setFormData({
                selectedQuestionId: id,
                questionType: questionToEdit.question_type,
                question: questionToEdit.question,
                numOptions: count || 4,
                options: [
                    existingOptions[0] || "",
                    existingOptions[1] || "",
                    existingOptions[2] || "",
                    existingOptions[3] || "",
                ],
                optionImages: [null, null, null, null],
                correctAnswer:
                    questionToEdit.question_type === "multiple-choice"
                        ? (
                              existingOptions.indexOf(
                                  questionToEdit.correctAnswer
                              ) + 1
                          ).toString()
                        : questionToEdit.correctAnswer,
                explanation: questionToEdit.explanation,
                topicId: questionToEdit.topicId,
                category: questionToEdit.category,
                description: questionToEdit.description || "",
                image: null,
                imageUrl: questionToEdit.image || undefined,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="md:w-[450px] mx-auto my-4 bg-white p-4 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
                Manage Questions
            </h2>
            {successMessage && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}
            <QuestionForm
                topics={topics}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
                onCancel={resetForm}
                loading={loading}
            />
            <QuestionList
                topics={topics}
                questions={questions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default QuizQuestionManager;
