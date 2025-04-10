import { useEffect, useState } from "react";
import he from "he";
import { APIQuestion, QuizQuestion } from "../types/question";

const shuffle = (arr: string[]) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10")
      .then((res) => res.json())
      .then((data) => {
        const formatted: QuizQuestion[] = data.results.map((q: APIQuestion) => ({
          question: he.decode(q.question),
          correct: he.decode(q.correct_answer),
          options: shuffle([
            he.decode(q.correct_answer),
            ...q.incorrect_answers.map(he.decode),
          ]),
        }));
        setQuestions(formatted);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (answer: string) => {
    if (answer === questions[current].correct) {
      setScore((prev) => prev + 1);
    }

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading questions...</div>;

  if (finished) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="mt-4">Your score: {score} / {questions.length}</p>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">{q.question}</h2>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
