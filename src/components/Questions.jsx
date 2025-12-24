import '../index.css';

import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import KaTeXWrapper from './KaTeXWrapper';
import FunctionPlot from "./FunctionPlot";

/////////////////////////

export default function Questions() {
  const { topic } = useParams();
  console.log(topic);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({}); // NEW

  useEffect(() => {
    async function fetchQuestions() {
      try {
        // 1. Trigger backend to generate the questions
        const response = await fetch('http://127.0.0.1:5000/create-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        // 2. Parse the JSON returned by the backend
        const data = await response.json();
        console.log(data)
        // 3. Save it to state
        setQuestions(data); // assuming your backend returns the corrected JSON array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [topic]);


  if (loading) return <p>Loading questions...</p>;
  if (!questions.length) return <p>No questions found.</p>;

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const isSubmitted = submitted[currentQuestion.id];

  const isCorrect = (question) => {
    if (!submitted[question.id]) return null;

    const userAnswer = answers[question.id];
    if (!userAnswer) return null;

    if (question.type === 'mcq' || question.type === 'boolean') {
      try {
        const parsedAnswer = JSON.parse(userAnswer); // convert string back to array
        return parsedAnswer[0].content === question.answer[0].content;
      } catch {
        return false;
      }
    }

    if (question.type === 'free' || question.type === 'word') {
      return userAnswer
        .includes(question.answer);
    }
  };

  const handleSelect = (value) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleFreeResponseChange = (e) => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!answers[currentQuestion.id]) return;
    setSubmitted(prev => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Practice Questions - {topic}
          </h1>
          <p className="text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQuestion.question.map((part, idx) =>
              part.type === "text" ? (
                <span key={idx}>{part.content}</span>
              ) : (
                <KaTeXWrapper key={idx}>{part.content}</KaTeXWrapper>
              )
            )}

            {currentQuestion.graphs &&
              currentQuestion.graphs.map((graph, idx) => (
                <FunctionPlot key={idx} data={[graph]} />
              ))
            }
          </h2>

          {/* Boolean */}
          {currentQuestion.type === "boolean" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                    ${answers[currentQuestion.id] === JSON.stringify(option)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"}
                    ${isSubmitted ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={answers[currentQuestion.id] === JSON.stringify(option)}
                    onChange={() => handleSelect(JSON.stringify(option))}
                  />
                  {option.map((part, i) =>
                    part.type === "text" ? (
                      <span key={i}>{part.content}</span>
                    ) : (
                      <KaTeXWrapper key={i}>{part.content}</KaTeXWrapper>
                    )
                  )}
                </label>
              ))}
            </div>
          )}

          {/* MCQ */}
          {currentQuestion.type === "mcq" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                    ${answers[currentQuestion.id] === JSON.stringify(option)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"}
                    ${isSubmitted ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={answers[currentQuestion.id] === JSON.stringify(option)}
                    onChange={() => handleSelect(JSON.stringify(option))}
                  />
                  {option.map((part, i) =>
                    part.type === "text" ? (
                      <span key={i}>{part.content}</span>
                    ) : (
                      <KaTeXWrapper key={i}>{part.content}</KaTeXWrapper>
                    )
                  )}
                </label>
              ))}
            </div>
          )}

          {/* Free / Word */}
          {(currentQuestion.type === "free" || currentQuestion.type === "word") && (
            <div className="space-y-2">
              <textarea
                className="w-full h-32 p-4 border rounded-lg"
                value={answers[currentQuestion.id] || ""}
                onChange={handleFreeResponseChange}
                placeholder="Your Answer Here..."
                disabled={isSubmitted}
              />
            </div>
          )}

          {/* Feedback (AFTER submit only) */}
          {isCorrect(currentQuestion) === true && (
            <p className="text-green-600 mt-3">✔ Correct</p>
          )}
          {isCorrect(currentQuestion) === false && (
            <p className="text-red-600 mt-3">✘ Incorrect</p>
          )}
        </div>
        
        {/* --- Dev Navigation --- */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Dev Prev
          </button>
          <button
            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1))}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Dev Next
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          {/* Submit / Next */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQuestion.id]} // disable if no answer
              className={`px-6 py-2 rounded text-white transition-colors
                ${answers[currentQuestion.id] ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit
            </button>
          ) : currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded bg-blue-500 text-white"
            >
              Next
            </button>
          ) : (
            <button className="px-6 py-2 rounded bg-green-500 text-white">
              Finish
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
