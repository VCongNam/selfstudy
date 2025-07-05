# AI English Learning

Ứng dụng học tiếng Anh thông minh sử dụng AI để tạo bài tập từ tài liệu PDF.

## Tính năng

- 📄 Upload file PDF chứa nội dung tiếng Anh
- 🤖 Sử dụng Gemini AI để tạo bài tập thông minh
- 🎯 **Hỗ trợ cả câu hỏi trắc nghiệm và tự luận**
- 🔢 **Tùy chọn số lượng câu hỏi (3-20 câu)**
- ➕ **Tạo thêm câu hỏi trong khi làm bài**
- 📊 Độ khó tăng dần từ dễ đến khó
- 💡 Giải thích chi tiết cho từng câu hỏi
- 💭 Gợi ý học tập cho người học
- 📈 Theo dõi tiến độ và kết quả học tập
- 🎨 Giao diện thân thiện, dễ sử dụng

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd selfstudy
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env.local` và thêm API key Gemini:
```bash
# Lấy API key từ: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Chạy ứng dụng:
```bash
npm run dev
```

5. Mở trình duyệt và truy cập: `http://localhost:3000`

## Cách sử dụng

1. **Chuẩn bị tài liệu**: Chuẩn bị file PDF chứa nội dung tiếng Anh (sách, bài báo, tài liệu học tập)

2. **Upload file**: 
   - Click "Chọn file PDF" và chọn file của bạn
   - Chọn số lượng câu hỏi (5-20 câu)
   - Chọn loại câu hỏi (hỗn hợp/trắc nghiệm/tự luận)

3. **Đợi AI xử lý**: AI sẽ phân tích nội dung và tạo bài tập (có thể mất vài giây)

4. **Làm bài tập**: 
   - **Câu trắc nghiệm**: Chọn đáp án A, B, C, D
   - **Câu tự luận**: Viết câu trả lời chi tiết
   - Xem gợi ý học tập nếu cần
   - Xem giải thích chi tiết sau khi trả lời

5. **Tạo thêm câu hỏi** (tùy chọn):
   - Trong khi làm bài, sử dụng phần "Tạo thêm câu hỏi"
   - Chọn số lượng và loại câu hỏi mới
   - AI sẽ tạo thêm câu hỏi dựa trên nội dung gốc

6. **Xem kết quả**: Kiểm tra điểm số và làm lại nếu muốn cải thiện

## Cấu trúc dự án

```
selfstudy/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.js          # API xử lý upload PDF và tạo bài tập
│   │   └── generate-questions/
│   │       └── route.js          # API tạo thêm câu hỏi
│   ├── components/
│   │   ├── FileUpload.js         # Component upload file
│   │   ├── QuestionCard.js       # Component hiển thị câu hỏi trắc nghiệm
│   │   ├── EssayQuestionCard.js  # Component hiển thị câu hỏi tự luận
│   │   ├── GenerateMoreQuestions.js # Component tạo thêm câu hỏi
│   │   └── QuizSection.js        # Component quản lý bài tập
│   ├── page.js                   # Trang chính
│   └── layout.js                 # Layout chung
├── public/                       # Tài nguyên tĩnh
├── .env.local                    # Cấu hình môi trường
└── package.json                  # Dependencies
```

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **AI**: Google Gemini AI
- **PDF Processing**: pdf-parse
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Lưu ý

- Cần có API key Gemini để sử dụng tính năng AI
- File PDF cần có nội dung tiếng Anh rõ ràng để AI có thể tạo bài tập tốt
- Kích thước file PDF không nên quá lớn để tránh timeout

## Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request để cải thiện ứng dụng.

## License

MIT License
