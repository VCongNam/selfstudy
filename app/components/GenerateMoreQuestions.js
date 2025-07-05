'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

export default function GenerateMoreQuestions({ originalText, onQuestionsGenerated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState('mixed'); // 'multiple_choice', 'essay', 'mixed'

  const handleGenerateMore = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', originalText);
      formData.append('count', questionCount);
      formData.append('type', questionType);

      const response = await fetch('http://localhost:4000/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          count: questionCount,
          type: questionType
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
        className="text-sm p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
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
        className="text-sm p-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="mixed">Hỗn hợp</option>
        <option value="multiple_choice">Trắc nghiệm</option>
        <option value="essay">Tự luận</option>
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
    </div>
  );
} 