import React, { useState, useEffect } from 'react';
import { MdPersonOutline, MdAssignmentInd, MdLogout, MdInfoOutline, MdPerson, MdContactPage, MdMeetingRoom, MdKingBed, MdFingerprint, MdCake, MdWc, MdBloodtype, MdMonitorWeight, MdMedicalServices, MdHistory, MdCheck } from 'react-icons/md';

const DoctorDischarge = () => {
    const [patients, setPatients] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const selectedPatient = patients.find(p => p.id === selectedId);

    // Lấy danh sách bệnh nhân ĐANG ĐIỀU TRỊ
    const fetchInTreatment = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/patients/inpatient');
            const data = await res.json();
            setPatients(data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInTreatment();

    }, []);

    // Xử lý lệnh Cho phép xuất viện
    const handleIssueDischargeOrder = async () => {
        if (!selectedPatient) return;
        if (!window.confirm(`Xác nhận cho phép bệnh nhân ${selectedPatient.ho_ten} xuất viện?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/patients/discharge-order/${selectedPatient.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

            if (res.ok) {
                alert("Lệnh xuất viện đã được gửi tới Điều dưỡng.");
                setSelectedId(null);
                fetchInTreatment();
            }
        } catch (err) {
            alert("Không thể thực hiện lệnh lúc này.");
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">

            <header className="p-6 bg-white border-b border-slate-200 shrink-0 rounded-[1.5rem] mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-sky-100 rounded-lg">
                        <MdAssignmentInd className="text-2xl text-sky-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Quản lý xuất viện</h1>
                        <p className="text-slate-500 text-xs font-medium">Hệ thống đánh giá & Phê duyệt bệnh nhân nội trú</p>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-1 overflow-hidden p-6 gap-6">

                <div className="w-1/3 max-w-[350px] flex flex-col">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">
                            Bệnh nhân đang điều trị
                        </h3>
                        <span className="bg-sky-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm"> {patients.length} </span>
                    </div>


                    <div className="flex flex-col gap-3 overflow-y-auto pr-3 custom-scrollbar">
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                                    className={`group p-4 rounded-[1.8rem] cursor-pointer transition-all duration-300 relative border ${selectedId === p.id
                                        ? "bg-sky-50 border-sky-200 shadow-md"
                                        : "bg-white border-slate-100 hover:border-sky-100"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className={`font-bold text-base tracking-tight transition-colors ${selectedId === p.id ? "text-cyan-700" : "text-slate-800"
                                                }`}>
                                                {p.ho_ten}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium ${selectedId === p.id ? "text-cyan-700" : "text-slate-800"
                                                    }`}>
                                                    {new Date(p.nam_sinh).toLocaleDateString('vi-VN')} • {p.gioi_tinh}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`text-[11px] px-3 py-1 rounded-xl font-bold tracking-wider transition-all ${selectedId === p.id
                                            ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                                            : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {p.ma_giuong}
                                        </span>
                                    </div>

                                    <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${selectedId === p.id ? "border-slate-800" : "border-slate-50"
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedId === p.id ? "bg-emerald-400" : "bg-emerald-500"}`}></div>
                                        <p className={`text-[11px] font-semibold uppercase tracking-widest ${selectedId === p.id ? "text-cyan-700" : "text-slate-800"
                                            }`}>
                                            {p.ten_khoa}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">Trống danh sách</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: DETAILS AREA */}
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] rounded-[2.5rem] border border-slate-200 shadow-inner flex flex-col">
                    {selectedPatient ? (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <MdPerson size={32} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                                                {selectedPatient.ho_ten}
                                            </h2>
                                            <span className="bg-emerald-50 text-emerald-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-100">
                                                Đang Điều Trị
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                            <span className="flex items-center gap-1"><MdMeetingRoom className="text-indigo-400" /> {selectedPatient.ten_khoa}</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="flex items-center gap-1"><MdKingBed className="text-indigo-400" /> Giường: {selectedPatient.ma_giuong}</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="flex items-center gap-1"><MdFingerprint className="text-indigo-400" /> ID: {selectedPatient.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-right px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày nhập viện</p>
                                        <p className="font-black text-slate-700">{new Date(selectedPatient.thoi_gian_nhap_vien).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-6">

                                    {/* Grid thông số nhanh */}
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { label: 'Năm sinh', value: new Date(selectedPatient.nam_sinh).toLocaleDateString('vi-VN'), icon: <MdCake />, color: 'blue' },
                                            { label: 'Giới tính', value: selectedPatient.gioi_tinh, icon: <MdWc />, color: 'purple' },
                                            { label: 'Nhóm máu', value: selectedPatient.nhom_mau, icon: <MdBloodtype />, color: 'red' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                                                <div className={`text-${item.color}-500 mb-2`}>{item.icon}</div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                                                <p className="font-black text-slate-700">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chẩn đoán & Tiền sử */}
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                                        <section>
                                            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <MdMedicalServices /> Chẩn đoán nhập viện
                                            </h4>
                                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                                                    "{selectedPatient.chan_doan_ban_dau}"
                                                </p>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <MdHistory /> Tiền sử bệnh lý
                                            </h4>
                                            <p className="text-sm text-slate-600 px-1">
                                                "{selectedPatient.benh_su || 'Không có thông tin tiền sử bệnh lý.'}"
                                            </p>
                                        </section>
                                    </div>

                                    {/* Chỉ số sinh tồn (Vitals) */}
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Dấu hiệu sinh tồn (Gần nhất)</h4>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-400">HUYẾT ÁP</span>
                                                <span className="text-lg font-black text-emerald-600">{selectedPatient.huyet_ap || 'N/A'} <small className="text-[10px] text-slate-400">mmHg</small></span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-400">NHỊP TIM</span>
                                                <span className="text-lg font-black text-rose-500">{selectedPatient.nhip_tim || 'N/A'} <small className="text-[10px] text-slate-400">bpm</small></span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-400">NHIỆT ĐỘ</span>
                                                <span className="text-lg font-black text-orange-500">{selectedPatient.nhiet_do || 'N/A'} <small className="text-[10px] text-slate-400">°C</small></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT PHẢI: ĐÁNH GIÁ & LỆNH XUẤT VIỆN */}
                                <div className="space-y-6">
                                    <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden h-full flex flex-col">
                                        <div className="relative z-10">
                                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                                                Đánh giá chuyên môn
                                            </h4>

                                            <div className="space-y-5 mb-8">
                                                {[
                                                    'Chỉ số sinh tồn ổn định',
                                                    'Đã hoàn thành phác đồ điều trị',
                                                    'Kết quả xét nghiệm âm tính',
                                                    'Đủ điều kiện chăm sóc tại nhà'
                                                ].map((text, i) => (
                                                    <div key={i} className="flex items-start gap-3 group">
                                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-0.5 group-hover:bg-indigo-500 transition-colors">
                                                            <MdCheck className="text-xs text-white" />
                                                        </div>
                                                        <span className="text-sm text-slate-300 font-medium leading-tight">{text}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-32">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-4 text-center tracking-widest">Xác nhận y lệnh</p>
                                                <button
                                                    onClick={handleIssueDischargeOrder}
                                                    className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/20 active:scale-[0.98]"
                                                >
                                                    <MdLogout className="text-xl" /> Cho phép xuất viện
                                                </button>
                                            </div>
                                        </div>
                                        {/* Trang trí background */}
                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                                    </section>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                                <MdContactPage className="text-6xl text-slate-100" />
                            </div>
                            <p className="font-black text-slate-400 text-xl tracking-tighter italic">Hồ sơ bệnh án chưa chọn</p>
                            <p className="text-sm text-slate-400 max-w-[240px] text-center mt-2 font-medium">
                                Vui lòng chọn danh sách bên trái để bắt đầu quy trình đánh giá xuất viện.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DoctorDischarge;