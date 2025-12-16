import '../index.css';
import { useState } from 'react';
import MathJaxWrapper from "./MathJaxWrapper";

const QUESTIONS = [
  {
    id: 1,
    type: 'mcq',
    question: 'What is the derivative of x²?',
    options: ['$2x$', '$x$', '$x²$', '$2$'],
  },
  {
    id: 2,
    type: 'free',
    question: 'Explain in one sentence what a derivative represents.',
  },
  {
    id: 3,
    type: 'mcq',
    question: 'Which rule is used to differentiate a product of two functions?',
    options: [
      'Chain Rule',
      'Product Rule',
      'Quotient Rule',
      'Power Rule',
    ],
  },
  {
    id: 4,
    type: 'free',
    question: 'Write the derivative of sin(x).',
  },
  {
    id: 5,
    type: 'mcq',
    question: 'Which of the following is an antiderivative of 2x?',
    options: ['$x^2 + C$', '2x² + C', 'x + C', 'ln(x) + C'],
  },
];

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

        {/* Question */}
        <MathJaxWrapper>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQuestion.question}
            {"$$\\sum_{i=0}^n i^2 = \\frac{(n^2+n)(2n+1)}{6}$$"}
          </h2>

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
          {currentQuestion.type === 'free' && (
            <textarea
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={handleFreeResponseChange}
            />
          )}
        </div>
        </MathJaxWrapper>

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
