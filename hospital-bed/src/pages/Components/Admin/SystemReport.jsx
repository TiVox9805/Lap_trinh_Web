import React from "react";
import {
    MdPeople,
    MdMonitorHeart,
    MdBed,
    MdAutoGraph
} from "react-icons/md";

const SystemReport = () => {
    // Dữ liệu mẫu dựa trên ảnh
    const summaryData = [
        { label: "Nhân viên Hoạt động", value: "3", icon: <MdPeople size={24} />, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Bác sĩ / Y tá", value: "2 / 1", icon: <MdMonitorHeart size={24} />, color: "text-emerald-500", bg: "bg-emerald-50" },
        { label: "Bệnh nhân Hiện tại", value: "0", icon: <MdPeople size={24} />, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Công suất Giường", value: "0.0%", icon: <MdAutoGraph size={24} />, color: "text-orange-500", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Báo cáo Tổng quan Hệ thống</h2>
            </div>

            {/* 1. HÀNG THẺ CHỈ SỐ (TOP STATS) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {summaryData.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                            <p className="text-2xl font-black text-slate-800">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. KHU VỰC THỐNG KÊ CHI TIẾT (BOTTOM GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Thống kê Nhân viên */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Thống kê Nhân viên</h3>
                    <div className="space-y-3">
                        <StatRow label="Tổng số tài khoản" value="3" color="bg-slate-100" />
                        <StatRow label="Bác sĩ" value="2" color="bg-blue-100 text-blue-700" />
                        <StatRow label="Y tá" value="1" color="bg-emerald-100 text-emerald-700" />
                        <StatRow label="Đang hoạt động" value="3" color="bg-emerald-50 text-emerald-600 border border-emerald-100" />
                        <StatRow label="Tạm ngưng" value="0" color="bg-slate-50 text-slate-400" />
                    </div>
                </div>

                {/* Thống kê Giường bệnh */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg text-slate-800">Thống kê Giường bệnh</h3>
                    <div className="space-y-3">
                        <StatRow label="Tổng số giường" value="12" color="bg-slate-100" />
                        <StatRow label="Đang sử dụng" value="0" color="bg-red-50 text-red-600" />
                        <StatRow label="Còn trống" value="12" color="bg-emerald-50 text-emerald-600" />
                        <StatRow label="Đang dọn" value="0" color="bg-yellow-50 text-yellow-600" />
                        <StatRow label="Tỷ lệ lấp đầy" value="0.0%" color="bg-blue-50 text-blue-600" />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Component phụ trợ cho từng dòng thống kê
const StatRow = ({ label, value, color }) => (
    <div className={`flex justify-between items-center p-4 rounded-xl font-bold text-sm ${color}`}>
        <span className="tracking-tight">{label}</span>
        <span className="text-base">{value}</span>
    </div>
);

export default SystemReport;