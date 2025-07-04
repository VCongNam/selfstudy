# Hướng dẫn cấu hình AI English Learning

## Bước 1: Lấy API Key Gemini

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Click "Create API Key"
4. Copy API key được tạo ra

## Bước 2: Cấu hình môi trường

1. Tạo file `.env.local` trong thư mục gốc của dự án
2. Thêm nội dung sau vào file:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Lưu ý**: Thay `your_actual_api_key_here` bằng API key thực tế bạn đã lấy ở bước 1.

## Bước 3: Khởi chạy ứng dụng

```bash
npm run dev
```

## Bước 4: Kiểm tra hoạt động

1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Upload một file PDF chứa nội dung tiếng Anh
3. Kiểm tra xem AI có tạo bài tập thành công không

## Xử lý lỗi thường gặp

### Lỗi "API key không hợp lệ"
- Kiểm tra lại API key trong file `.env.local`
- Đảm bảo API key được copy đầy đủ, không thiếu ký tự

### Lỗi "Không thể kết nối đến server"
- Kiểm tra kết nối internet
- Đảm bảo server đang chạy (`npm run dev`)

### Lỗi "Không thể tạo câu hỏi từ nội dung này"
- File PDF có thể không chứa đủ nội dung tiếng Anh
- Thử với file PDF khác có nội dung rõ ràng hơn

## Bảo mật

- Không chia sẻ API key với người khác
- Không commit file `.env.local` lên git
- File `.env.local` đã được thêm vào `.gitignore`

## Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console của trình duyệt (F12)
2. Terminal nơi chạy server
3. Đảm bảo tất cả dependencies đã được cài đặt 