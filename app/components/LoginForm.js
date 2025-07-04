'use client';

import { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 tracking-tight">Đăng nhập hệ thống</h2>
        <div className="mb-5 relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400 text-gray-700 bg-gray-50"
            placeholder="Tài khoản"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
        </div>
        <div className="mb-5 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
          <input
            type="password"
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400 text-gray-700 bg-gray-50"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4 text-center font-medium">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
} 