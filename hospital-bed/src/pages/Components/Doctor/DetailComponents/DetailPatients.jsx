import React from "react";
import { MdPerson, MdLocalHospital, MdHistory } from "react-icons/md";

const DetailPatients = (props) => {
    const { patients, selectedId } = props;

    const activePatient = patients.find((p) => p.id === selectedId);

    // Nếu không tìm thấy bệnh nhân (phòng trường hợp lỗi dữ liệu)
    if (!activePatient) return null;

    return (
        <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
            {/* 1. Thông tin cá nhân */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-900 text-white rounded-2xl">
                            <MdPerson size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Thông tin cá nhân</h2>
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-widest">
                        Đang điều trị
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Họ và tên" value={activePatient.name} />
                    <InfoItem label="Năm sinh" value={activePatient.birthYear} />
                    <InfoItem label="Giới tính" value={activePatient.gender} />
                    <InfoItem label="Số điện thoại" value={activePatient.phone} />
                    <InfoItem label="Số BHYT" value={activePatient.insuranceCard} />
                    <InfoItem label="Địa chỉ" value={activePatient.address} fullWidth />
                </div>
            </div>

            {/* 2. Thông tin y tế nhập viện */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl">
                        <MdLocalHospital size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Thông tin y tế ban đầu</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem label="Khoa điều trị" value={activePatient.department} highlight />
                    <InfoItem label="Bác sĩ phụ trách" value={activePatient.doctorInCharge} highlight />
                    <div className="col-span-2 space-y-4">
                        <InfoBox label="Chẩn đoán ban đầu" value={activePatient.initialDiagnosis} color="bg-blue-50" />
                        <InfoBox label="Lý do nhập viện" value={activePatient.reasonForAdmission} />
                        <InfoBox label="Bệnh sử" value={activePatient.medicalHistory} />
                    </div>
                </div>
            </div>

            {/* 3. Diễn biến điều trị */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                        <MdHistory size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Diễn biến điều trị</h2>
                </div>

                <div className="space-y-4">
                    {activePatient.history.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-slate-800 uppercase text-[11px] tracking-widest">{item.title}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{item.date}</p>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                        </div>
                    ))}
                    <div className="border-2 border-dashed border-slate-50 rounded-2xl p-6 text-center text-slate-400 text-sm italic font-medium">
                        Chưa có diễn biến mới
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Bạn cần giữ các Component phụ này ở trong file hoặc export/import chúng ---
const InfoItem = ({ label, value, fullWidth = false, highlight = false }) => (
    <div className={`${fullWidth ? "md:col-span-3" : "col-span-1"}`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">{label}</p>
        <p className={`font-semibold text-sm ${highlight ? "text-blue-600" : "text-slate-800"}`}>
            {value || "---"}
        </p>
    </div>
);

const InfoBox = ({ label, value, color = "bg-slate-50" }) => (
    <div className={`${color} p-5 rounded-2xl border border-gray-50/50 shadow-inner`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{label}</p>
        <p className="text-slate-700 text-sm leading-relaxed font-medium">
            {value || "Chưa có dữ liệu"}
        </p>
    </div>
);

export default DetailPatients;