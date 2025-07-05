"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function FileUpload({ onQuestionsGenerated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [questionType, setQuestionType] = useState('mixed');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Chỉ chấp nhận file PDF");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("count", questionCount.toString());
    formData.append("type", questionType);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onQuestionsGenerated(data.questions, data.originalText);
      } else {
        setError(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      setError("Không thể kết nối đến server");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload tài liệu PDF
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Chọn file PDF chứa nội dung tiếng Anh để tạo bài tập
          </p>

          {/* Question Settings */}
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Số lượng câu hỏi:
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5 câu hỏi</option>
                <option value={10}>10 câu hỏi</option>
                <option value={15}>15 câu hỏi</option>
                <option value={20}>20 câu hỏi</option>
                <option value={25}>25 câu hỏi</option>
                <option value={30}>30 câu hỏi</option>
                <option value={35}>35 câu hỏi</option>
                <option value={40}>40 câu hỏi</option>
                <option value={45}>45 câu hỏi</option>
                <option value={50}>50 câu hỏi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Loại câu hỏi:
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mixed">Hỗn hợp (Trắc nghiệm + Tự luận)</option>
                <option value="multiple_choice">Chỉ câu hỏi trắc nghiệm</option>
                <option value="essay">Chỉ câu hỏi tự luận</option>
              </select>
            </div>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Chọn file PDF
                </>
              )}
            </div>
          </label>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
