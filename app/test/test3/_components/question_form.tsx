import React, { useState, useEffect } from "react";

export interface QuestionFormData {
    selectedQuestionId: string;
    questionType: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    topicId: string;
    category: string;
    description: string;
    image: File | null;
    imageUrl?: string; // Optional URL for an existing image (edit mode)
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

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index] = value;
        setFormData((prev) => ({
            ...prev,
            options: updatedOptions,
        }));
    };

    // Special handler for file input
    const handleFileChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                image: e.target.files[0],
            }));
        }
    };

    // Local state to manage image preview URL.
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        // If a new file is selected, generate a preview URL.
        if (formData.image) {
            const objectUrl = URL.createObjectURL(formData.image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (formData.imageUrl) {
            // If editing and an existing image URL exists, use that.
            setPreview(formData.imageUrl);
        } else {
            setPreview(null);
        }
    }, [formData.image, formData.imageUrl]);

    // Function to remove the current image (both preview and reset the formData image fields)
    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
            imageUrl: undefined,
        }));
        setPreview(null);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="space-y-4"
        >
            <div>
                <label
                    htmlFor="topicId"
                    className="block text-sm font-medium text-gray-700"
                >
                    Select Topic
                </label>
                <select
                    id="topicId"
                    value={formData.topicId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="" disabled>
                        Select a topic
                    </option>
                    {topics.map((topic: any) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.topic}
                        </option>
                    ))}
                </select>
            </div>
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
                            correctAnswer: "", // reset correctAnswer on type change
                        }))
                    }
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="fill-in-the-blank">Fill in the Blank</option>
                </select>
            </div>
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
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="" disabled>
                        Select a category
                    </option>
                    <option value="Hazard Recognition">
                        Hazard Recognition
                    </option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Insight">Insight</option>
                </select>
            </div>
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
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            {/* New Description Field */}
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
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            {/* New Image Field */}
            <div>
                <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                >
                    Image (optional)
                </label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full"
                />
            </div>
            {/* Image Preview and Remove Button */}
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
                        className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                        Remove
                    </button>
                </div>
            )}
            {formData.questionType === "multiple-choice" && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Options
                    </label>
                    {formData.options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-2"
                            required
                        />
                    ))}
                </div>
            )}
            <div>
                <label
                    htmlFor="correctAnswer"
                    className="block text-sm font-medium text-gray-700"
                >
                    Correct Answer
                </label>
                {formData.questionType === "multiple-choice" ? (
                    <select
                        id="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="" disabled>
                            Select the correct option
                        </option>
                        {formData.options.map((_, index) => (
                            <option key={index} value={index + 1}>
                                Option {index + 1}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id="correctAnswer"
                        type="text"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                        placeholder="Enter the correct answer"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                )}
            </div>
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
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div className="flex space-x-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm ${
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
                        className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default QuestionForm;
