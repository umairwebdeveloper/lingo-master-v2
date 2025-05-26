"use client";
// components/Quiz.tsx
import React, { useState, useEffect } from "react";
import { quizData } from "./quizData";

interface TopicProgress {
  completed: boolean;
  correct: number;
  wrong: number;
}

const Quiz: React.FC = () => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [fillInAnswer, setFillInAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});

  useEffect(() => {
    const storedProgress = localStorage.getItem("quizProgress");
    if (!storedProgress) {
      localStorage.setItem("quizProgress", JSON.stringify({}));
    } else {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem("quizProgress", JSON.stringify(progress));
    }
  }, [progress]);

  const handleTopicSelect = (index: number) => {
    const topicId = quizData[index].id;
    if (progress[topicId]?.completed) {
      alert("This topic is already completed!");
      return;
    }

    setSelectedTopicIndex(index);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption("");
    setFillInAnswer("");
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === currentQuestion?.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleFillInSubmit = () => {
    setShowExplanation(true);
    if (
      fillInAnswer.trim().toLowerCase() ===
      currentQuestion?.correctAnswer.toLowerCase()
    ) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption("");
    setFillInAnswer("");

    if (currentQuestionIndex < currentTopic.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Mark topic as completed
      const topicId = currentTopic.id;
      setProgress((prevProgress) => ({
        ...prevProgress,
        [topicId]: {
          completed: true,
          correct: score,
          wrong: currentTopic.questions.length - score,
        },
      }));
      setQuizCompleted(true);
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopicIndex(null);
  };

  const isTopicLocked = (index: number) => {
    const topicId = quizData[index].id;

    // Unlock the first topic or topics immediately after a completed topic
    if (index === 0) return false;
    const previousTopicId = quizData[index - 1].id;
    return !progress[previousTopicId]?.completed;
  };

  const currentTopic:any =
    selectedTopicIndex !== null ? quizData[selectedTopicIndex] : null;
  const currentQuestion:any =
    currentTopic !== null ? currentTopic.questions[currentQuestionIndex] : null;

  return (
    <div className="max-w-4xl mx-auto p-5">
      {selectedTopicIndex === null ? (
        <div>
          <h1 className="text-3xl font-bold text-center mb-5">Quiz Topics</h1>
          <ul className="space-y-4">
            {quizData.map((topic, index) => (
              <li
                key={topic.id}
                className={`p-4 rounded-lg flex items-center ${
                  isTopicLocked(index)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
                }`}
                onClick={() =>
                  !isTopicLocked(index) && handleTopicSelect(index)
                }
              >
                <img
                  src={topic.topicImage}
                  alt={topic.topic}
                  className="w-16 h-16 mr-4 rounded-lg"
                />
                <div>
                  <h2>{topic.topic}</h2>
                  {progress[topic.id]?.completed && (
                    <p className="text-sm text-green-500">
                      Completed: {progress[topic.id].correct} Correct,{" "}
                      {progress[topic.id].wrong} Wrong
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : quizCompleted ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-lg mb-6">
            Your score: {score}/{currentTopic?.questions.length}
          </p>
          <button
            onClick={handleBackToTopics}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Back to Topics
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Topic: {currentTopic?.topic}
          </h1>
          <h2 className="text-xl mb-2">
            Question: {currentQuestion?.question}
          </h2>
          {currentQuestion?.image && (
            <img
              src={currentQuestion.image}
              alt="Question"
              className="w-full h-auto mb-4 rounded-lg"
            />
          )}
          {currentQuestion?.type === "multiple-choice" ? (
            <div className="mb-4">
              {currentQuestion.options.map((option:any, index:any) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={!!selectedOption}
                  className={`block w-full text-left p-3 my-2 rounded-lg border ${
                    selectedOption === option
                      ? option === currentQuestion.correctAnswer
                        ? "bg-green-500 text-white border-green-600"
                        : "bg-red-500 text-white border-red-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="text"
                value={fillInAnswer}
                onChange={(e) => setFillInAnswer(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2"
                placeholder="Type your answer here"
                disabled={showExplanation}
              />
              {!showExplanation && (
                <button
                  onClick={handleFillInSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              )}
            </div>
          )}
          {showExplanation && (
            <p className="text-sm text-gray-700 mb-4">
              {selectedOption === currentQuestion.correctAnswer ||
              fillInAnswer.trim().toLowerCase() ===
                currentQuestion.correctAnswer.toLowerCase()
                ? "Correct! " + currentQuestion.explanation
                : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`}
            </p>
          )}
          <div className="flex justify-end mt-4">
            {showExplanation && (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {currentQuestionIndex < currentTopic.questions.length - 1
                  ? "Next"
                  : "Complete"}
              </button>
            )}
          </div>
          <button
            onClick={handleBackToTopics}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
          >
            Back to Topics
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
