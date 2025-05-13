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
        questionType: "multiple-choice", // default type; can also be "multiple-choice-with-image"
        question: "",
        options: ["", "", "", ""],
        // New field for storing images for each option (4 options by default)
        optionImages: [null, null, null, null],
        correctAnswer: "",
        explanation: "",
        topicId: "",
        category: "",
        description: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch topics and questions when the component mounts
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

    // Reset form fields
    const resetForm = () => {
        setFormData({
            selectedQuestionId: "",
            questionType: "multiple-choice",
            question: "",
            options: ["", "", "", ""],
            optionImages: [null, null, null, null],
            correctAnswer: "",
            explanation: "",
            topicId: "",
            category: "",
            description: "",
            image: null,
        });
    };

    // Handle form submission for create/update using FormData (for file upload)
    const handleFormSubmit = async () => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            // Create a FormData payload
            const payload = new FormData();
            payload.append("question_type", formData.questionType);
            payload.append("question", formData.question);
            // For both multiple-choice types, we send the text options as JSON.
            payload.append("options", JSON.stringify(formData.options));

            // If the question type is multiple-choice without image, use the selected text option.
            // For multiple-choice with image, your API might need to handle the accompanying images.
            payload.append(
                "correctAnswer",
                formData.questionType === "multiple-choice"
                    ? formData.options[Number(formData.correctAnswer) - 1]
                    : formData.correctAnswer
            );
            payload.append("explanation", formData.explanation);
            payload.append("topicId", formData.topicId);
            payload.append("category", formData.category);
            payload.append("description", formData.description);

            if (formData.image) {
                payload.append("image", formData.image);
            }
            // If updating an existing question, include its id.
            if (formData.selectedQuestionId) {
                payload.append("id", formData.selectedQuestionId);
            }

            // If the question type is "multiple-choice-with-image", append each option image if available.
            if (formData.questionType === "multiple-choice-with-image") {
                formData.optionImages.forEach((file, index) => {
                    if (file) {
                        payload.append(`optionImages[]`, file);
                    }
                });
            }

            if (formData.selectedQuestionId) {
                // Update question
                await axios.put("/api/questions", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSuccessMessage("Question updated successfully!");
                toast.success("Question updated successfully!");
            } else {
                // Create new question
                await axios.post("/api/questions", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSuccessMessage("Question created successfully!");
                toast.success("Question created successfully!");
            }

            // Refresh questions
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

    // Handle delete
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

    // Populate form for editing
    const handleEdit = (id: string) => {
        const questionToEdit = questions.find((q: any) => q.id === id);
        if (questionToEdit) {
            setFormData({
                selectedQuestionId: id,
                questionType: questionToEdit.question_type,
                question: questionToEdit.question,
                options: questionToEdit.options || ["", "", "", ""],
                // For multiple-choice without image, we compute the correct answer index.
                // For multiple-choice-with-image, you might also want to load saved option images.
                correctAnswer:
                    questionToEdit.question_type === "multiple-choice"
                        ? (
                              questionToEdit.options.indexOf(
                                  questionToEdit.correctAnswer
                              ) + 1
                          ).toString()
                        : questionToEdit.correctAnswer,
                explanation: questionToEdit.explanation,
                topicId: questionToEdit.topicId,
                category: questionToEdit.category,
                description: questionToEdit.description || "",
                image: null, // reset file input on edit
                imageUrl: questionToEdit.image || null,
                // When editing a "multiple-choice-with-image" question, you might set optionImages if available.
                optionImages:
                    questionToEdit.question_type ===
                    "multiple-choice-with-image"
                        ? [null, null, null, null]
                        : [null, null, null, null],
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="md:w-[450px] mx-auto my-4 bg-white p-4 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Manage Questions</h2>
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
