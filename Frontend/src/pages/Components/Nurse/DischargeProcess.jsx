import React, { useState, useEffect } from "react";
import { MdCheckCircle, MdInfoOutline, MdOutlineCheckBoxOutlineBlank, MdPrint, MdAssignmentInd } from "react-icons/md";
import { format } from 'date-fns';
const DischargeProcess = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checklist, setChecklist] = useState({
        medication: false,
        belongings: false,
        payment: false,
        prescription: false,
        followup: false
    });

    const checklistOptions = [
        { id: 'medication', label: 'Đã uống thuốc đầy đủ' },
        { id: 'belongings', label: 'Đã dọn đồ cá nhân' },
        { id: 'payment', label: 'Đã thanh toán viện phí' },
        { id: 'prescription', label: 'Đã lấy đơn thuốc về nhà' },
        { id: 'followup', label: 'Đã hẹn tái khám (nếu có)' }
    ];
    const fetchPatients = async () => {
        try {
            const userSession = sessionStorage.getItem("user")
            setLoading(true);

            const userData = JSON.parse(userSession);
            const nurseId = userData.id;

            const res = await fetch(`http://localhost:5000/api/patients/waiting-discharge?y_ta_id=${nurseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }

            });

            if (!res.ok) {
                throw new Error("Không thể lấy danh sách bệnh nhân");
            }

            const data = await res.json();
            setPatients(data);

        } catch (err) {
            console.error("Lỗi lấy danh sách:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const toggleCheck = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    const isAllChecked = checkedCount === checklistOptions.length;
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const nurseId = userData ? userData.id : null;
    const handleFinalConfirm = async () => {
        if (!isAllChecked) return;
        const token = sessionStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/patients/complete-discharge/${selectedPatient.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nurseId: nurseId })

            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Lỗi khi cập nhật");
            }

            const data = await res.json();

            if (data.success) {
                alert("Hoàn tất quy trình xuất viện!");
                setSelectedPatient(null);
                setChecklist({
                    medication: false,
                    belongings: false,
                    payment: false,
                    prescription: false,
                    followup: false
                });

                fetchPatients();
            }
        } catch (err) {
            console.error("Lỗi xác nhận:", err);
            alert("Lỗi khi cập nhật: " + err.message);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* HEADER - Cố định phía trên */}
            <header className="p-6 bg-white border-b border-slate-200 shrink-0 mx-6 mt-6 rounded-[1.5rem] shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 rounded-lg">
                        <MdAssignmentInd className="text-2xl text-sky-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Quản lý xuất viện</h1>
                        <p className="text-slate-500 text-xs font-medium">Kiểm tra y lệnh và xác nhận giải phóng giường Bệnh nhân chờ xuất viện</p>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA - Chia làm 2 cột */}
            <div className="flex flex-1 overflow-hidden p-6 gap-6">

                {/* LEFT COLUMN: Danh sách bệnh nhân (Master) */}
                <aside className="w-1/3 max-w-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                            Bệnh nhân chờ xuất viện
                        </h3>
                        <span className="bg-sky-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
                            {patients.length}
                        </span>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading ? (
                            <p className="text-gray-400 italic">Đang tải dữ liệu...</p>
                        ) : (
                            patients.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPatient(selectedPatient === p ? null : p)}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedPatient?.id === p.id
                                        ? "bg-sky-50 border-sky-200 shadow-md"
                                        : "bg-white border-slate-100 hover:border-sky-100"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{p.ho_ten}</h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(p.nam_sinh).toLocaleDateString('vi-VN')} - {p.gioi_tinh}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${selectedPatient?.id === p.id ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {p.ma_giuong}
                                        </span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Bác sĩ ra lệnh</p>
                                            <p className="text-xs font-medium text-slate-700">{p.fullname}</p>
                                        </div>
                                        <p className="text-[10px] italic text-slate-400">{p.ngay_ra_lenh}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* RIGHT COLUMN: Chi tiết kiểm tra (Detail) */}
                <main className="flex-1 flex flex-col min-w-0">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                            Chi tiết hồ sơ
                        </h2>
                        {selectedPatient && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                Đang xử lý
                            </span>
                        )}
                    </div>

                    <div className="bg-white flex-1 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col relative">
                        {selectedPatient ? (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                <div className="max-w-3xl mx-auto space-y-8">

                                    {/* SECTION 1: THÔNG TIN BỆNH NHÂN (Dạng Card nổi) */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                                            <MdAssignmentInd className="text-xl" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Hành chính & Bệnh lý</h3>
                                        </div>

                                        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-3 gap-6 relative overflow-hidden">
                                            {/* Trang trí góc card */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>

                                            <div className="col-span-2 space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Họ và tên bệnh nhân</label>
                                                <p className="text-xl font-black text-slate-800 tracking-tight">{selectedPatient.ho_ten}</p>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Mã bệnh nhân: #{selectedPatient.id}</label>
                                            </div>

                                            <div className="text-right space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Mã giường</label>
                                                <p className="text-xl font-black text-blue-600">{selectedPatient.ma_giuong}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ngày sinh</label>
                                                <p className="font-semibold text-slate-700">{new Date(selectedPatient.nam_sinh).toLocaleDateString('vi-VN')}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Giới tính</label>
                                                <p className="font-semibold text-slate-700">{selectedPatient.gioi_tinh}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Bác sĩ ra lệnh</label>
                                                <p className="font-semibold text-slate-700">{selectedPatient.fullname}</p>
                                            </div>

                                            <div className="col-span-3 pt-4 border-t border-slate-100">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase italic">Chẩn đoán ra viện</label>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed mt-1 italic">
                                                    "{selectedPatient.chan_doan_ban_dau}"
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MdCheckCircle className="text-xl" />
                                                <h3 className="text-xs font-bold uppercase tracking-wider">Quy trình xuất viện bắt buộc</h3>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                {checkedCount}/{checklistOptions.length} Hoàn tất
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {checklistOptions.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleCheck(item.id)}
                                                    className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${checklist[item.id]
                                                        ? "bg-green-50/50 border-green-200"
                                                        : "bg-white border-slate-50 hover:border-blue-100 hover:shadow-md"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`text-2xl transition-transform duration-300 ${checklist[item.id] ? "scale-110 text-green-600" : "text-slate-300 group-hover:text-blue-400"}`}>
                                                            {checklist[item.id] ? <MdCheckCircle /> : <MdOutlineCheckBoxOutlineBlank />}
                                                        </div>
                                                        <span className={`text-sm font-bold transition-colors ${checklist[item.id] ? "text-green-800" : "text-slate-600"}`}>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {checklist[item.id] && (
                                                        <span className="text-[10px] font-black text-green-600 uppercase">Đã kiểm tra</span>
                                                    )}
                                                </div>

                                            ))}
                                        </div>
                                    </section>
                                    <footer className="pt-6 border-t border-slate-100 flex gap-4">
                                        <button className="flex-1 flex items-center justify-center gap-2 py-4 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-all">
                                            <MdPrint /> In phiếu
                                        </button>
                                        <button
                                            onClick={handleFinalConfirm}
                                            disabled={!isAllChecked}
                                            className={`flex-[2] py-4 rounded-2xl font-black transition-all shadow-lg shadow-transparent ${isAllChecked
                                                    ? "bg-green-600 text-white hover:bg-green-700 shadow-green-100 active:scale-95"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                        >
                                            {isAllChecked ? "XÁC NHẬN HOÀN TẤT" : `CÒN ${checklistOptions.length - checkedCount} MỤC CHƯA XONG`}
                                        </button>
                                    </footer>
                                </div>
                            </div>
                        ) : (
                            /* EMPTY STATE - Trang nhã hơn */
                            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-12">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-blue-200 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                                    <div className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center border border-slate-100">
                                        <MdAssignmentInd className="text-6xl text-slate-200" />
                                    </div>
                                </div>
                                <div className="text-center max-w-xs">
                                    <h3 className="text-lg font-black text-slate-700 mb-2">Sẵn sàng kiểm tra</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                        Chọn một bệnh nhân từ danh sách bên trái để xem hồ sơ và thực hiện quy trình giải phóng giường.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DischargeProcess;