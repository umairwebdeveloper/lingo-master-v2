// dataService.ts

const API_BASE_URL = "https://your-api-url.com"; // Replace with your API URL

export const createTopic = async (topic: {
    id: string;
    topic: string;
    topicImage: string;
}) => {
    return ""
};

export const createQuestion = async (question: {
    topicId: string;
    type: string;
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
    image?: string;
}) => {
    return ""
};
