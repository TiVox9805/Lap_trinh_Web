import {
    MdSearch, MdError, MdInfoOutline, MdAddCircle,
    MdWarning, MdLocationOn, MdCheckCircle, MdCheck
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
const TaskList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Tất cả");
    const { y_ta_id } = useOutletContext();


    const loadPatients = async () => {
        if (!y_ta_id) {
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/patients/patient-records?y_ta_id=${y_ta_id}`);
            const data = await res.json();
            setPatients(data);
        } catch (err) {
            console.error("Lỗi load bệnh nhân:", err);
        }
    };
    const loadOrders = async () => {
        if (!y_ta_id) return;
        try {
            const res = await fetch(`http://localhost:5000/api/nurse-task?y_ta_id=${y_ta_id}`);
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Lỗi load y lệnh:", err);
        }
    };
    useEffect(() => {
        loadPatients();
        loadOrders();
    }, [y_ta_id]);
    // --- XỬ LÝ LỌC & TÌM KIẾM ---
    const filteredPatients = patients.filter(p => {
        const matchSearch =
            p.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.chan_doan_ban_dau.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !selectedStatus || selectedStatus === "Tất cả" || p.trang_thai_ho_so === selectedStatus;

        return matchSearch && matchStatus;
    });
    const handleOpenBedSelection = (task) => {
        navigate(`/nurse/beds`);
    };

    const handleConfirmDischarge = async (task) => {
        navigate(`/nurse/DischargeProcessNurse`);
    }


    const handleCompleteOrder = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}/complete`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                loadOrders();
            } else {
                console.error("Không thể cập nhật trạng thái y lệnh");
            }
        } catch (err) {
            console.error("Lỗi khi bấm hoàn thành:", err);
        }
    };
    const tasks = [
        ...patients.map(p => {
            let type = '';
            if (!p.ma_giuong) type = 'assign_bed';
            else if (p.trang_thai_ho_so === 'Chờ xuất viện') type = 'discharge';
            return { ...p, type };
        }).filter(t => t.type !== ''),
        ...orders.map(o => ({
            ...o,
            type: 'order'
        }))
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
                // --- 1. GIAO DIỆN TASK XẾP GIƯỜNG (Màu Indigo) ---
                if (task.type === 'assign_bed') {
                    return (
                        <div key={`bed-${task.id}`} className="bg-white rounded-[32px] p-6 border-2 border-dashed border-indigo-200 bg-indigo-50/20 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-sm shadow-indigo-100">
                                        Hành chính
                                    </span>
                                    <div className="flex items-center gap-1 text-indigo-600 animate-pulse">
                                        <MdError size={14} />
                                        <span className="text-[10px] font-bold uppercase">Chờ xếp giường</span>
                                    </div>
                                </div>
                                <h4 className="font-extrabold text-slate-800 text-lg mb-1">BN: {task.ho_ten}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 font-semibold">
                                    <span className="bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                                        {task.gioi_tinh || "Chưa rõ giới tính"}
                                    </span>
                                    <span className="bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
                                        Năm sinh: {new Date(task.nam_sinh).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="p-4 bg-white/90 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-4 shadow-inner">
                                    <strong className="block mb-1 text-indigo-700 text-[11px] uppercase font-black tracking-wide">
                                        Chẩn đoán ban đầu:
                                    </strong>
                                    <p className="line-clamp-2 leading-relaxed italic text-slate-700">
                                        {task.chan_doan_ban_dau || "Chưa có chẩn đoán lâm sàng"}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1 italic">
                                    <MdInfoOutline /> Vừa nhập viện - Cần bố trí vị trí nằm
                                </p>
                            </div>

                            <button
                                onClick={() => handleOpenBedSelection(task)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 mt-4"
                            >
                                <MdAddCircle size={20} /> Chọn giường cho bệnh nhân
                            </button>
                        </div>
                    );
                }

                // --- 2. GIAO DIỆN TASK XUẤT VIỆN (Màu Red/Rose) ---
                if (task.type === 'discharge') {
                    return (
                        <div key={`out-${task.id}`} className="bg-white rounded-[32px] p-6 border-2 border-red-100 bg-red-50/30 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm shadow-rose-100">
                                        Thủ tục
                                    </span>
                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Xuất viện</span>
                                </div>
                                <h4 className="font-extrabold text-slate-800 text-lg mb-1">BN: {task.ho_ten}</h4>
                                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                                    <MdLocationOn /> Giường: {task.ma_giuong} | Phòng: {task.ten_phong}
                                </p>
                                <div className="p-4 bg-white/80 rounded-2xl border border-red-100 text-[11px] text-rose-600 font-medium leading-relaxed mb-4">
                                    <strong className="block mb-1 text-rose-700">Yêu cầu hoàn tất:</strong>
                                    - Kiểm tra đồ dùng cá nhân <br />
                                    - Ký xác nhận bàn giao giường & thiết bị.
                                </div>
                            </div>

                            <button
                                onClick={() => handleConfirmDischarge(task)}
                                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-rose-100"
                            >
                                Xác nhận đã rời viện
                            </button>
                        </div>
                    );
                }

                // --- 3. GIAO DIỆN Y LỆNH THƯỜNG (Dữ liệu cũ của bạn) ---
                return (
                    <div key={`order-${task.id}`} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${task.loai_y_lenh === 'Thuốc' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {task.loai_y_lenh}
                                </span>
                                {task.muc_do_uu_tien === 'Khẩn cấp' && (
                                    <span className="text-[10px] font-black text-amber-500 flex items-center gap-1 uppercase">
                                        <MdWarning size={14} /> Khẩn cấp
                                    </span>
                                )}
                            </div>

                            <h4 className="font-extrabold text-slate-800 text-lg mb-1">BN: {task.ho_ten}</h4>
                            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                                <MdLocationOn /> Giường: {task.ma_giuong} | Phòng: {task.ten_phong}
                            </p>

                            <div className="bg-slate-50 rounded-[24px] p-5 mb-4 border border-transparent hover:border-slate-100 transition-all">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    {task.noi_dung_y_lenh}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-[10px] text-slate-400 font-bold italic">BS: {task.ten_bac_si}</span>
                            {task.trang_thai === 'Đã hoàn thành' ? (
                                <div className="flex items-center gap-1 text-emerald-500 font-black text-[11px] uppercase">
                                    <MdCheckCircle size={18} /> Đã xong
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleCompleteOrder(task.id)}
                                    className={`p-2 px-6 rounded-2xl font-black text-xs transition-all flex items-center gap-2 hover:bg-green-700 hover:text-white ${task.loai_y_lenh === 'Thuốc'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-purple-600 text-white'
                                        }`}
                                >
                                    <MdCheck size={18} /> Xong
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;