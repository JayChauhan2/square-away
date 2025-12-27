import '../index.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Practice() {
  const navigate = useNavigate();

    const topics = {
    "Kindergarten": {
        "Counting": ["Counting to 10", "Counting to 20", "Counting by 2s, 5s, 10s"],
        "Shapes": ["Circle", "Square", "Triangle", "Rectangle"],
        "Basic Addition": ["Adding 0-5", "Adding 6-10", "Word Problems"],
        "Basic Subtraction": ["Subtracting 0-5", "Subtracting 6-10", "Word Problems"]
    },
    "1st Grade": {
        "Addition": ["One-digit Addition", "Two-digit Addition", "Adding with Carrying"],
        "Subtraction": ["One-digit Subtraction", "Two-digit Subtraction", "Subtracting with Borrowing"],
        "Time": ["Reading Clocks", "Hours & Minutes", "AM/PM Concept"],
        "Money": ["Identifying Coins", "Counting Coins", "Making Change"]
    },
    "2nd Grade": {
        "Addition & Subtraction": ["Adding 3-digit numbers", "Subtracting 3-digit numbers", "Word Problems"],
        "Multiplication": ["Times Tables 1-10", "Multiplying by 2-digit numbers"],
        "Division": ["Basic Division", "Division with Remainders", "Word Problems"],
        "Fractions": ["Identifying Fractions", "Equivalent Fractions", "Adding/Subtracting Fractions"]
    },
    "3rd Grade": {
        "Multiplication & Division": ["Multiplying 2-digit numbers", "Long Division", "Word Problems"],
        "Fractions": ["Simplifying Fractions", "Comparing Fractions", "Adding/Subtracting Fractions"],
        "Decimals": ["Introduction to Decimals", "Adding/Subtracting Decimals", "Comparing Decimals"],
        "Geometry": ["Perimeter & Area", "Angles", "Shapes"]
    },
    "4th Grade": {
        "Decimals": ["Place Value", "Rounding Decimals", "Adding/Subtracting Decimals"],
        "Fractions": ["Multiplying Fractions", "Dividing Fractions", "Fraction Word Problems"],
        "Long Division": ["Division by 1-digit numbers", "Division by 2-digit numbers", "Remainders"],
        "Angles": ["Acute, Right, Obtuse", "Measuring Angles", "Angle Relationships"]
    },
    "5th Grade": {
        "Decimals": ["Multiplying/Dividing Decimals", "Decimal Word Problems"],
        "Fractions": ["Mixed Numbers", "Improper Fractions", "Operations with Fractions"],
        "Volume": ["Volume of Cubes & Rectangular Prisms", "Word Problems"],
        "Graphs": ["Bar Graphs", "Line Graphs", "Coordinate Plane"]
    },
    "6th Grade": {
        "Ratios": ["Understanding Ratios", "Equivalent Ratios", "Ratio Word Problems"],
        "Proportions": ["Solving Proportions", "Proportions in Real Life"],
        "Integers": ["Adding/Subtracting Integers", "Multiplying/Dividing Integers", "Number Line"],
        "Expressions": ["Simplifying Expressions", "Evaluating Expressions", "Combining Like Terms"]
    },
    "7th Grade": {
        "Linear Equations": ["Solving One-Step Equations", "Two-Step Equations", "Word Problems"],
        "Inequalities": ["Solving Inequalities", "Graphing Inequalities"],
        "Probability": ["Simple Probability", "Compound Probability", "Independent & Dependent Events"],
        "Statistics": ["Mean, Median, Mode", "Range", "Interpreting Data"]
    },
    "8th Grade": {
        "Exponents": ["Laws of Exponents", "Scientific Notation", "Negative Exponents"],
        "Functions": ["Function Notation", "Linear Functions", "Domain & Range"],
        "Pythagorean Theorem": ["Finding Hypotenuse", "Finding Legs", "Word Problems"],
        "Transformations": ["Translation", "Reflection", "Rotation", "Dilation"]
    },
    "Algebra I": {
        "Linear Equations": ["Slope-Intercept Form", "Point-Slope Form", "Graphing"],
        "Quadratics": ["Factoring Quadratics", "Quadratic Formula", "Graphing Parabolas"],
        "Polynomials": ["Adding/Subtracting Polynomials", "Multiplying Polynomials", "Special Products"],
        "Factoring": ["GCF", "Trinomials", "Difference of Squares"]
    },
    "Geometry": {
        "Triangles": ["Congruent Triangles", "Pythagorean Theorem", "Special Triangles"],
        "Circles": ["Radius & Diameter", "Circumference & Area", "Arcs & Angles"],
        "Coordinate Geometry": ["Distance Formula", "Midpoint Formula", "Equation of a Line"],
        "Proofs": ["Two-Column Proofs", "Paragraph Proofs", "Proofs with Algebra"]
    },
    "Algebra II": {
        "Polynomials": ["Polynomial Division", "Roots & Zeros", "Graphing Polynomials"],
        "Rational Expressions": ["Simplifying", "Multiplying/Dividing", "Adding/Subtracting"],
        "Logarithms": ["Log Properties", "Solving Log Equations", "Exponential vs Logarithmic Functions"],
        "Complex Numbers": ["Addition/Subtraction", "Multiplication/Division", "Polar Form"]
    },
    "Pre-Calculus": {
        "Functions": ["Linear, Quadratic, Polynomial Functions", "Inverse Functions", "Composition of Functions"],
        "Trigonometry": ["Unit Circle", "Trig Identities", "Graphs of Trig Functions"],
        "Sequences & Series": ["Arithmetic Sequences", "Geometric Sequences", "Sigma Notation"],
        "Limits": ["Concept of a Limit", "One-Sided Limits", "Limit Laws"]
    },
    "Calculus AB": {
        "Limits": ["Limit Definition", "Limit Laws", "Continuity"],
        "Derivatives": ["Power Rule", "Product/Quotient Rule", "Chain Rule"],
        "Integrals": ["Definite Integrals", "Indefinite Integrals", "Area Under Curve"],
        "Applications": ["Optimization", "Related Rates", "Motion Problems"]
    },
    "Calculus BC": {
        "Limits": ["Limits at Infinity", "Continuity", "L'Hôpital's Rule"],
        "Derivatives": ["Higher Order Derivatives", "Implicit Differentiation", "Applications"],
        "Integrals": ["Integration by Parts", "Trapezoidal Rule", "Improper Integrals"],
        "Series": ["Taylor Series", "Maclaurin Series", "Convergence Tests"],
        "Parametric Equations": ["Derivatives of Parametrics", "Arc Length", "Area under Parametric Curves"]
    },
    "College Math": {
        "Linear Algebra": ["Matrix Operations", "Determinants", "Vector Spaces", "Eigenvalues/Eigenvectors"],
        "Discrete Math": ["Logic & Proofs", "Set Theory", "Combinatorics", "Graph Theory"],
        "Probability & Statistics": ["Probability Rules", "Random Variables", "Distributions", "Hypothesis Testing"],
        "Differential Equations": ["First Order DEs", "Second Order DEs", "Laplace Transforms", "Applications"]
    }
    };


  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedSubSubtopic, setSelectedSubSubtopic] = useState(null);

    const handleStartPractice = () => {
    if (selectedTopic && selectedSubtopic && selectedSubSubtopic) {
        // Encode each part to safely use in URL
        const url = `/questions/${encodeURIComponent(selectedTopic + " " + selectedSubtopic + ": " + selectedSubSubtopic)}`;
        navigate(url);
    }
    };


  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen overflow-x-hidden p-6">

      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl top-10 left-5 animate-[blob_15s_linear_infinite]" />
        <div className="absolute w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-teal-300/20 rounded-full blur-3xl bottom-20 right-10 animate-[blob_20s_linear_infinite]" />
        <div className="absolute w-72 h-72 bg-gradient-to-br from-violet-300/25 to-pink-300/25 rounded-full blur-3xl top-1/2 left-1/2 animate-[blob_18s_linear_infinite]" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">

        {/* Page Title */}
        <h1 className="text-5xl md:text-6xl font-light text-slate-900 text-center mb-8">
          Ready for Practice?
        </h1>

        {/* Main Topic Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-800">Select a Main Topic</h2>
          <div className="flex flex-wrap gap-4">
            {Object.keys(topics).map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setSelectedSubtopic(null);
                  setSelectedSubSubtopic(null);
                }}
                className={`px-5 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-md
                  ${selectedTopic === topic 
                    ? 'bg-blue-500 text-white shadow-blue-300/40 scale-105' 
                    : 'bg-white/20 text-slate-800 hover:bg-blue-100/50'}
                `}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Subtopic Selection */}
        {selectedTopic && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800">Select a Subtopic</h2>
            <div className="flex flex-wrap gap-4">
              {Object.keys(topics[selectedTopic]).map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedSubtopic(sub);
                    setSelectedSubSubtopic(null);
                  }}
                  className={`px-4 py-2 rounded-full text-md font-medium transition-all duration-300 shadow-md
                    ${selectedSubtopic === sub
                      ? 'bg-green-500 text-white shadow-green-300/40 scale-105'
                      : 'bg-white/20 text-slate-800 hover:bg-green-100/50'}
                  `}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Subtopic Selection */}
        {selectedSubtopic && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-800">Select a Specific Topic</h2>
            <div className="flex flex-wrap gap-4">
              {topics[selectedTopic][selectedSubtopic].map((subsub) => (
                <button
                  key={subsub}
                  onClick={() => setSelectedSubSubtopic(subsub)}
                  className={`px-4 py-2 rounded-full text-md font-medium transition-all duration-300 shadow-md
                    ${selectedSubSubtopic === subsub
                      ? 'bg-purple-500 text-white shadow-purple-300/40 scale-105'
                      : 'bg-white/20 text-slate-800 hover:bg-purple-100/50'}
                  `}
                >
                  {subsub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Practice Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartPractice}
            disabled={!selectedTopic || !selectedSubtopic || !selectedSubSubtopic}
            className={`px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300
              ${selectedTopic && selectedSubtopic && selectedSubSubtopic
                ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-300/30'
                : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            Start Practicing
          </button>
        </div>

        {/* Past Practices */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Past Practices</h2>
          <p className="text-slate-500 italic">No past practices yet. Your recently practiced topics will appear here.</p>
        </div>

      </div>
    </div>
  );
}