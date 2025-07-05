'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { buildApiUrl } from "../utils/api";

export default function GenerateMoreQuestions({ originalText, onQuestionsGenerated, existingQuestions = [], existingQuestionsFull = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState('mixed'); // 'multiple_choice', 'essay', 'mixed'
  const [difficulty, setDifficulty] = useState('any'); // 'any', 'easy', 'medium', 'hard'
  const [error, setError] = useState("");

  const handleGenerateMore = async () => {
    setError("");
    if (!questionCount || questionCount < 3 || questionCount > 20) {
      setError("Chọn số lượng từ 3 đến 20");
      return;
    }
    if (!questionType) {
      setError("Chọn loại câu hỏi");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', originalText);
      formData.append('count', questionCount);
      formData.append('type', questionType);
      formData.append('difficulty', difficulty);

      const response = await fetch(buildApiUrl('/generate-questions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          count: questionCount,
          type: questionType,
          difficulty,
          existingQuestions,
          existingQuestionsFull: JSON.stringify(existingQuestionsFull || [])
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onQuestionsGenerated(data.questions, originalText);
      } else {
        alert('Có lỗi xảy ra khi tạo câu hỏi: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Có lỗi xảy ra khi tạo câu hỏi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
        className="text-base font-bold text-black p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value={3}>3 câu</option>
        <option value={5}>5 câu</option>
        <option value={10}>10 câu</option>
        <option value={15}>15 câu</option>
        <option value={20}>20 câu</option>
        <option value={25}>25 câu</option>
        <option value={30}>30 câu</option>
        <option value={35}>35 câu</option>
        <option value={40}>40 câu</option>
        <option value={45}>45 câu</option>
        <option value={50}>50 câu</option>  
      </select>
      
      <select
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
        className="text-base font-bold text-black p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="mixed">Hỗn hợp</option>
        <option value="multiple_choice">Trắc nghiệm</option>
        <option value="essay">Tự luận</option>
      </select>

      <select
        value={difficulty}
        onChange={e => setDifficulty(e.target.value)}
        className="text-base font-bold text-black p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="any">Mọi độ khó</option>
        <option value="easy">Dễ</option>
        <option value="medium">Trung bình</option>
        <option value="hard">Khó</option>
      </select>

      <button
        onClick={handleGenerateMore}
        disabled={isLoading}
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Tạo...
          </>
        ) : (
          <>
            <Plus className="h-3 w-3" />
            Tạo thêm
          </>
        )}
      </button>
      {error && <div className="text-red-600 text-sm mt-2 w-full text-center">{error}</div>}
    </div>
  );
} 