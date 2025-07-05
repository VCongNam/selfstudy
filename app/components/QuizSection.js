'use client';

import { useState } from 'react';
import { BookOpen, RefreshCw, BarChart3 } from 'lucide-react';
import QuestionCard from './QuestionCard';
import EssayQuestionCard from './EssayQuestionCard';
import GenerateMoreQuestions from './GenerateMoreQuestions';

export default function QuizSection({ questions, originalText, onQuestionsGenerated }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState(questions);

  const currentQuestion = currentQuestions && currentQuestions.length > 0 ? currentQuestions[currentQuestionIndex] : null;
  const totalQuestions = currentQuestions ? currentQuestions.length : 0;
  const answeredQuestions = Object.keys(userAnswers).length;

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleQuestionsGenerated = (newQuestions) => {
    setCurrentQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    let totalScored = 0;
    currentQuestions.forEach(question => {
      if (question.type === 'multiple_choice') {
        totalScored++;
        if (userAnswers[question.id] === question.correctAnswer) {
          correct++;
        }
      } else if (question.type === 'essay' && userAnswers[question.id]) {
        totalScored++;
        // Với câu hỏi tự luận, coi như đúng nếu đã trả lời
        correct++;
      }
    });
    return { correct, total: totalScored, percentage: totalScored > 0 ? Math.round((correct / totalScored) * 100) : 0 };
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Kết quả bài tập</h2>
          
          <div className="mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(score.percentage)}`}>
              {score.percentage}%
            </div>
            <p className="text-lg text-gray-600">
              Bạn đã trả lời đúng {score.correct}/{score.total} câu hỏi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{score.correct}</div>
              <div className="text-sm text-green-700">Đúng</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{score.total - score.correct}</div>
              <div className="text-sm text-red-700">Sai</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score.total}</div>
              <div className="text-sm text-blue-700">Tổng cộng</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
              Làm lại bài tập
            </button>
            <GenerateMoreQuestions 
              originalText={originalText} 
              onQuestionsGenerated={handleQuestionsGenerated}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Bài tập tiếng Anh</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Câu {currentQuestionIndex + 1} / {totalQuestions}
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {answeredQuestions}/{totalQuestions} đã trả lời
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Original text toggle and Generate More */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setShowOriginalText(!showOriginalText)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showOriginalText ? 'Ẩn' : 'Xem'} nội dung gốc
          </button>
          <GenerateMoreQuestions 
            originalText={originalText} 
            onQuestionsGenerated={handleQuestionsGenerated}
          />
        </div>
        {showOriginalText && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{originalText}</p>
          </div>
        )}
      </div>

      {/* Current Question */}
      {currentQuestion ? (
        currentQuestion.type === 'essay' ? (
          <EssayQuestionCard 
            question={currentQuestion} 
            index={currentQuestionIndex}
            onAnswerSubmit={handleAnswerSelect}
            userAnswer={userAnswers[currentQuestion?.id]}
          />
        ) : (
          <QuestionCard 
            question={currentQuestion} 
            index={currentQuestionIndex}
            onAnswerSelect={handleAnswerSelect}
            userAnswer={userAnswers[currentQuestion?.id]}
          />
        )
      ) : (
        <div className="text-red-500 text-center">Không có câu hỏi nào để hiển thị.</div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Câu trước
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={!currentQuestion || !userAnswers[currentQuestion?.id]}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Xem kết quả' : 'Câu tiếp →'}
        </button>
      </div>
    </div>
  );
} 