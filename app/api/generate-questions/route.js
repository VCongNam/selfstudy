export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    let text, count, type, existingQuestions = [];
    if (request.headers.get('content-type')?.includes('application/json')) {
      const body = await request.json();
      text = body.text;
      count = parseInt(body.count) || 5;
      type = body.type || 'mixed';
      existingQuestions = Array.isArray(body.existingQuestions) ? body.existingQuestions : [];
    } else {
      const formData = await request.formData();
      text = formData.get('text');
      count = parseInt(formData.get('count')) || 5;
      type = formData.get('type') || 'mixed';
      try {
        existingQuestions = JSON.parse(formData.get('existingQuestions'));
      } catch { existingQuestions = []; }
    }

    if (!text) {
      return NextResponse.json({ error: 'Không tìm thấy nội dung văn bản' }, { status: 400 });
    }

    // Tạo bài tập với Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt;
    if (type === 'multiple_choice') {
      prompt = `
      Dựa trên nội dung sau đây, hãy tạo ra ${count} câu hỏi trắc nghiệm tiếng Anh với độ khó tăng dần từ dễ đến khó.
      Mỗi câu hỏi cần có:
      - Câu hỏi chính
      - 4 lựa chọn A, B, C, D
      - Đáp án đúng
      - Giải thích chi tiết tại sao đáp án đó đúng
      - Gợi ý học tập
      ${existingQuestions.length > 0 ? `\nKhông được lặp lại các câu hỏi sau:\n${existingQuestions.map(q => '- ' + q).join('\n')}` : ''}
      Nội dung: ${text}

      Trả về kết quả dưới dạng JSON với cấu trúc:
      {
        "questions": [
          {
            "id": 1,
            "type": "multiple_choice",
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
    } else if (type === 'essay') {
      prompt = `
      Dựa trên nội dung sau đây, hãy tạo ra ${count} câu hỏi tự luận tiếng Anh với độ khó tăng dần từ dễ đến khó.
      Mỗi câu hỏi cần có:
      - Câu hỏi chính yêu cầu học sinh viết câu trả lời chi tiết
      - Đáp án mẫu để tham khảo
      - Gợi ý học tập
      - Độ khó phù hợp
      ${existingQuestions.length > 0 ? `\nKhông được lặp lại các câu hỏi sau:\n${existingQuestions.map(q => '- ' + q).join('\n')}` : ''}
      Nội dung: ${text}

      Trả về kết quả dưới dạng JSON với cấu trúc:
      {
        "questions": [
          {
            "id": 1,
            "type": "essay",
            "question": "Câu hỏi tự luận",
            "sampleAnswer": "Đáp án mẫu chi tiết",
            "hint": "Gợi ý học tập",
            "difficulty": "easy/medium/hard"
          }
        ]
      }
      `;
    } else {
      // Mixed type
      const multipleChoiceCount = Math.ceil(count / 2);
      const essayCount = count - multipleChoiceCount;
      
      prompt = `
      Dựa trên nội dung sau đây, hãy tạo ra ${count} câu hỏi tiếng Anh hỗn hợp với độ khó tăng dần từ dễ đến khó.
      Bao gồm:
      - ${multipleChoiceCount} câu hỏi trắc nghiệm
      - ${essayCount} câu hỏi tự luận
      ${existingQuestions.length > 0 ? `\nKhông được lặp lại các câu hỏi sau:\n${existingQuestions.map(q => '- ' + q).join('\n')}` : ''}
      Nội dung: ${text}

      Trả về kết quả dưới dạng JSON với cấu trúc:
      {
        "questions": [
          {
            "id": 1,
            "type": "multiple_choice",
            "question": "Câu hỏi trắc nghiệm",
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
          },
          {
            "id": 2,
            "type": "essay",
            "question": "Câu hỏi tự luận",
            "sampleAnswer": "Đáp án mẫu chi tiết",
            "hint": "Gợi ý học tập",
            "difficulty": "easy/medium/hard"
          }
        ]
      }
      `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Parse JSON response
    let questions;
    try {
      questions = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Tạo cấu trúc mặc định nếu không parse được
      questions = {
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: "Không thể tạo câu hỏi từ nội dung này. Vui lòng thử lại.",
            options: {
              A: "Không có đáp án",
              B: "Không có đáp án", 
              C: "Không có đáp án",
              D: "Không có đáp án"
            },
            correctAnswer: "A",
            explanation: "Vui lòng thử lại với nội dung khác.",
            hint: "Nội dung cần có thông tin tiếng Anh rõ ràng.",
            difficulty: "easy"
          }
        ]
      };
    }

    return NextResponse.json({ 
      success: true, 
      questions: questions.questions
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ 
      error: 'Có lỗi xảy ra khi tạo câu hỏi' 
    }, { status: 500 });
  }
} 