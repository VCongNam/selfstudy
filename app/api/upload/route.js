export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';
import { Buffer } from 'buffer';

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    // Kiểm tra file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Chỉ chấp nhận file PDF' }, { status: 400 });
    }

    // Đọc nội dung PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const pdfData = await pdf(buffer);
    const textContent = pdfData.text;

    // Tạo bài tập với Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Dựa trên nội dung sau đây, hãy tạo ra 10 câu hỏi tiếng Anh với độ khó tăng dần từ dễ đến khó.
    Mỗi câu hỏi cần có:
    - Câu hỏi chính
    - 4 lựa chọn A, B, C, D
    - Đáp án đúng
    - Giải thích chi tiết tại sao đáp án đó đúng
    - Gợi ý học tập

    Nội dung: ${textContent}

    Trả về kết quả dưới dạng JSON với cấu trúc:
    {
      "questions": [
        {
          "id": 1,
          "question": "Câu hỏi",
          "options": {
            "A": "Lựa chọn A",
            "B": "Lựa chọn B", 
            "C": "Lựa chọn C",
            "D": "Lựa chọn D"
          },
          "correctAnswer": "A",
          "explanation": "Giải thích chi tiết",
          "hint": "Gợi ý học tập",
          "difficulty": "easy/medium/hard"
        }
      ]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (error) {
      // Nếu không parse được JSON, tạo cấu trúc mặc định
      questions = {
        questions: [
          {
            id: 1,
            question: "Không thể tạo câu hỏi từ nội dung này. Vui lòng thử lại với file khác.",
            options: {
              A: "Không có đáp án",
              B: "Không có đáp án", 
              C: "Không có đáp án",
              D: "Không có đáp án"
            },
            correctAnswer: "A",
            explanation: "Vui lòng upload file PDF có nội dung tiếng Anh rõ ràng hơn.",
            hint: "File PDF cần có nội dung tiếng Anh để AI có thể tạo bài tập.",
            difficulty: "easy"
          }
        ]
      };
    }

    return NextResponse.json({ 
      success: true, 
      questions: questions.questions,
      originalText: textContent.substring(0, 500) + "..." // Lưu 500 ký tự đầu để hiển thị
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ 
      error: 'Có lỗi xảy ra khi xử lý file PDF' 
    }, { status: 500 });
  }
} 