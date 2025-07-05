require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const cors = require("cors");

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    const count = parseInt(req.body.count) || 10;
    const type = req.body.type || 'mixed';

    const pdfData = await pdfParse(req.file.buffer);
    const textContent = pdfData.text;

    // Prompt cho Gemini
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

Nội dung: ${textContent}

Chỉ trả về kết quả dưới dạng JSON, không giải thích, không thêm bất kỳ text nào ngoài JSON. Định dạng:
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

Nội dung: ${textContent}

Chỉ trả về kết quả dưới dạng JSON, không giải thích, không thêm bất kỳ text nào ngoài JSON. Định dạng:
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

Nội dung: ${textContent}

Chỉ trả về kết quả dưới dạng JSON, không giải thích, không thêm bất kỳ text nào ngoài JSON. Định dạng:
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

    // Gọi Gemini API
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Parse kết quả từ Gemini
    let questions;
    let rawText = geminiRes.data.candidates[0].content.parts[0].text;
    const match = rawText.match(/{[\s\S]*}/);
    if (match) {
      try {
        questions = JSON.parse(match[0]);
      } catch (e) {
        questions = { questions: [] };
      }
    } else {
      questions = { questions: [] };
    }

    res.json({
      success: true,
      questions: questions.questions,
      originalText: textContent.substring(0, 500) + "..."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xử lý file PDF hoặc gọi Gemini AI' });
  }
});

// Endpoint để tạo thêm câu hỏi
app.post("/generate-questions", async (req, res) => {
  try {
    const { text, count, type } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const questionCount = parseInt(count) || 5;
    const questionType = type || 'mixed';

    // Prompt cho Gemini
    let prompt;
    if (questionType === 'multiple_choice') {
      prompt = `
Dựa trên nội dung sau đây, hãy tạo ra ${questionCount} câu hỏi trắc nghiệm tiếng Anh với độ khó tăng dần từ dễ đến khó.
Mỗi câu hỏi cần có:
- Câu hỏi chính
- 4 lựa chọn A, B, C, D
- Đáp án đúng
- Giải thích chi tiết tại sao đáp án đó đúng
- Gợi ý học tập

Nội dung: ${text}

Chỉ trả về kết quả dưới dạng JSON, không giải thích, không thêm bất kỳ text nào ngoài JSON. Định dạng:
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
    } else if (questionType === 'essay') {
      prompt = `
Dựa trên nội dung sau đây, hãy tạo ra ${questionCount} câu hỏi tự luận tiếng Anh với độ khó tăng dần từ dễ đến khó.
Mỗi câu hỏi cần có:
- Câu hỏi chính yêu cầu học sinh viết câu trả lời chi tiết
- Đáp án mẫu để tham khảo
- Gợi ý học tập
- Độ khó phù hợp

Nội dung: ${text}

Chỉ trả về kết quả dưới dạng JSON, không giải thích, không thêm bất kỳ text nào ngoài JSON. Định dạng:
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
      const multipleChoiceCount = Math.ceil(questionCount / 2);
      const essayCount = questionCount - multipleChoiceCount;
      
      prompt = `
Dựa trên nội dung sau đây, hãy tạo ra thêm ${questionCount} khác với các câu hỏi đã có, câu hỏi tiếng Anh hỗn hợp với độ khó tăng dần từ dễ đến khó.
Bao gồm:
- ${multipleChoiceCount} câu hỏi trắc nghiệm
- ${essayCount} câu hỏi tự luận

Nội dung: ${text}

Chỉ trả về kết quả dưới dạng JSON, không giải thích, không thêm bất kỳ text nào ngoài JSON. Định dạng:
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

    // Gọi Gemini API
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Parse kết quả từ Gemini
    let questions;
    let rawText = geminiRes.data.candidates[0].content.parts[0].text;
    const match = rawText.match(/{[\s\S]*}/);
    if (match) {
      try {
        questions = JSON.parse(match[0]);
      } catch (e) {
        questions = { questions: [] };
      }
    } else {
      questions = { questions: [] };
    }

    res.json({
      success: true,
      questions: questions.questions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Có lỗi xảy ra khi tạo câu hỏi' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Node backend running on port ${PORT}`));
