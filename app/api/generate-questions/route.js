export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Hàm chuẩn hóa nội dung câu hỏi để so sánh trùng sâu
function normalizeQuestionText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(request) {
  try {
    let text, count, type, difficulty = 'any', existingQuestions = [], existingQuestionsFull = [];
    if (request.headers.get('content-type')?.includes('application/json')) {
      const body = await request.json();
      text = body.text;
      count = parseInt(body.count) || 5;
      type = body.type || 'mixed';
      difficulty = body.difficulty || 'any';
      existingQuestions = Array.isArray(body.existingQuestions) ? body.existingQuestions : [];
      if (body.existingQuestionsFull) {
        try {
          existingQuestionsFull = JSON.parse(body.existingQuestionsFull);
        } catch {}
      }
    } else {
      const formData = await request.formData();
      text = formData.get('text');
      count = parseInt(formData.get('count')) || 5;
      type = formData.get('type') || 'mixed';
      difficulty = formData.get('difficulty') || 'any';
      try {
        existingQuestions = JSON.parse(formData.get('existingQuestions'));
      } catch { existingQuestions = []; }
      try {
        existingQuestionsFull = JSON.parse(formData.get('existingQuestionsFull'));
      } catch { existingQuestionsFull = []; }
    }

    if (!text) {
      return NextResponse.json({ error: 'Không tìm thấy nội dung văn bản' }, { status: 400 });
    }

    // Tạo bài tập với Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt;
    let difficultyText = '';
    if (difficulty && difficulty !== 'any') {
      difficultyText = `Tất cả câu hỏi phải có độ khó ${difficulty === 'easy' ? 'dễ' : difficulty === 'medium' ? 'trung bình' : 'khó'} (difficulty: ${difficulty}). Không tạo câu hỏi ở độ khó khác.`;
    }
    if (type === 'multiple_choice') {
      prompt = `
      Dựa trên nội dung sau đây, hãy tạo ra ${count} câu hỏi trắc nghiệm tiếng Anh${difficulty === 'any' ? ' với độ khó tăng dần từ dễ đến khó' : ''}.
      ${difficultyText}
      Mỗi câu hỏi cần có:
      - Câu hỏi chính
      - 4 lựa chọn A, B, C, D
      - Đáp án đúng
      - Giải thích chi tiết tại sao đáp án đó đúng
      - Gợi ý học tập
      ${existingQuestions.length > 0 ? `\n\nLưu ý: Không được tạo lại bất kỳ câu hỏi nào giống hoặc gần giống với các câu hỏi sau, kể cả thay đổi từ ngữ, dấu câu, hoặc trật tự từ.\nDanh sách câu hỏi đã có:\n${existingQuestions.map(q => '- ' + q).join('\n')}` : ''}
      ${existingQuestionsFull.length > 0 ? `\n\nKhông được tạo lại bất kỳ câu hỏi nào giống hoặc gần giống với các object JSON sau:\n${existingQuestionsFull.map(q => JSON.stringify(q)).join('\n')}` : ''}
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
      Dựa trên nội dung sau đây, hãy tạo ra ${count} câu hỏi tự luận tiếng Anh${difficulty === 'any' ? ' với độ khó tăng dần từ dễ đến khó' : ''}.
      ${difficultyText}
      Mỗi câu hỏi cần có:
      - Câu hỏi chính yêu cầu học sinh viết câu trả lời chi tiết
      - Đáp án mẫu để tham khảo
      - Gợi ý học tập
      - Độ khó phù hợp
      ${existingQuestions.length > 0 ? `\n\nLưu ý: Không được tạo lại bất kỳ câu hỏi nào giống hoặc gần giống với các câu hỏi sau, kể cả thay đổi từ ngữ, dấu câu, hoặc trật tự từ.\nDanh sách câu hỏi đã có:\n${existingQuestions.map(q => '- ' + q).join('\n')}` : ''}
      ${existingQuestionsFull.length > 0 ? `\n\nKhông được tạo lại bất kỳ câu hỏi nào giống hoặc gần giống với các object JSON sau:\n${existingQuestionsFull.map(q => JSON.stringify(q)).join('\n')}` : ''}
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
      Dựa trên nội dung sau đây, hãy tạo ra ${count} câu hỏi tiếng Anh hỗn hợp${difficulty === 'any' ? ' với độ khó tăng dần từ dễ đến khó' : ''}.
      ${difficultyText}
      Bao gồm:
      - ${multipleChoiceCount} câu hỏi trắc nghiệm
      - ${essayCount} câu hỏi tự luận
      ${existingQuestions.length > 0 ? `\n\nLưu ý: Không được tạo lại bất kỳ câu hỏi nào giống hoặc gần giống với các câu hỏi sau, kể cả thay đổi từ ngữ, dấu câu, hoặc trật tự từ.\nDanh sách câu hỏi đã có:\n${existingQuestions.map(q => '- ' + q).join('\n')}` : ''}
      ${existingQuestionsFull.length > 0 ? `\n\nKhông được tạo lại bất kỳ câu hỏi nào giống hoặc gần giống với các object JSON sau:\n${existingQuestionsFull.map(q => JSON.stringify(q)).join('\n')}` : ''}
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

    // Lọc lại các câu hỏi mới ở backend để loại trùng sâu
    if (questions && Array.isArray(questions.questions) && (existingQuestions.length > 0 || existingQuestionsFull.length > 0)) {
      // Tạo danh sách id và nội dung đã chuẩn hóa từ existingQuestionsFull
      const existingIds = existingQuestionsFull.map(q => q.id);
      const existingNormalized = existingQuestionsFull.map(q => normalizeQuestionText(q.question));
      questions.questions = questions.questions.filter(q => {
        const norm = normalizeQuestionText(q.question);
        return !existingIds.includes(q.id) && !existingNormalized.includes(norm);
      });
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