import { NextResponse } from 'next/server';

const USER = {
  username: 'admin',
  password: '123456',
};

const SECRET = 'supersecretkey'; // Đơn giản, không dùng cho production

function createToken(username) {
  // Tạo token đơn giản (không mã hóa, chỉ demo)
  return Buffer.from(`${username}:${SECRET}`).toString('base64');
}

export async function POST(request) {
  const { username, password } = await request.json();
  if (username === USER.username && password === USER.password) {
    const token = createToken(username);
    return NextResponse.json({ success: true, token });
  }
  return NextResponse.json({ success: false, error: 'Sai tài khoản hoặc mật khẩu' }, { status: 401 });
} 