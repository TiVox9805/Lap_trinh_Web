import { MdSearch, MdExpandMore } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const PatientList = () => {
    const navigate = useNavigate();
    const patients = [
        {
            id: "BN001",
            name: "Trần Minh Đức",
            birthYear: 2005,
            gender: "Nam",
            department: "Sản",
            room: "",
            initialDiagnosis: "vỡ ối",
            doctor: "BS. Nguyễn Văn B",
            admittedDate: "2026-04-12",
            daysCount: 2,
            status: "chờ xếp giường",
            actions: ["Xếp giường", "Chuyển khoa"]
        }
    ];

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-in fade-in duration-500">
            {/* Tiêu đề danh sách */}
            <h2 className="text-xl font-bold text-slate-900 mb-6">
                Danh sách bệnh nhân ({patients.length})
            </h2>

            {/* Thanh công cụ: Tìm kiếm và Bộ lọc */}
            <div className="flex gap-4 mb-8">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        <MdSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc chẩn đoán..."
                        className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3 pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Bộ lọc Khoa */}
                <div className="relative w-48">
                    <select className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3 px-5 text-[15px] appearance-none cursor-pointer font-medium focus:ring-2 focus:ring-slate-200 outline-none">
                        <option>Tất cả khoa</option>
                        <option>Nội Tim Mạch</option>
                        <option>Ngoại Tổng Hợp</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">
                        <MdExpandMore />
                    </div>
                </div>

                {/* Bộ lọc Trạng thái */}
                <div className="relative w-48">
                    <select className="w-full bg-[#f1f5f9] border-none rounded-2xl py-3 px-5 text-[15px] appearance-none cursor-pointer font-medium focus:ring-2 focus:ring-slate-200 outline-none">
                        <option>Tất cả trạng thái</option>
                        <option>Đang điều trị</option>
                        <option>Chờ xuất viện</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">
                        <MdExpandMore />
                    </div>
                </div>
            </div>

            {/* Bảng danh sách bệnh nhân */}
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 text-left">
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[100px]">Mã BN</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[180px]">Họ và tên</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[100px]">Năm sinh</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[150px]">Khoa</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[100px]">Giường</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[150px]">Chẩn đoán</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[120px]">Bác sĩ</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[120px]">Ngày nhập</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[100px]">Số ngày</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[150px]">Trạng thái</th>
                                <th className="px-4 py-4 text-sm font-bold text-slate-800 w-[80px] text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {patients.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-5 text-sm text-slate-700">{p.id}</td>
                                    <td className="px-4 py-5 text-sm font-bold text-slate-900">{p.name}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.birthYear}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.department}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600 font-medium">{p.room}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.initialDiagnosis}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.doctor}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.admittedDate}</td>
                                    <td className="px-4 py-5 text-sm text-slate-600">{p.daysCount}</td>
                                    <td className="px-4 py-5">
                                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <button onClick={() => navigate(`/nurse/beds`)} className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200">
                                            <MdEditNote size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientList;