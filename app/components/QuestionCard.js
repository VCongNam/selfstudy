'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

export default function QuestionCard({ question, index, onAnswerSelect, userAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset selectedAnswer khi sang câu hỏi mới
  useEffect(() => {
    setSelectedAnswer(userAnswer || null);
  }, [question.id, userAnswer]);

  const isCorrect = selectedAnswer === question.correctAnswer;
  const hasAnswered = selectedAnswer !== null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Không xác định';
    }
  };

  const handleAnswerSelect = (answer) => {
    if (!hasAnswered) {
      setSelectedAnswer(answer);
      if (onAnswerSelect) {
        onAnswerSelect(question.id, answer);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            Câu {index + 1}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getDifficultyColor(question.difficulty)}`}>
            {getDifficultyText(question.difficulty)}
          </span>
        </div>
        {hasAnswered && (
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black mb-3">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleAnswerSelect(key)}
            disabled={hasAnswered}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all bg-white ${
              selectedAnswer === key
                ? key === question.correctAnswer
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : hasAnswered && key === question.correctAnswer
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-blue-400'
            } ${hasAnswered ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
          >
            <span className="font-bold text-black text-base">{key}.</span> <span className="font-bold text-black text-base">{value}</span>
          </button>
        ))}
      </div>

      {/* Hint */}
      <div className="mb-4">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 text-base font-bold"
        >
          <Lightbulb className="h-4 w-4" />
          Gợi ý học tập
          {showHint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showHint && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-base font-bold text-black">{question.hint}</p>
          </div>
        )}
      </div>

      {/* Explanation */}
      {hasAnswered && (
        <div className="border-t pt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-black hover:text-black text-base font-bold mb-2"
          >
            {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showExplanation ? 'Ẩn giải thích' : 'Xem giải thích'}
          </button>
          {showExplanation && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-base font-bold text-black">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 