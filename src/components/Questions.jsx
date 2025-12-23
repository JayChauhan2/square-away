import '../index.css';

import { useState } from 'react';
import KaTeXWrapper from './KaTeXWrapper';
import FunctionPlot from "./FunctionPlot";

const QUESTIONS =[
{
id: 1,
type: 'boolean',
question: (
<>
True/False: If a function <KaTeXWrapper>{"f"}</KaTeXWrapper> is continuous on the closed interval <KaTeXWrapper>{"[a, b]"}</KaTeXWrapper> and differentiable on the open interval <KaTeXWrapper>{"(a, b)"}</KaTeXWrapper>, and <KaTeXWrapper>{"f(a) = f(b)"}</KaTeXWrapper>, then there must exist at least one value <KaTeXWrapper>{"c"}</KaTeXWrapper> in <KaTeXWrapper>{"(a, b)"}</KaTeXWrapper> such that <KaTeXWrapper>{"f'(c) = 0"}</KaTeXWrapper>.
</>
),
options: ["True", "False"],
answer: 'True',
graph: null
},
{
id: 2,
type: 'mcq',
question: (
<>
Which of the following conditions is NOT required to apply the Mean Value Theorem to a function <KaTeXWrapper>{"f"}</KaTeXWrapper> on the interval <KaTeXWrapper>{"[a, b]"}</KaTeXWrapper>?
</>
),
options: [
{label: <><KaTeXWrapper>{"f"}</KaTeXWrapper> is continuous on <KaTeXWrapper>{"[a, b]"}</KaTeXWrapper></>, value: "continuous"},
{label: <><KaTeXWrapper>{"f"}</KaTeXWrapper> is differentiable on <KaTeXWrapper>{"(a, b)"}</KaTeXWrapper></>, value: "differentiable"},
{label: <><KaTeXWrapper>{"f(a)"}</KaTeXWrapper> must equal <KaTeXWrapper>{"f(b)"}</KaTeXWrapper></>, value: "endpoints"},
{label: <><KaTeXWrapper>{"a < b"}</KaTeXWrapper></>, value: "interval"}
],
answer: 'f(a) must equal f(b)',
graph: null
},
{
id: 3,
type: 'free',
question: (
<>
Consider the function <KaTeXWrapper>{"f(x) = x^2 - 4x + 3"}</KaTeXWrapper> on the interval <KaTeXWrapper>{"[1, 3]"}</KaTeXWrapper>. Since <KaTeXWrapper>{"f(1) = 0"}</KaTeXWrapper> and <KaTeXWrapper>{"f(3) = 0"}</KaTeXWrapper>, Rolle's Theorem guarantees a value <KaTeXWrapper>{"c"}</KaTeXWrapper> such that <KaTeXWrapper>{"f'(c) = 0"}</KaTeXWrapper>. Find the value of <KaTeXWrapper>{"c"}</KaTeXWrapper>.
</>
),
answer: 'c = 2',
graph: [
{
fn: "x^2 - 4x + 3",
graphType: "polyline",
color: "blue",
}
]
},
{
id: 4,
type: 'word',
question: (
<>
A plane accelerates from rest to a speed of <KaTeXWrapper>{"160"}</KaTeXWrapper> mph over a distance of <KaTeXWrapper>{"2"}</KaTeXWrapper> miles. If the trip takes <KaTeXWrapper>{"0.025"}</KaTeXWrapper> hours, the average velocity is <KaTeXWrapper>{"80"}</KaTeXWrapper> mph. According to the Mean Value Theorem, if the position function is differentiable, must there be a specific moment where the instantaneous velocity is exactly <KaTeXWrapper>{"80"}</KaTeXWrapper> mph? Explain why.
</>
),
answer: (
<>
Yes. The Mean Value Theorem states that there exists a <KaTeXWrapper>{"c"}</KaTeXWrapper> where <KaTeXWrapper>{"f'(c) = \frac{f(b) - f(a)}{b - a}"}</KaTeXWrapper>. Here, the average velocity is <KaTeXWrapper>{"\frac{2 - 0}{0.025 - 0} = 80 \text{ mph}"}</KaTeXWrapper>, so the instantaneous velocity <KaTeXWrapper>{"v(c)"}</KaTeXWrapper> must equal <KaTeXWrapper>{"80 \text{ mph}"}</KaTeXWrapper> at some point.
</>
),
graph: null
},
{
id: 5,
type: 'mcq',
question: (
<>
For the function <KaTeXWrapper>{"f(x) = x^3 - x"}</KaTeXWrapper> on the interval <KaTeXWrapper>{"[0, 2]"}</KaTeXWrapper>, find all values of <KaTeXWrapper>{"c"}</KaTeXWrapper> that satisfy the conclusion of the Mean Value Theorem.
</>
),
options: [
{label: <KaTeXWrapper>{"c = \\frac{2}{\\sqrt{3}}"}</KaTeXWrapper>, value: "2/sqrt(3)"},
{label: <KaTeXWrapper>{"c = \\sqrt{\\frac{7}{3}}"}</KaTeXWrapper>, value: "sqrt(7/3)"},
{label: <KaTeXWrapper>{"c = 1"}</KaTeXWrapper>, value: "1"},
{label: <KaTeXWrapper>{"c = \\frac{4}{3}"}</KaTeXWrapper>, value: "4/3"}
],
answer: 'c = 2/sqrt(3)',
graph: [
{
fn: "x^3 - x",
graphType: "polyline",
color: "green",
},
{
fn: "3x - 2",
graphType: "polyline",
color: "red",
}
]
}
]

export default function Questions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({}); // NEW

  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / QUESTIONS.length) * 100;
  const isSubmitted = submitted[currentQuestion.id];

  const isCorrect = (question) => {
    if (!submitted[question.id]) return null;

    const userAnswer = answers[question.id];
    if (!userAnswer) return null;

    if (question.type === 'mcq' || question.type === 'boolean') {
      return userAnswer === question.answer;
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
    if (currentIndex < QUESTIONS.length - 1) {
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
            Practice Questions
          </h1>
          <p className="text-gray-600">
            Question {currentIndex + 1} of {QUESTIONS.length}
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
            {currentQuestion.question}
            {currentQuestion.graph && (
              <FunctionPlot data={currentQuestion.graph} />
            )}
          </h2>

          {/* Boolean */}
          {currentQuestion.type === 'boolean' && (
            <div className="space-y-3">
              {['True', 'False'].map(option => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                    ${answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'}
                    ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleSelect(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {/* MCQ */}
          {currentQuestion.type === 'mcq' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                    ${answers[currentQuestion.id] === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'}
                    ${isSubmitted ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={answers[currentQuestion.id] === option.value}
                    onChange={() => handleSelect(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}

          {/* Free / Word */}
          {(currentQuestion.type === 'free' || currentQuestion.type === 'word') && (
            <textarea
              className="w-full h-32 p-4 border rounded-lg"
              value={answers[currentQuestion.id] || ''}
              onChange={handleFreeResponseChange}
              placeholder="Your Answer Here..."
              disabled={isSubmitted}
            />
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
            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, QUESTIONS.length - 1))}
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
          ) : currentIndex < QUESTIONS.length - 1 ? (
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
