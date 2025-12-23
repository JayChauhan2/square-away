import '../index.css';

import { useState } from 'react';
import KaTeXWrapper from './KaTeXWrapper';
import FunctionPlot from "./FunctionPlot";

const QUESTIONS =
[
  {
    "id": 1,
    "type": "mcq",
    "question": (
      <>
        According to Rolle's Theorem, if f is continuous on [a,b], differentiable on (a,b), and f(a)=f(b), then there exists some c in (a,b) such that:
        <KaTeXWrapper>{"f'(c)=0"}</KaTeXWrapper>
      </>
    ),
    options: [
      { label: <KaTeXWrapper>{"f'(c)=0"}</KaTeXWrapper>, value: "f'(c)=0" },
      { label: <KaTeXWrapper>{"f(c)=0"}</KaTeXWrapper>, value: "f(c)=0" },
      { label: <KaTeXWrapper>{"f'(c)=1"}</KaTeXWrapper>, value: "f'(c)=1" },
      { label: <KaTeXWrapper>{"f(c)=a"}</KaTeXWrapper>, value: "f(c)=a" }
    ],
    answer: "f'(c)=0",
    "graph": null
  },
  {
    "id": 2,
    "type": "boolean",
    "question": (
      <>
        True/False: If a function f is differentiable on the closed interval [a,b], then there exists at least one c in (a,b) such that:
        <KaTeXWrapper>{"f'(c)=\\frac{f(b)-f(a)}{b-a}"}</KaTeXWrapper>
      </>
    ),
    "answer": "False",
    "graph": null
  },
  {
    "id": 3,
    "type": "free",
    "question": (
      <>
        In one sentence, state the conclusion of the Mean Value Theorem.
        <KaTeXWrapper>{"f'(c)=\\frac{f(b)-f(a)}{b-a}"}</KaTeXWrapper>
      </>
    ),
    "answer": "There exists at least one c in (a,b) such that the instantaneous rate of change equals the average rate of change.",
    "graph": null
  },
  {
    "id": 4,
    "type": "mcq",
    "question": (
      <>
        Let f(x)=x^3-3x. On the interval [-√3,√3], f(-√3)=f(√3). According to Rolle's Theorem, there is at least one c in (-√3,√3) where f'(c)=0. Which of the following is such a c?
      </>
    ),
    "options": [
      { label: <KaTeXWrapper>{"-1"}</KaTeXWrapper>, value: "-1" },
      { label: <KaTeXWrapper>{"0"}</KaTeXWrapper>, value: "0" },
      { label: <KaTeXWrapper>{"2"}</KaTeXWrapper>, value: "2" },
      { label: <KaTeXWrapper>{"3"}</KaTeXWrapper>, value: "3" }
    ],
    "answer": "-1",
    "graph": null
  },
  {
    "id": 5,
    "type": "word",
    "question": (
      <>
        A particle moves along a straight line, and its position (in meters) at time t (seconds) is given by
         <KaTeXWrapper>{"s(t)=t^3-6t^2+9t"}</KaTeXWrapper>. 
        According to the Mean Value Theorem, there exists a c in the interval [1,3] such that the instantaneous velocity 
        <KaTeXWrapper>{"s'(c)"}</KaTeXWrapper> equals the average velocity 
        <KaTeXWrapper>{"\\frac{s(3)-s(1)}{3-1}"}</KaTeXWrapper>. 
        Find the value of c.
      </>
    ),
    "answer": "The derivative is s'(t)=3t^2-12t+9. Setting it equal to -2 gives 3c^2-12c+11=0, whose solutions are c = 2 - sqrt(3)/3 or c = 2 + sqrt(3)/3, both of which lie in [1,3].",
    "graph": [
      {
        "fn": "x^3-6x^2+9x",
        "graphType": "polyline",
        "color": "green",
      },
    ]
  }
]

export default function Questions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const isCorrect = (question) => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return null;

    if (question.type === 'mcq' || question.type === 'boolean') {
      return userAnswer === question.answer;
    }

    if (question.type === 'free' || question.type === 'word') {
      return userAnswer //check free response answers
        .trim()
        .toLowerCase()
        .includes(question.answer.toLowerCase());
    }
  }

  const handleMCQSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
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
                      answers[currentQuestion.id] === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    className="hidden"
                    checked={answers[currentQuestion.id] === option.value}
                    onChange={() => handleMCQSelect(option.value)}
                  />
                  <span className="text-gray-800">{option.label}</span>
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