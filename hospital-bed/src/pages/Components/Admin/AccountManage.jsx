import React from "react";
import { MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";
import { useState } from "react";
const AccountManagement = () => {
    const accounts = [
        { id: 1, name: "BS. Nguyễn Văn A", email: "bsa@hospital.vn", password: "password123", role: "Bác sĩ", dept: "Nội Tim Mạch", status: "Hoạt động", date: "2024-01-15" },
        { id: 2, name: "BS. Trần Thị B", email: "bsb@hospital.vn", password: "password456", role: "Bác sĩ", dept: "Ngoại Tổng Hợp", status: "Hoạt động", date: "2024-02-20" },
        { id: 3, name: "Y tá Lê Văn C", email: "ytc@hospital.vn", password: "password789", role: "Y tá", dept: "-", status: "Hoạt động", date: "2024-03-10" },
    ];
    const [showAddForm, setShowAddForm] = useState(false);
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Danh sách Tài khoản (3)</h2>
                    <p className="text-slate-500 text-sm">Quản lý tài khoản nhân viên và phân quyền hệ thống</p>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <MdPersonAdd size={20} />
                    Thêm Tài khoản
                </button>
            </div>

            {/* Form thêm mới */}
            {showAddForm && (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 border-l-4 border-slate-900 pl-3">Thêm Tài khoản Mới</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Họ tên</label>
                            <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chuyên Khoa</label>
                            <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                            <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mật khẩu</label>
                            <input type="password" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vai trò</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none">
                                <option>Bác sĩ</option>
                                <option>Y tá</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Trạng thái</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:outline-none">
                                <option>Hoạt động</option>
                                <option>Khóa</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold">Thêm mới</button>
                        <button onClick={() => setShowAddForm(null)} className="bg-slate-100 text-slate-600 px-8 py-2.5 rounded-xl font-bold">Hủy</button>
                    </div>
                </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                            <th className="px-6 py-4">Họ tên</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Mật khẩu</th>
                            <th className="px-6 py-4">Vai trò</th>
                            <th className="px-6 py-4">Chuyên khoa</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm font-medium">
                        {accounts.map((acc) => (
                            <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-900 font-bold">{acc.name}</td>
                                <td className="px-6 py-4 text-slate-500">{acc.email}</td>
                                <td className="px-6 py-4 text-slate-500">{acc.password}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${acc.role === 'Bác sĩ' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {acc.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{acc.dept}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit text-[11px] font-bold">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        {acc.status}
                                    </span>
                                </td>
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