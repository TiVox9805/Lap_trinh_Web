import React, { useState } from "react";
import { MdAssignment } from "react-icons/md";
import ActionCard from "./DetailComponents/ActionCard";
import DetailPatients from "./DetailComponents/DetailPatients";

const ManagePatient = () => {
    const [patients] = useState([
        {
            id: "BN001",
            name: "Trần Minh Đức",
            birthYear: 2005,
            gender: "Nam",
            phone: "0912345678",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            insuranceCard: "GD-123456789",
            room: "P301-G1",
            department: "Sản",
            doctorInCharge: "BS. Nguyễn Văn B",
            admittedDate: "2026-04-12",
            initialDiagnosis: "vỡ ối",
            reasonForAdmission: "Đau bụng dữ dội, có dấu hiệu rò rỉ nước ối",
            medicalHistory: "Không có tiền sử dị ứng, chưa có bệnh lý nền mãn tính",
            history: [
                { title: "Khám ban đầu", content: "Bệnh nhân nhập viện với chẩn đoán: vỡ ối", date: "2026-04-12" }
            ]
        }
    ]);

    const [selectedId, setSelectedId] = useState(null);
    const activePatient = patients.find(p => p.id === selectedId);

    return (
        <div className="flex gap-6 h-[calc(100vh-200px)] animate-in fade-in duration-500">
            {/* CỘT TRÁI: DANH SÁCH BỆNH NHÂN */}
            <div className="w-1/4 flex flex-col gap-4">
                <h3 className="font-bold text-slate-800 tracking-tight">
                    Bệnh nhân nội trú ({patients.length})
                </h3>
                <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                    {patients.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                            className={`p-5 rounded-[1.5rem] cursor-pointer transition-all relative ${selectedId === p.id
                                ? "bg-slate-900 text-white shadow-xl scale-[1.02]"
                                : "bg-white border border-gray-100 text-slate-800 hover:border-slate-300"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-lg leading-tight">{p.name}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${selectedId === p.id ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {p.room}
                                </span>
                            </div>
                            <p className={`text-sm ${selectedId === p.id ? "text-slate-400" : "text-gray-500"}`}>
                                {p.birthYear} - {p.gender}
                            </p>
                            <p className={`text-xs mt-1 ${selectedId === p.id ? "text-slate-500" : "text-slate-400"}`}>
                                {p.department}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CỘT PHẢI: CHI TIẾT */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-10 custom-scrollbar">
                {activePatient ? (
                    <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
                        <DetailPatients patients={patients} selectedId={selectedId} />
                        <ActionCard patients={patients} activePatient={activePatient} />
                    </div>
                ) : (
                    /* Màn hình trống khi chưa chọn bệnh nhân */
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white/50 border border-dashed border-gray-200 rounded-[3rem]">
                        <div className="p-6 bg-slate-100 rounded-full mb-4">
                            <MdAssignment size={48} className="opacity-30" />
                        </div>
                        <p className="font-bold text-lg">Hồ sơ bệnh án</p>
                        <p className="text-sm">Chọn một bệnh nhân để xem chi tiết và thực hiện hành động</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePatient;