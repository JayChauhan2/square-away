import '../index.css';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import KaTeXWrapper from './KaTeXWrapper';
// import FunctionPlot from "./FunctionPlot";

import JSXGraph from "./JSXGraph";

/////////////////////////

function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium text-center">
        {message}
      </p>
    </div>
  );
}

function QuestionSkeleton() {
  return (
    <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 animate-pulse">
      {/* Header */}
      <div className="mb-6 space-y-3">
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
      </div>

      {/* Question */}
      <div className="mb-8 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-full"></div>
        <div className="h-5 bg-gray-300 rounded w-5/6"></div>
        <div className="h-5 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>

      {/* Spinner Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
        <LoadingSpinner message="Generating your practice questions… this may take a moment." />
      </div>
    </div>
  );
}

export default function Questions() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [showSummary, setShowSummary] = useState(false); // NEW

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('http://127.0.0.1:5000/create-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic })
        });

        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
        <QuestionSkeleton />
      </div>
    );
  }

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
        const parsedAnswer = JSON.parse(userAnswer);
        return parsedAnswer[0].content === question.answer[0].content;
      } catch {
        return false;
      }
    }

    if (question.type === 'free' || question.type === 'word') {
      return userAnswer.includes(question.answer);
    }
  };

  const handleSelect = (value) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleFreeResponseChange = (e) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  const handleSubmit = () => {
    if (!answers[currentQuestion.id]) return;
    setSubmitted(prev => ({ ...prev, [currentQuestion.id]: true }));

    if (currentIndex === questions.length - 1) {
      setShowSummary(true); // Show summary on last question
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const correctCount = questions.filter(q => isCorrect(q)).length;

  // --- SUMMARY SCREEN (Organic / Fluid Style) ---
  if (showSummary) {
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-violet-50 flex items-center justify-center p-6">

        {/* Floating liquid accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative bg-white/70 backdrop-blur-xl w-full max-w-3xl rounded-3xl shadow-xl p-10">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-semibold text-gray-800 mb-3">
              Practice Complete
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Take a breath. Learning isn’t about perfection — it’s about flow,
              clarity, and momentum.
            </p>
          </div>

          {/* Score */}
          <div className="mb-10">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Your Progress</span>
              <span>{accuracy}% Mastery</span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-teal-400 to-purple-400 transition-all duration-700 ease-out"
                style={{ width: `${accuracy}%` }}
              />
            </div>

            <p className="text-center text-gray-700 mt-4">
              You answered <span className="font-medium">{correctCount}</span> out of{" "}
              <span className="font-medium">{questions.length}</span> questions correctly.
            </p>
          </div>

          {/* Question Review */}
          <div className="space-y-5 max-h-80 overflow-y-auto pr-2 mb-10">
            {questions.map((q, idx) => {
              const correct = isCorrect(q);
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-white shadow-sm border border-gray-100"
                >
                  <h3 className="font-medium text-gray-800 mb-2">
                    Question {idx + 1}
                  </h3>

                  <div className="text-gray-700 mb-3">
                    {q.question.map((part, i) =>
                      part.type === "text" ? (
                        <span key={i}>{part.content}</span>
                      ) : (
                        <KaTeXWrapper key={i}>{part.content}</KaTeXWrapper>
                      )
                    )}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Your Answer:</span>{" "}
                      {answers[q.id] || "No response"}
                    </p>
                    <p>
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {q.answer.map(a => a.content).join(", ")}
                    </p>
                  </div>

                  <p
                    className={`mt-3 font-medium ${
                      correct ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {correct ? "✓ Understood" : "○ Still forming"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {
                setShowSummary(false);
                setCurrentIndex(0);
                setSubmitted({});
                setAnswers({});
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
            >
              Continue the Flow
            </button>

            <button
              onClick={() => navigate('/practice')}
              className="px-8 py-3 rounded-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
            >
              Back to Practice Hub
            </button>
          </div>
        </div>
      </div>
    );
  }


  // --- QUESTION PAGE ---
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
          </h2>

          {/* Graphs */}
          {currentQuestion.graphs &&
            currentQuestion.graphs.map((graph, idx) => (
              <JSXGraph
                key={idx}
                equationType={graph.equationType}
                expr1={graph.expr1}
                expr2={graph.expr2}
                range={graph.range || [-10, 10]}
                width={graph.width || 300}
                height={graph.height || 200}
              />
            ))}

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

          {/* Submit / Next / Finish */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQuestion.id]}
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
            <button
              onClick={() => setShowSummary(true)}
              className="px-6 py-2 rounded bg-green-500 text-white"
            >
              Finish
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
