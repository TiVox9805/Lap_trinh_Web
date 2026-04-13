import { useState } from "react";

const ArrangeBed = () => {
    const [selectedKhoa, setSelectedKhoa] = useState("Tất cả");

    const beds = [
        { id: "P101 - G1", khoa: "Nội Tim Mạch" },
        { id: "P101 - G2", khoa: "Nội Tim Mạch" },
        { id: "P102 - G1", khoa: "Nội Tim Mạch" },
        { id: "P102 - G2", khoa: "Nội Tim Mạch" },
        { id: "P201 - G1", khoa: "Ngoại Tổng Hợp" },
        { id: "P201 - G2", khoa: "Ngoại Tổng Hợp" },
    ];

    const statuses = [
        { label: "Trống", count: 14, colorClass: "bg-green-500" },
        { label: "Đang sử dụng", count: 0, colorClass: "bg-blue-500" },
        { label: "Bảo trì", count: 2, colorClass: "bg-gray-400" },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* 1. Thanh Filter & Legend (Nằm ngang) */}
            <div className="flex justify-between items-center border border-gray-100 bg-white p-6 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-gray-700">Khoa:</label>
                    <select
                        value={selectedKhoa}
                        onChange={(e) => setSelectedKhoa(e.target.value)}
                        className="border-none bg-gray-50 rounded-xl px-5 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 w-48 font-semibold cursor-pointer"
                    >
                        <option>Tất cả</option>
                        <option>Nội Tim Mạch</option>
                        <option>Ngoại Tổng Hợp</option>
                    </select>
                </div>

                <div className="flex items-center gap-8">
                    {statuses.map((status) => (
                        <div key={status.label} className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${status.colorClass}`}></span>
                            <p className="text-sm font-bold text-gray-600">
                                {status.label} <span className="text-gray-400 font-medium">({status.count})</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Danh sách giường (Dạng Lưới) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {beds.map((bed, index) => (
                    <div
                        key={index}
                        className="bg-[#ebfef5] border border-green-100 rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-sm hover:shadow-xl hover:shadow-green-100/50 transition-all duration-300 group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-[#166534] font-black text-2xl tracking-tight leading-none">{bed.id}</h3>
                                <p className="text-green-700/60 font-bold mt-2 text-sm uppercase tracking-wider">{bed.khoa}</p>
                            </div>
                            <span className="text-2xl bg-white/50 p-3 rounded-2xl group-hover:scale-110 transition-transform">🛏️</span>
                        </div>

                        <div className="flex">
                            <span className="bg-white px-5 py-1.5 rounded-full text-xs font-bold text-[#166534] border border-green-50 shadow-sm">
                                Trống
                            </span>
                        </div>

                        <button className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
                            Xếp giường
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArrangeBed;