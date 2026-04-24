import { useState, useEffect } from "react";
import BedAssignmentModal from "./BedAssignmentModal";

const ArrangeBed = () => {
    const [selectedKhoa, setSelectedKhoa] = useState("Tất cả");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetBed, setTargetBed] = useState(null);
    const [waitingPatients, setWaitingPatients] = useState([]);
    const [beds, setBeds] = useState([]); // Khởi tạo mảng rỗng
    const [khoas, setKhoas] = useState([]); // Thêm state lưu danh sách khoa

    const loadWaitingList = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/nurse/waiting-list');
            const data = await res.json();
            setWaitingPatients(data);
        } catch (err) {
            console.error("Lỗi load danh sách chờ:", err);
        }
    };

    const loadBeds = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/beds');
            const data = await res.json();
            setBeds(data);
        } catch (err) {
            console.error("Lỗi load giường:", err);
        }
    };

    const loadKhoas = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/departments');
            const data = await res.json();
            setKhoas(data);
        } catch (err) {
            console.error("Lỗi load khoa:", err);
        }
    };

    useEffect(() => {
        loadWaitingList();
        loadBeds();
        loadKhoas();
    }, []);

    // --- LOGIC TÍNH TOÁN LEGEND (Dựa trên dữ liệu thực) ---
    const bedStats = {
        trong: beds.filter(b => b.trang_thai === "Trống").length,
        suDung: beds.filter(b => b.trang_thai === "Đang sử dụng").length,
        baoTri: beds.filter(b => b.trang_thai === "Bảo trì").length,
    };

    const statuses = [
        { label: "Trống", count: bedStats.trong, colorClass: "bg-green-500" },
        { label: "Đang sử dụng", count: bedStats.suDung, colorClass: "bg-blue-500" },
        { label: "Bảo trì", count: bedStats.baoTri, colorClass: "bg-gray-400" },
    ];

    const handleConfirmAssignment = async (hosoId) => {
        if (!targetBed) return;
        try {
            const response = await fetch('http://localhost:5000/api/nurse/assign-bed', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hoso_id: hosoId,
                    giuong_id: targetBed.id // Sử dụng ID từ DB
                })
            });

            if (response.ok) {
                alert("Xếp giường thành công!");
                loadWaitingList();
                loadBeds();
                setIsModalOpen(false);
            }
        } catch (error) {
            alert("Lỗi server!");
        }
    };

    // --- LOGIC LỌC DỮ LIỆU ---
    // Lưu ý: So sánh với bed.ten_khoa (tên cột sau khi JOIN ở Backend)
    const filteredBeds = selectedKhoa === "Tất cả"
        ? beds
        : beds.filter(bed => bed.ten_khoa === selectedKhoa);

    return (
        <div className="flex flex-col gap-8">
            {/* 1. Thanh Filter & Legend */}
            <div className="flex justify-between items-center border border-gray-100 bg-white p-6 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-gray-700">Khoa:</label>
                    <select
                        value={selectedKhoa}
                        onChange={(e) => setSelectedKhoa(e.target.value)}
                        className="border-none bg-gray-50 rounded-xl px-5 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 w-56 font-semibold cursor-pointer"
                    >
                        <option value="Tất cả">Tất cả các khoa</option>
                        {khoas.map(k => (
                            <option key={k.id} value={k.ten_khoa}>{k.ten_khoa}</option>
                        ))}
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

            {/* 2. Danh sách giường */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBeds.map((bed) => {
                    // Đồng bộ biến trạng thái với Database
                    const isMaintenance = bed.trang_thai === "Bảo trì";
                    const isOccupied = bed.trang_thai === "Đang sử dụng";
                    const isAvailable = bed.trang_thai === "Trống";

                    return (
                        <div
                            key={bed.id}
                            className={`border rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-sm transition-all duration-300 group ${isMaintenance ? "bg-gray-100 border-gray-200 opacity-70" :
                                isOccupied ? "bg-blue-50 border-blue-200" :
                                    "bg-[#ebfef5] border-green-100 hover:shadow-xl hover:shadow-green-100/50"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    {/* Hiển thị mã giường từ cột ma_giuong */}
                                    <h3 className="text-[#166534] font-black text-2xl tracking-tight leading-none">
                                        {bed.ma_giuong}
                                    </h3>
                                    <p className="text-green-700/60 font-bold mt-2 text-sm uppercase tracking-wider">
                                        {bed.ten_phong} - {bed.ten_khoa}
                                    </p>
                                </div>
                                <span className="text-2xl bg-white/50 p-3 rounded-2xl group-hover:scale-110 transition-transform">🛏️</span>
                            </div>

                            <div className="flex">
                                <span className={`px-5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${isMaintenance ? "bg-gray-200 text-gray-600 border-gray-300" :
                                    isOccupied ? "bg-blue-600 text-white border-blue-700" :
                                        "bg-white text-[#166534] border-green-50"
                                    }`}>
                                    {bed.trang_thai}
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    if (!isAvailable) return;
                                    setTargetBed(bed);
                                    setIsModalOpen(true);
                                }}
                                disabled={!isAvailable}
                                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${isAvailable
                                    ? "bg-[#0f172a] text-white hover:bg-slate-800 shadow-slate-200"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                    }`}
                            >
                                {isAvailable ? 'Xếp giường' : isMaintenance ? 'Đang bảo trì' : 'Đã xếp bệnh nhân'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <BedAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedBed={targetBed}
                patients={waitingPatients}
                onConfirm={(hosoId) => handleConfirmAssignment(hosoId)}
            />
        </div>
    );
};

export default ArrangeBed;