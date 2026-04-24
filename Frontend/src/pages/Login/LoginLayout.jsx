import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogin } from 'react-icons/md';
const LoginLayout = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isAuthenticated', 'true');

                // Điều hướng dựa trên vai trò
                if (data.user.role === 'Bác sĩ') {
                    navigate('/doctor');
                } else if (data.user.role === 'Y tá') {
                    navigate('/nurse');
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            alert('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
        }
        finally {
            setLoading(false); // Kết thúc load cho dù thành công hay thất bại
        }
    }
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-slate-100 rounded-full mb-4 text-slate-900">
                        <MdLogin size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Đăng nhập</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Hệ thống quản lý giường bệnh</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800 ml-1">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-700"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800 ml-1">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all font-medium text-slate-700"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-950 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 mt-2"
                    >
                        {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
                    </button>
                </form>

            </div>
        </div>
    );
}
export default LoginLayout;