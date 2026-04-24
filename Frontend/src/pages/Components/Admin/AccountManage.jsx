import React from "react";
import { MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";

const AccountManagement = () => {

    const [showAddForm, setShowAddForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        fullname: '',
        username: '',
        password: '',
        role: 'Bác sĩ',
        khoa_id: '',
        status: 'Hoạt động',
        email_personal: '',
        phone: ''
    });
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            const data = await response.json();
            setUsers(data); // Đổ dữ liệu từ DB vào state
            setLoading(false);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser) // userData là đối tượng chứa thông tin tài khoản mới),
            });

            const data = await response.json();

            if (data.success) {
                alert('Thêm tài khoản thành công!');
                // Bạn có thể reload trang hoặc gọi lại hàm fetch danh sách để cập nhật bảng
                setNewUser({ // Reset form về trống
                    fullname: '', username: '', password: '', role: 'Bác sĩ',
                    khoa_id: '', status: 'Hoạt động', email_personal: '', phone: ''
                });
                fetchUsers();
                setShowAddForm(false); // Ẩn form sau khi thêm thành công
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Danh sách Tài khoản ({users.length})</h2>
                    <p className="text-slate-500 text-sm">Quản lý tài khoản nhân viên và phân quyền hệ thống</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <MdPersonAdd size={20} />
                    Thêm Tài khoản
                </button>
            </div>

            {/* Form thêm mới */}
            {showAddForm && (
                <form onSubmit={handleAddUser} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 border-l-4 border-slate-900 pl-3">Thêm Tài khoản Mới</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Họ tên</label>
                            <input type="text" value={newUser.fullname} onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chuyên Khoa</label>
                            <input type="text" value={newUser.khoa_id} onChange={(e) => setNewUser({ ...newUser, khoa_id: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tài khoản</label>
                            <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mật khẩu</label>
                            <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vai trò</label>
                            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none">
                                <option>Bác sĩ</option>
                                <option>Y tá</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</label>
                            <select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none">
                                <option>Hoạt động</option>
                                <option>Khóa</option>
                            </select>
                        </div>
                        <div className="space-y-2 ">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">email</label>
                            <input type="email" value={newUser.email_personal} onChange={(e) => setNewUser({ ...newUser, email_personal: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2 ">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SỐ ĐIỆN THOẠI</label>
                            <input type="tel" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                    </div>
                    <div className="flex gap-3 space-y-2 ">
                        <button type="submit" className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold">Thêm mới</button>
                        <button onClick={() => setShowAddForm(false)} className="bg-slate-100 text-slate-600 px-8 py-2.5 rounded-xl font-bold">Hủy</button>
                    </div>
                </form>
            )}

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                            <th className="px-6 py-4">Họ tên</th>
                            <th className="px-6 py-4">Tài khoản</th>
                            <th className="px-6 py-4">Mật khẩu</th>
                            <th className="px-6 py-4">Vai trò</th>
                            <th className="px-6 py-4">Chuyên khoa</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Số điện thoại</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm font-medium">
                        {users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-bold">{user.fullname}</td>
                                <td className="px-6 py-4 text-slate-500">{user.username}</td>
                                <td className="px-6 py-4 text-slate-500">{user.password}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${user.role === 'BAC_SI' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{user.khoa_id}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit text-[11px] font-bold">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{user.email_personal}</td>
                                <td className="px-6 py-4 text-slate-500">{user.phone}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg shadow-sm transition-all"><MdEdit size={18} /></button>
                                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg shadow-sm transition-all"><MdDelete size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountManagement;