'use client';

import { useState, useEffect } from 'react';
import { Brain, BookOpen, Lightbulb, Target, LogOut } from 'lucide-react';
import FileUpload from './components/FileUpload';
import QuizSection from './components/QuizSection';
import LoginForm from './components/LoginForm';

export default function Home() {
  const [questions, setQuestions] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);

  const handleQuestionsGenerated = (newQuestions, text) => {
    setQuestions(newQuestions);
    setOriginalText(text);
  };

  const handleReset = () => {
    setQuestions(null);
    setOriginalText('');
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setQuestions(null);
    setOriginalText('');
  };

  if (!loggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI English Learning</h1>
            </div>
            <div className="flex items-center gap-4">
              {questions && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Tạo bài tập mới
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 font-medium"
              >
                <LogOut className="h-5 w-5" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!questions ? (
          <div className="text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Học tiếng Anh thông minh với AI
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload tài liệu PDF và để AI tạo ra bài tập tiếng Anh phù hợp với trình độ của bạn. 
                Học tập hiệu quả với giải thích chi tiết và độ khó tăng dần.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tài liệu đa dạng</h3>
                <p className="text-gray-600">
                  Upload bất kỳ file PDF nào chứa nội dung tiếng Anh để tạo bài tập
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI thông minh</h3>
                <p className="text-gray-600">
                  Sử dụng Gemini AI để tạo câu hỏi phù hợp với nội dung và trình độ
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Học tập hiệu quả</h3>
                <p className="text-gray-600">
                  Giải thích chi tiết, gợi ý học tập và độ khó tăng dần
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <FileUpload onQuestionsGenerated={handleQuestionsGenerated} />

            {/* Instructions */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Hướng dẫn sử dụng
                </h3>
                <ol className="text-sm text-blue-800 space-y-2">
                  <li>1. Chuẩn bị file PDF chứa nội dung tiếng Anh (sách, bài báo, tài liệu học tập)</li>
                  <li>2. Click "Chọn file PDF" và upload file của bạn</li>
                  <li>3. Đợi AI phân tích và tạo bài tập (có thể mất vài giây)</li>
                  <li>4. Bắt đầu làm bài tập với giải thích chi tiết cho từng câu hỏi</li>
                  <li>5. Xem kết quả và làm lại nếu muốn cải thiện</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <QuizSection questions={questions} originalText={originalText} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 AI English Learning. Được tạo ra để hỗ trợ việc học tiếng Anh hiệu quả.</p>
            <p className="mt-2 text-sm">
              Sử dụng Gemini AI để tạo bài tập thông minh và phù hợp với trình độ người học.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
