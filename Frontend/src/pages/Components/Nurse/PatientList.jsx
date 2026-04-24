import { MdSearch, MdExpandMore, MdEditNote } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PatientList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [khoas, setKhoas] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Thêm state tìm kiếm
    const [selectedKhoa, setSelectedKhoa] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const fetchData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/departments');
            const data = await res.json();
            setKhoas(data);
        } catch (err) {
            console.error("Lỗi load khoa:", err);
        }
    };

    const loadPatients = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/patient-records');
            const data = await res.json();
            setPatients(data);
        } catch (err) {
            console.error("Lỗi load bệnh nhân:", err);
        }
    };

    useEffect(() => {
        fetchData();
        loadPatients();
    }, []);

    // --- XỬ LÝ LỌC & TÌM KIẾM ---
    const filteredPatients = patients.filter(p => {
        const matchSearch =
            p.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.chan_doan_ban_dau.toLowerCase().includes(searchTerm.toLowerCase());

        const matchKhoa = !selectedKhoa || selectedKhoa === "Tất cả" || p.ten_khoa === selectedKhoa;
        const matchStatus = !selectedStatus || selectedStatus === "Tất cả" || p.trang_thai_ho_so === selectedStatus;

        return matchSearch && matchKhoa && matchStatus;
    });

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
                Danh sách bệnh nhân ({filteredPatients.length})
            </h2>

            <div className="flex gap-4 mb-8">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        <MdSearch />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoặc chẩn đoán..."
                        className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3 pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Bộ lọc Khoa */}
                <div className="relative w-48">
                    <select
                        value={selectedKhoa}
                        onChange={(e) => setSelectedKhoa(e.target.value)}
                        className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3 px-5 text-[15px] appearance-none cursor-pointer font-medium focus:ring-2 focus:ring-slate-200 outline-none"
                    >
                        <option value="">Tất cả khoa</option>
                        {khoas.map(k => (
                            <option key={k.id} value={k.ten_khoa}>{k.ten_khoa}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">
                        <MdExpandMore />
                    </div>
                </div>

                {/* Bộ lọc Trạng thái */}
                <div className="relative w-48">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3 px-5 text-[15px] appearance-none cursor-pointer font-medium focus:ring-2 focus:ring-slate-200 outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Chờ xếp giường">Chờ xếp giường</option>
                        <option value="Đang điều trị">Đang điều trị</option>
                        <option value="Chờ xuất viện">Chờ xuất viện</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">
                        <MdExpandMore />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 text-left bg-slate-50/50">
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[80px]">Mã BN</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[180px]">Họ và tên</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[150px]">Khoa</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[150px]">Giường</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[180px]">Chẩn đoán</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[120px]">Bác sĩ</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[120px]">Ngày vào</th>

                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[120px]">Trạng thái</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[80px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPatients.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-5 text-sm text-slate-500 font-mono">#{p.id}</td>
                                    <td className="px-4 py-5 text-sm font-bold text-slate-900">
                                        {p.ho_ten}
                                        <div className="text-[11px] font-normal text-slate-400">{p.gioi_tinh} - {p.nam_sinh}</div>
                                    </td>
                                    <td className="px-4 py-5 text-sm text-slate-600">
                                        {p.ten_khoa}
                                    </td>
                                    <td className="px-4 py-5 text-sm text-slate-600">
                                        {p.ma_giuong ? (
                                            <div className="text-xs text-blue-600 uppercase font-bold">{p.ma_giuong}</div>
                                        ) : (
                                            <div className="text-xs text-red-500">Chưa xếp</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-5 text-sm text-slate-600 italic">"{p.chan_doan_ban_dau}"</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.bac_si}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">
                                        {new Date(p.thoi_gian_nhap_vien).toLocaleDateString('vi-VN')}
                                        <div className="text-[11px] text-amber-600 font-bold">{p.so_ngay} ngày</div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${p.trang_thai_ho_so === 'Chờ xếp giường' ? 'bg-red-50 text-red-600 border-red-100' :
                                            p.trang_thai_ho_so === 'Chờ xuất viện' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {p.trang_thai_ho_so}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <button onClick={() => navigate(`/nurse/beds`)} className="p-2 bg-white text-slate-400 rounded-xl hover:text-blue-600 transition-all border border-slate-200 shadow-sm">
                                            <MdEditNote size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPatients.length === 0 && (
                        <div className="p-20 text-center text-slate-400 italic">
                            Không tìm thấy bệnh nhân nào phù hợp bộ lọc.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientList;