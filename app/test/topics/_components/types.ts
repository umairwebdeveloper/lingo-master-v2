// types.ts
export type ExamStatus = "In Progress" | "Complete" | "Fail";

export interface Exam {
    id: number;
    name: string;
    category: string;
    questionsCount: number;
    status: ExamStatus;
    progress: number; // 0 to 100
    correctCount: number;
    incorrectCount: number;
    questionCount: number;
}
