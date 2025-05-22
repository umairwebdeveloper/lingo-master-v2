import React from "react";

interface QuestionListProps {
    topics: any[];
    questions: any[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
    topics,
    questions,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-2">Existing Questions</h3>
            {topics.map((topic: any) => {
                // Filter questions for the current topic
                const topicQuestions = questions.filter(
                    (q: any) => q.topicId === topic.id
                );
                if (topicQuestions.length === 0) return null;

                return (
                    <div key={topic.id} className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">
                            {topic.topic}
                        </h4>
                        <ul className="space-y-2">
                            {topicQuestions.map((q: any) => (
                                <li
                                    key={q.id}
                                    className="p-4 bg-gray-100 rounded-md shadow-sm flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {q.question}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Question Type: {q.question_type}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEdit(q.id)}
                                            className="py-1 px-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(q.id)}
                                            className="py-1 px-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default QuestionList;
