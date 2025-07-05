"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function FileUpload({ onQuestionsGenerated }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [questionCount, setQuestionCount] = useState(10);
  const [questionType, setQuestionType] = useState('mixed');
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficulty, setDifficulty] = useState('any');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFieldErrors((prev) => ({ ...prev, file: undefined }));
    setError("");
  };

  const handleUploadClick = async () => {
    const errs = {};
    if (!questionCount || questionCount < 3 || questionCount > 20) errs.count = "Chọn số lượng từ 3 đến 20";
    if (!questionType) errs.type = "Chọn loại câu hỏi";
    if (!selectedFile) errs.file = "Bạn phải chọn file PDF trước khi tạo câu hỏi";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Chỉ chấp nhận file PDF");
      return;
    }

    setIsUploading(true);
    setError("");
    setFieldErrors({});

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("count", questionCount.toString());
    formData.append("type", questionType);
    formData.append("difficulty", difficulty);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onQuestionsGenerated(data.questions, data.originalText, selectedFile);
      } else {
        setError(data.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      setError("Không thể kết nối đến server");
    } finally {
      setIsUploading(false);
    }
  };

  const validateBeforeUpload = () => {
    const errs = {};
    if (!questionCount || questionCount < 3 || questionCount > 20) errs.count = "Chọn số lượng từ 3 đến 20";
    if (!questionType) errs.type = "Chọn loại câu hỏi";
    if (!selectedFile) errs.file = "Bạn phải chọn file PDF trước khi tạo câu hỏi";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng câu hỏi:
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value={3} className="text-black">3 câu hỏi</option>
                <option value={5} className="text-black">5 câu hỏi</option>
                <option value={10} className="text-black">10 câu hỏi</option>
                <option value={15} className="text-black">15 câu hỏi</option>
                <option value={20} className="text-black">20 câu hỏi</option>
                <option value={25} className="text-black">25 câu hỏi</option>
                <option value={30} className="text-black">30 câu hỏi</option>
                <option value={35} className="text-black">35 câu hỏi</option>
                <option value={40} className="text-black">40 câu hỏi</option>
                <option value={45} className="text-black">45 câu hỏi</option>
                <option value={50} className="text-black">50 câu hỏi</option>
              </select>
              {fieldErrors.count && <div className="text-red-600 text-sm mt-1">{fieldErrors.count}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại câu hỏi:
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="mixed" className="text-black">Hỗn hợp (Trắc nghiệm + Tự luận)</option>
                <option value="multiple_choice" className="text-black">Chỉ câu hỏi trắc nghiệm</option>
                <option value="essay" className="text-black">Chỉ câu hỏi tự luận</option>
              </select>
              {fieldErrors.type && <div className="text-red-600 text-sm mt-1">{fieldErrors.type}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ khó:
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="any" className="text-black">Mọi độ khó</option>
                <option value="easy" className="text-black">Dễ</option>
                <option value="medium" className="text-black">Trung bình</option>
                <option value="hard" className="text-black">Khó</option>
              </select>
            </div>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <FileText className="h-4 w-4 mr-2" />
              {selectedFile ? selectedFile.name : "Chọn file PDF"}
            </div>
          </label>
          {fieldErrors.file && <div className="text-red-600 text-sm mt-1">{fieldErrors.file}</div>}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Đang xử lý...
              </>
            ) : (
              "Tạo câu hỏi từ file PDF"
            )}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
