"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "@/components/back-button";
import Swal from "sweetalert2";


const TopicManager = () => {
    const [topics, setTopics] = useState([]); // Holds the list of topics
    const [selectedTopicId, setSelectedTopicId] = useState(""); // Currently selected topic ID
    const [topic, setTopic] = useState(""); // Exam name input
    const [topicImage, setTopicImage] = useState(""); // Exam image URL input
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch all topics when the component mounts
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get("/api/topics");
                setTopics(response.data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, []);

    // Handle topic selection
    const handleTopicSelect = (id: string) => {
        setSelectedTopicId(id);
        const selectedTopic: any = topics.find((t: any) => t.id === Number(id));
        if (selectedTopic) {
            setTopic(selectedTopic.topic);
            setTopicImage(selectedTopic.category);
        } else {
            setTopic("");
            setTopicImage("");
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            if (selectedTopicId) {
                // Update the selected topic
                const response = await axios.put("/api/topics", {
                    id: selectedTopicId,
                    topic,
                    topicImage,
                });
                setSuccessMessage("Exam updated successfully!");
            } else {
                // Create a new topic
                const response = await axios.post("/api/topics", {
                    topic,
                    topicImage,
                });
                setSuccessMessage("Exam created successfully!");
            }

            // Refresh topics
            const updatedTopics = await axios.get("/api/topics");
            setTopics(updatedTopics.data);
            setSelectedTopicId("");
            setTopic("");
            setTopicImage("");
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to save exam. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!selectedTopicId) {
            setErrorMessage("Please select a exam to delete.");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
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
            const response = await axios.delete("/api/topics", {
                data: { id: selectedTopicId },
            });
            setSuccessMessage("Exam deleted successfully!");

            // Refresh topics
            const updatedTopics = await axios.get("/api/topics");
            setTopics(updatedTopics.data);
            setSelectedTopicId("");
            setTopic("");
            setTopicImage("");
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Failed to delete exam. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:w-[450px] mx-auto">
            <h2 className="text-2xl font-bold my-4">Manage Exams</h2>
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="topicSelect"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Select Exam
                    </label>
                    <select
                        id="topicSelect"
                        value={selectedTopicId}
                        onChange={(e) => handleTopicSelect(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Create a new exam</option>
                        {topics.map((topic: any) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.topic}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="topic"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Exam Name
                    </label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter topic name"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="topicImage"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Exam Category
                    </label>
                    <input
                        id="topicImage"
                        type="text"
                        value={topicImage}
                        onChange={(e) => setTopicImage(e.target.value)}
                        placeholder="Enter exam category"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
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
                            ? selectedTopicId
                                ? "Updating..."
                                : "Creating..."
                            : selectedTopicId
                            ? "Update Exam"
                            : "Create Exam"}
                    </button>
                    {selectedTopicId && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className={`w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-2xl shadow-sm ${
                                loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-red-700"
                            }`}
                        >
                            {loading ? "Deleting..." : "Delete Exam"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TopicManager;
