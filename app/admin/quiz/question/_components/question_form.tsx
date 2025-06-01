// _components/question_form.tsx
import React, { useState, useEffect } from "react";

export interface QuestionFormData {
    selectedQuestionId: string;
    questionType: string;
    question: string;
    numOptions: number; // new
    options: string[];
    optionImages: (File | null)[];
    correctAnswer: string;
    explanation: string;
    topicId: string;
    category: string;
    description: string;
    image: File | null;
    imageUrl?: string;
}

interface QuestionFormProps {
    topics: any[];
    formData: QuestionFormData;
    setFormData: React.Dispatch<React.SetStateAction<QuestionFormData>>;
    onSubmit: () => void;
    onCancel: () => void;
    loading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
    topics,
    formData,
    setFormData,
    onSubmit,
    onCancel,
    loading,
}) => {
    const handleInputChange = (
        e:
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleNumOptionsChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const count = Number(e.target.value);
        // Truncate or pad the options array to length = count
        setFormData((prev) => {
            const newOptions = [...prev.options].slice(0, count);
            while (newOptions.length < count) newOptions.push("");
            const newOptionImages = [...prev.optionImages].slice(0, count);
            while (newOptionImages.length < count) newOptionImages.push(null);
            return {
                ...prev,
                numOptions: count,
                options: newOptions,
                optionImages: newOptionImages,
                correctAnswer: "", // reset chosen answer
            };
        });
    };

    const handleOptionChange = (index: number, value: string) => {
        setFormData((prev) => {
            const updated = [...prev.options];
            updated[index] = value;
            return {
                ...prev,
                options: updated,
            };
        });
    };

    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files[0],
            }));
        }
    };

    const handleOptionFileChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => {
                const newOptionImages = [...prev.optionImages];
                newOptionImages[index] = file;
                return { ...prev, optionImages: newOptionImages };
            });
            const objectUrl = URL.createObjectURL(file);
            setOptionPreviews((prev) => {
                const newPrevs = [...prev];
                newPrevs[index] = objectUrl;
                return newPrevs;
            });
        }
    };

    const [preview, setPreview] = useState<string | null>(null);
    const [optionPreviews, setOptionPreviews] = useState<string[]>([
        "",
        "",
        "",
        "",
    ]);

    useEffect(() => {
        if (formData.image) {
            const objectUrl = URL.createObjectURL(formData.image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (formData.imageUrl) {
            setPreview(formData.imageUrl);
        } else {
            setPreview(null);
        }
    }, [formData.image, formData.imageUrl]);

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
            imageUrl: undefined,
        }));
        setPreview(null);
    };

    const handleRemoveOptionImage = (index: number) => {
        setFormData((prev) => {
            const arr = [...prev.optionImages];
            arr[index] = null;
            return { ...prev, optionImages: arr };
        });
        setOptionPreviews((prev) => {
            const arr = [...prev];
            arr[index] = "";
            return arr;
        });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            {/* Topic selector */}
            <div>
                <label
                    htmlFor="topicId"
                    className="block text-sm font-medium text-gray-700"
                >
                    Select Exam
                </label>
                <select
                    id="topicId"
                    value={formData.topicId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="" disabled>
                        Select an exam
                    </option>
                    {topics.map((topic: any) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.topic}
                        </option>
                    ))}
                </select>
            </div>

            {/* Question Type */}
            <div>
                <label
                    htmlFor="questionType"
                    className="block text-sm font-medium text-gray-700"
                >
                    Question Type
                </label>
                <select
                    id="questionType"
                    value={formData.questionType}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            questionType: e.target.value,
                            correctAnswer: "",
                        }))
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="multiple-choice-with-image">
                        Multiple Choice with Image
                    </option>
                    <option value="fill-in-the-blank">Fill in the Blank</option>
                </select>
            </div>

            {/* Category */}
            <div>
                <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                >
                    Category
                </label>
                <select
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="">Select a category</option>
                    <option value="Hazard Recognition">
                        Hazard Recognition
                    </option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Insight">Insight</option>
                </select>
            </div>

            {/* Question Text */}
            <div>
                <label
                    htmlFor="question"
                    className="block text-sm font-medium text-gray-700"
                >
                    Question
                </label>
                <textarea
                    id="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter your question"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter a description for the question"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            {/* Main Image */}
            <div>
                <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                >
                    Question Image
                </label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                    required
                />
            </div>
            {preview && (
                <div className="relative">
                    <p className="text-sm text-gray-700">Image Preview:</p>
                    <img
                        src={preview}
                        alt="Image preview"
                        className="mt-2 max-h-48"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Number of Options */}
            {(formData.questionType === "multiple-choice" ||
                formData.questionType === "multiple-choice-with-image") && (
                <div>
                    <label
                        htmlFor="numOptions"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Number of Options
                    </label>
                    <select
                        id="numOptions"
                        value={formData.numOptions}
                        onChange={handleNumOptionsChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </div>
            )}

            {/* Options Inputs */}
            {(formData.questionType === "multiple-choice" ||
                formData.questionType === "multiple-choice-with-image") && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Options
                    </label>
                    {formData.options
                        .slice(0, formData.numOptions)
                        .map((option, index) => (
                            <div key={index} className="mb-4">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    placeholder={`Option ${index + 1}`}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                                    required
                                />
                                {formData.questionType ===
                                    "multiple-choice-with-image" && (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleOptionFileChange(index, e)
                                            }
                                            required
                                        />
                                        {optionPreviews[index] && (
                                            <div className="relative">
                                                <img
                                                    src={optionPreviews[index]}
                                                    alt={`Option ${
                                                        index + 1
                                                    } preview`}
                                                    className="mt-2 h-16"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveOptionImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            )}

            {/* Correct Answer */}
            <div>
                <label
                    htmlFor="correctAnswer"
                    className="block text-sm font-medium text-gray-700"
                >
                    Correct Answer
                </label>
                {formData.questionType === "multiple-choice" ||
                formData.questionType === "multiple-choice-with-image" ? (
                    <select
                        id="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="" disabled>
                            Select the correct option
                        </option>
                        {Array.from({ length: formData.numOptions }).map(
                            (_, idx) => (
                                <option key={idx} value={idx + 1}>
                                    Option {idx + 1}
                                </option>
                            )
                        )}
                    </select>
                ) : (
                    <input
                        id="correctAnswer"
                        type="text"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                        placeholder="Enter the correct answer"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                )}
            </div>

            {/* Explanation */}
            <div>
                <label
                    htmlFor="explanation"
                    className="block text-sm font-medium text-gray-700"
                >
                    Explanation
                </label>
                <textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={handleInputChange}
                    placeholder="Provide an explanation for the answer"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>

            {/* Submit / Cancel */}
            <div className="flex space-x-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-full shadow-sm ${
                        loading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-indigo-700"
                    }`}
                >
                    {loading
                        ? formData.selectedQuestionId
                            ? "Updating..."
                            : "Creating..."
                        : formData.selectedQuestionId
                        ? "Update Question"
                        : "Create Question"}
                </button>
                {formData.selectedQuestionId && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-full shadow-sm hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default QuestionForm;
