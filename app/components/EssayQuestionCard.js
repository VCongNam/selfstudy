'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';

export default function EssayQuestionCard({ question, index, onAnswerSubmit, userAnswer }) {
  const [answer, setAnswer] = useState(userAnswer || '');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(!!userAnswer);

  // Reset answer khi sang câu hỏi mới
  useEffect(() => {
    setAnswer(userAnswer || '');
    setIsSubmitted(!!userAnswer);
  }, [question.id, userAnswer]);

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

  const handleSubmit = () => {
    if (answer.trim()) {
      setIsSubmitted(true);
      if (onAnswerSubmit) {
        onAnswerSubmit(question.id, answer);
      }
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-purple-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
            Câu tự luận {index + 1}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getDifficultyColor(question.difficulty)}`}>
            {getDifficultyText(question.difficulty)}
          </span>
        </div>
        {isSubmitted && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600">Đã trả lời</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black mb-3">
          {question.question}
        </h3>
      </div>

      {/* Answer Input */}
      <div className="mb-4">
        {!isSubmitted ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Câu trả lời của bạn:
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Nhập câu trả lời của bạn ở đây..."
              className="w-full h-32 p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-black font-bold placeholder-gray-500 bg-white shadow-sm text-base"
              disabled={isSubmitted}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {answer.length} ký tự
              </span>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi câu trả lời
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Câu trả lời của bạn:
              </label>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
              >
                <Edit3 className="h-4 w-4" />
                Chỉnh sửa
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
              <p className="text-black font-bold text-base whitespace-pre-wrap">{answer}</p>
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="mb-4">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
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

      {/* Sample Answer */}
      {isSubmitted && (
        <div className="border-t pt-4">
          <button
            onClick={() => setShowSampleAnswer(!showSampleAnswer)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium mb-2"
          >
            {showSampleAnswer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showSampleAnswer ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu'}
          </button>
          {showSampleAnswer && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-300">
              <h4 className="text-base font-bold text-black mb-2">Đáp án mẫu:</h4>
              <p className="text-black font-bold text-base whitespace-pre-wrap">{question.sampleAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 