import Quiz from "./_components/quiz";


export default function QuizPage() {
    const topicId = 1;
    const showAnswers = true;

    return (
        <div>
            <Quiz topicId={topicId} showExistingAnswers={showAnswers} />
        </div>
    );
}
