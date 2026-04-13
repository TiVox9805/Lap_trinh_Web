import { MdSearch, MdExpandMore } from "react-icons/md";

const PatientList = () => {
    // Dữ liệu mẫu (sẽ được thay thế bằng dữ liệu thực sau khi nhập viện)
    const patients = [];

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
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="pb-4 font-bold text-slate-700 text-sm">Mã BN</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Họ và tên</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Năm sinh</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Khoa</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Giường</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Chẩn đoán</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Bác sĩ</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Ngày nhập</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm">Số ngày</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm text-center">Trạng thái</th>
                            <th className="pb-4 font-bold text-slate-700 text-sm text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((p, idx) => (
                                <tr key={idx} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                                    {/* Render dữ liệu ở đây */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="py-12 text-center text-gray-400 font-medium">
                                    Không tìm thấy bệnh nhân
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientList;