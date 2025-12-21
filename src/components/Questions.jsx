import '../index.css';

import KaTeXWrapper from './KaTeXWrapper';
import { useState } from 'react';

// import MathJaxWrapper from "./MathJaxWrapper";
import FunctionPlot from "./FunctionPlot";

const QUESTIONS = [
  {
    id: 1,
    type: 'mcq',
    question: (
      <>
        According to Rolle's Theorem, if f is continuous on [a,b], differentiable on (a,b), and f(a)=f(b), then there exists a c in (a,b) such that f'(c) equals?
      </>
    ),
    options: [
      <KaTeXWrapper>{"0"}</KaTeXWrapper>,
      <KaTeXWrapper>{"f(c)=0"}</KaTeXWrapper>,
      <KaTeXWrapper>{"f''(c)=0"}</KaTeXWrapper>,
      <KaTeXWrapper>{"f'(c)=f(c)"}</KaTeXWrapper>
    ],
    answer: '0',
    graph: [
      {
        fn: "sin(x)",
        graphType: "polyline",
        color: "blue",
      },
    ]
  },
  {
    id: 2,
    type: 'mcq',
    question: (
      <>
        Which of the following is NOT a required hypothesis for Rolle's Theorem?
      </>
    ),
    options: [
      <>f is continuous on <KaTeXWrapper>{"[a,b]"}</KaTeXWrapper></>,
      <KaTeXWrapper>{"f is differentiable on (a,b)"}</KaTeXWrapper>,
      <KaTeXWrapper>{"f(a)=f(b)"}</KaTeXWrapper>,
      <KaTeXWrapper>{"f is differentiable at the endpoints a and b"}</KaTeXWrapper>
    ],
    answer: 'f is differentiable at the endpoints a and b',
    graph: null
  },
  {
    id: 3,
    type: 'boolean',
    question: (
      <>
        True/False: If <KaTeXWrapper>{"f(x)=x^3"}</KaTeXWrapper> on <KaTeXWrapper>{"[1,2]"}</KaTeXWrapper>, then there exists a <KaTeXWrapper>{"c"}</KaTeXWrapper> in <KaTeXWrapper>{"(1,2)"}</KaTeXWrapper> such that <KaTeXWrapper>{"f'(c)"}</KaTeXWrapper> equals <KaTeXWrapper>{"(f(2)-f(1))/(2-1)"}</KaTeXWrapper>.
      </>
    ),
    answer: 'True',
    graph: [
      {
        fn: "x^3",
        graphType: "polyline",
        color: "blue",
      },
    ]
  },
  {
    id: 4,
    type: 'free',
    question: 'State the Mean Value Theorem in one sentence.',
    answer: 'If f is continuous on [a,b] and differentiable on (a,b) then there exists a c in (a,b) such that the derivative of f at c equals the quotient of the change in f over the change in x.',
    graph: null
  },
  {
    id: 5,
    type: 'word',
    question: (
      <>
        A drone's altitude (in meters) as a function of time <KaTeXWrapper>{"t"}</KaTeXWrapper> (in seconds) is given by <KaTeXWrapper>{"h(t)=t^3-6t^2+9t"}</KaTeXWrapper> for <KaTeXWrapper>{"t \in [0,3]"}</KaTeXWrapper>. According to the Mean Value Theorem, there is a time <KaTeXWrapper>{"c"}</KaTeXWrapper> in <KaTeXWrapper>{"(0,3)"}</KaTeXWrapper> where the instantaneous rate of change of altitude equals the average rate of change over the interval. Find the value of <KaTeXWrapper>{"c"}</KaTeXWrapper>.
      </>
    ),
    answer: (
      <>
        The average rate of change is <KaTeXWrapper>{"(h(3)-h(0))/(3-0)"}</KaTeXWrapper> which equals <KaTeXWrapper>{"0"}</KaTeXWrapper>. Setting the derivative <KaTeXWrapper>{"h'(t)=3t^2-12t+9"}</KaTeXWrapper> equal to 0 and solving gives <KaTeXWrapper>{"t=1 or t=3"}</KaTeXWrapper>. The value in the open interval (0,3) is <KaTeXWrapper>{"c=1"}</KaTeXWrapper>.
      </>
    ),
    graph: null
  }
]


export default function Questions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleMCQSelect = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  const handleFreeResponseChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    });
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

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQuestion.question}
            
            {currentQuestion.graph && (
              <FunctionPlot data={currentQuestion.graph} />
            )}
          </h2>

          {/* Boolean (True / False) */}
          {currentQuestion.type === 'boolean' && (
            <div className="space-y-3">
              {['True', 'False'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="hidden"
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleMCQSelect(option)}
                  />
                  <span className="text-gray-800">{option}</span>
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
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${
                      answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="hidden"
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleMCQSelect(option)}
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Free Response */}
          {(currentQuestion.type === 'free' || currentQuestion.type === 'word' ) && (
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={handleFreeResponseChange}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>

          {currentIndex < QUESTIONS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
