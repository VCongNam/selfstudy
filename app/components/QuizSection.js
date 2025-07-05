'use client';

import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, BarChart3, Eye } from 'lucide-react';
import QuestionCard from './QuestionCard';
import EssayQuestionCard from './EssayQuestionCard';
import GenerateMoreQuestions from './GenerateMoreQuestions';

export default function QuizSection({ questions, originalText, onQuestionsGenerated }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState(questions);
  const [allQuestions, setAllQuestions] = useState(questions);
  const [allGeneratedQuestions, setAllGeneratedQuestions] = useState(questions);
  const [showReview, setShowReview] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

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

  // Chuẩn hóa nội dung câu hỏi để so sánh trùng sâu
  function normalizeQuestionText(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Hàm kiểm tra trùng sâu cả id và nội dung
  function isDuplicateQuestion(newQ, existingList) {
    const norm = normalizeQuestionText(newQ.question);
    return existingList.some(q => q.id === newQ.id || normalizeQuestionText(q.question) === norm);
  }

  const handleQuestionsGenerated = (newQuestions) => {
    // Lọc trùng sâu cả id và nội dung
    const uniqueNewQuestions = newQuestions.filter(q => !isDuplicateQuestion(q, allGeneratedQuestions));
    const mergedQuestions = [...allQuestions, ...uniqueNewQuestions];
    setCurrentQuestions(mergedQuestions);
    setAllQuestions(mergedQuestions);
    setAllGeneratedQuestions([...allGeneratedQuestions, ...uniqueNewQuestions]);
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

  // Load lịch sử câu hỏi từ localStorage khi khởi tạo
  useEffect(() => {
    const saved = localStorage.getItem('allQuestionsHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAllGeneratedQuestions(parsed);
        setAllQuestions(parsed);
      } catch {}
    }
  }, []);

  // Lưu vào localStorage mỗi khi allGeneratedQuestions thay đổi
  useEffect(() => {
    localStorage.setItem('allQuestionsHistory', JSON.stringify(allGeneratedQuestions));
  }, [allGeneratedQuestions]);

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-6">Kết quả bài tập</h2>
          
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

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-4">
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
              existingQuestions={allGeneratedQuestions.map(q => q.question)}
              existingQuestionsFull={allGeneratedQuestions}
            />
            <button
              onClick={() => setShowReview(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Eye className="h-5 w-5" />
              Xem lại tất cả câu hỏi
            </button>
          </div>
        </div>
        {showReview && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white max-w-2xl w-full rounded-lg shadow-2xl p-6 overflow-y-auto max-h-[90vh] border-2 border-blue-400">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2"><Eye className="h-6 w-6 text-blue-700" />Tất cả câu hỏi đã xuất hiện</h3>
                <button onClick={() => setShowReview(false)} className="text-red-600 font-bold text-lg px-3 py-1 rounded hover:bg-red-100">Đóng</button>
              </div>
              <ol className="space-y-6 text-left">
                {allQuestions.map((q, idx) => (
                  <li key={q.id + '-' + idx} className="bg-gray-50 rounded-lg shadow p-4 border-l-4 mb-2 border-blue-400">
                    <div className="flex items-center gap-2 mb-2">
                      {q.type === 'multiple_choice' ? (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Trắc nghiệm</span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">Tự luận</span>
                      )}
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">Độ khó: {q.difficulty}</span>
                    </div>
                    <div className="font-bold text-black text-lg mb-2">Câu {idx + 1}: {q.question}</div>
                    {q.type === 'multiple_choice' && (
                      <ul className="ml-4 mb-2 space-y-1">
                        {Object.entries(q.options).map(([k, v]) => {
                          const isCorrect = q.correctAnswer === k;
                          const isUser = userAnswers[q.id] === k;
                          return (
                            <li key={k} className={`px-2 py-1 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-800 font-bold border border-green-400' : isUser ? 'bg-yellow-100 text-yellow-800 font-bold border border-yellow-400' : 'text-black'}`}>
                              <span>{k}.</span> <span>{v}</span>
                              {isCorrect && <span className="ml-2 text-green-700 font-bold">(Đáp án đúng)</span>}
                              {isUser && !isCorrect && <span className="ml-2 text-yellow-700 font-bold">(Bạn chọn)</span>}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {q.type === 'essay' && (
                      <div className="ml-4 mb-2">
                        <span className="font-bold text-black">Đáp án mẫu:</span> <span className="bg-green-50 border border-green-300 rounded px-2 py-1 text-black font-bold">{q.sampleAnswer}</span>
                        {userAnswers[q.id] && (
                          <div className="mt-2"><span className="font-bold text-black">Bạn đã trả lời:</span> <span className="bg-yellow-50 border border-yellow-300 rounded px-2 py-1 text-black font-bold">{userAnswers[q.id]}</span></div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
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
          
          <GenerateMoreQuestions 
            originalText={originalText}
            onQuestionsGenerated={handleQuestionsGenerated}
            existingQuestions={allGeneratedQuestions.map(q => q.question)}
            existingQuestionsFull={allGeneratedQuestions}
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