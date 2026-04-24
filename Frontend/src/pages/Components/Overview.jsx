import { MdPeople, MdTimeline, MdPersonAddAlt, MdCheckCircleOutline } from "react-icons/md";

const Overview = () => {
    // Dữ liệu mẫu
    const stats = [
        { label: "Tổng bệnh nhân", value: 1, icon: <MdPeople />, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Đang điều trị", value: 0, icon: <MdTimeline />, color: "text-green-600", bg: "bg-green-50" },
        { label: "Chờ xếp giường", value: 1, icon: <MdPersonAddAlt />, color: "text-yellow-600", bg: "bg-yellow-50" },
        { label: "Sẵn sàng xuất viện", value: 0, icon: <MdCheckCircleOutline />, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <h2 className="text-xl font-bold text-slate-900">Tổng quan bệnh nhân</h2>

            {/* 1. Hàng thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-[1.5rem] border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">{item.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{item.value}</h3>
                        </div>
                        <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-full flex items-center justify-center text-2xl`}>
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Tình trạng giường bệnh (Progress Bar) */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-8">Tình trạng giường bệnh</h3>

                <div className="grid grid-cols-4 mb-8 text-center">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Tổng số giường</p>
                        <p className="text-2xl font-bold text-slate-800">16</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Đang sử dụng</p>
                        <p className="text-2xl font-bold text-blue-600">0</p>
                        <p className="text-xs text-gray-400">0%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Còn trống</p>
                        <p className="text-2xl font-bold text-green-600">14</p>
                        <p className="text-xs text-gray-400">88%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Bảo trì</p>
                        <p className="text-2xl font-bold text-gray-500">2</p>
                        <p className="text-xs text-gray-400">13%</p>
                    </div>
                </div>

                {/* Thanh Progress bar đa màu */}
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{ width: "0%" }}></div>
                    <div className="h-full bg-green-500" style={{ width: "88%" }}></div>
                    <div className="h-full bg-slate-400" style={{ width: "12%" }}></div>
                </div>
            </div>

            {/* 3. Phân bổ theo khoa */}
            <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-6">Phân bổ theo khoa</h3>
                <div className="flex justify-between items-center py-2">
                    <span className="font-bold text-slate-800">Nội Tim Mạch</span>
                    <div className="flex items-center gap-4 w-1/3">
                        <div className="flex-1 h-2 bg-slate-900 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-600">1 (100%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;