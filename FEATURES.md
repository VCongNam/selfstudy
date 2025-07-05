# Tính năng mới - AI English Learning

## 🎯 Tính năng câu hỏi tự luận

### Câu hỏi tự luận là gì?
- Câu hỏi yêu cầu học sinh viết câu trả lời chi tiết bằng tiếng Anh
- Không có đáp án cố định, thay vào đó có đáp án mẫu để tham khảo
- Giúp phát triển kỹ năng viết và tư duy phản biện

### Cách sử dụng câu hỏi tự luận:
1. **Nhập câu trả lời**: Sử dụng textarea để viết câu trả lời chi tiết
2. **Gửi câu trả lời**: Click nút "Gửi câu trả lời" sau khi hoàn thành
3. **Xem đáp án mẫu**: Sau khi trả lời, có thể xem đáp án mẫu để so sánh
4. **Chỉnh sửa**: Có thể chỉnh sửa câu trả lời bất cứ lúc nào

## 🔄 Tạo thêm câu hỏi

### Tùy chọn số lượng câu hỏi:
- **3 câu hỏi**: Phù hợp cho bài tập ngắn
- **5 câu hỏi**: Bài tập trung bình
- **10 câu hỏi**: Bài tập đầy đủ
- **15 câu hỏi**: Bài tập mở rộng
- **20 câu hỏi**: Bài tập toàn diện

### Loại câu hỏi:
1. **Hỗn hợp (Mixed)**: Kết hợp cả câu hỏi trắc nghiệm và tự luận
2. **Chỉ trắc nghiệm**: Tất cả câu hỏi đều là trắc nghiệm
3. **Chỉ tự luận**: Tất cả câu hỏi đều là tự luận

### Cách tạo thêm câu hỏi:
1. Trong khi làm bài tập, tìm phần "Tạo thêm câu hỏi" ở header
2. Chọn số lượng câu hỏi mong muốn
3. Chọn loại câu hỏi (hỗn hợp/trắc nghiệm/tự luận)
4. Click "Tạo thêm" và đợi AI tạo câu hỏi mới

## 📊 Cải tiến giao diện

### Phân biệt loại câu hỏi:
- **Câu trắc nghiệm**: Viền xanh, có 4 lựa chọn A, B, C, D
- **Câu tự luận**: Viền tím, có textarea để nhập câu trả lời

### Hiển thị tiến độ:
- Thanh tiến độ hiển thị vị trí câu hỏi hiện tại
- Số câu đã trả lời / tổng số câu
- Phân biệt rõ câu trắc nghiệm và tự luận

### Kết quả bài tập:
- Tính điểm dựa trên câu trắc nghiệm (đúng/sai)
- Câu tự luận được tính là hoàn thành nếu đã trả lời
- Hiển thị tỷ lệ phần trăm đúng

## 🚀 Cách sử dụng

### Bước 1: Upload file PDF
1. Chọn file PDF chứa nội dung tiếng Anh
2. Chọn số lượng câu hỏi (5-20 câu)
3. Chọn loại câu hỏi (hỗn hợp/trắc nghiệm/tự luận)
4. Click "Chọn file PDF"

### Bước 2: Làm bài tập
1. **Câu trắc nghiệm**: Chọn đáp án A, B, C, D
2. **Câu tự luận**: Viết câu trả lời chi tiết vào textarea
3. Sử dụng nút "Câu trước" và "Câu tiếp" để di chuyển
4. Xem gợi ý học tập cho mỗi câu hỏi

### Bước 3: Tạo thêm câu hỏi (tùy chọn)
1. Trong khi làm bài, click "Tạo thêm" ở header
2. Chọn số lượng và loại câu hỏi mới
3. AI sẽ tạo thêm câu hỏi dựa trên nội dung gốc

### Bước 4: Xem kết quả
1. Sau khi hoàn thành tất cả câu hỏi, xem kết quả
2. Xem tỷ lệ đúng và số câu đã trả lời
3. Có thể làm lại bài tập hoặc tạo bài tập mới

## 💡 Lưu ý

- **Câu hỏi tự luận**: Không có đáp án đúng/sai, chỉ có đáp án mẫu để tham khảo
- **Tạo thêm câu hỏi**: Chỉ hoạt động khi đã có bài tập hiện tại
- **Lưu trữ**: Câu trả lời được lưu tạm thời trong phiên làm việc
- **Độ khó**: Câu hỏi được sắp xếp theo độ khó tăng dần (dễ → trung bình → khó)

## 🔧 Yêu cầu hệ thống

- Node.js 16+ 
- Gemini API key
- Các package: express, multer, pdf-parse, axios, cors
- Next.js 13+ với App Router 