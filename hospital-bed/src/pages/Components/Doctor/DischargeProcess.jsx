import React, { useState } from "react";
import { MdCheckCircle, MdInfoOutline } from "react-icons/md";

const DischargeProcess = () => {
    // State quản lý danh sách bệnh nhân mẫu
    const [patients, setPatients] = useState([
        { id: "BN001", name: "cdsd", age: 12, gender: "Nam", diagnosis: "sda", status: "treating" },
    ]);

    // State quản lý bệnh nhân đang được chọn để làm checklist
    const [selectedPatient, setSelectedPatient] = useState(null);

    // State quản lý các mục đã check
    const [checkedItems, setCheckedItems] = useState([]);

    const checklistOptions = [
        "Đã uống thuốc đầy đủ",
        "Đã dọn đồ cá nhân",
        "Đã thanh toán viện phí",
        "Đã lấy đơn thuốc về nhà",
        "Đã hẹn tái khám (nếu có)",
    ];

    // Hàm chuyển trạng thái từ "Đang điều trị" sang "Chờ xuất viện"
    const handleMoveToDischarge = (id) => {
        setPatients(patients.map(p =>
            p.id === id ? { ...p, status: "pending" } : p
        ));
    };

    const handleCheck = (item) => {
        if (checkedItems.includes(item)) {
            setCheckedItems(checkedItems.filter(i => i !== item));
        } else {
            setCheckedItems([...checkedItems, item]);
        }
    };

    return (
        <div className="flex gap-8 p-6 animate-in fade-in duration-500">
            {/* CỘT TRÁI: DANH SÁCH BỆNH NHÂN */}
            <div className="flex-1 space-y-8">
                <h2 className="text-xl font-bold text-slate-900">Danh sách Bệnh nhân</h2>

                {/* Nhóm: Đang điều trị */}
                <div>
                    <h3 className="text-md font-bold text-slate-700 mb-4">
                        Đang điều trị ({patients.filter(p => p.status === "treating").length})
                    </h3>
                    <div className="space-y-3">
                        {patients.filter(p => p.status === "treating").map((p) => (
                            <div key={p.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-bold text-slate-800">{p.name}</p>
                                    <p className="text-sm text-gray-400">{p.age} tuổi - {p.gender}</p>
                                    <p className="text-sm text-gray-400">{p.diagnosis}</p>
                                </div>
                                <button
                                    onClick={() => handleMoveToDischarge(p.id)}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all"
                                >
                                    Cho phép xuất viện
                                </button>
                            </div>
                        ))}
                        {patients.filter(p => p.status === "treating").length === 0 && (
                            <div className="p-4 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-sm">
                                Không có bệnh nhân
                            </div>
                        )}
                    </div>
                </div>

                {/* Nhóm: Chờ xuất viện */}
                <div>
                    <h3 className="text-md font-bold text-slate-700 mb-4">
                        Chờ xuất viện ({patients.filter(p => p.status === "pending").length})
                    </h3>
                    <div className="space-y-3">
                        {patients.filter(p => p.status === "pending").map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedPatient?.id === p.id
                                        ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                        : "bg-white border-gray-100 text-slate-800 hover:border-slate-300"
                                    }`}
                            >
                                <p className="font-bold">{p.name}</p>
                                <p className={`text-sm ${selectedPatient?.id === p.id ? "text-slate-300" : "text-gray-400"}`}>
                                    {p.age} tuổi - {p.gender}
                                </p>
                                <p className={`text-sm ${selectedPatient?.id === p.id ? "text-slate-300" : "text-gray-400"}`}>
                                    {p.diagnosis}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: CHECKLIST XUẤT VIỆN */}
            <div className="w-[450px]">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Checklist Xuất viện</h2>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm min-h-[500px] flex flex-col">
                    {selectedPatient ? (
                        <>
                            <div className="mb-6">
                                <p className="text-lg font-bold text-slate-900">Bệnh nhân: {selectedPatient.name}</p>
                                <p className="text-sm text-gray-400">{selectedPatient.age} tuổi - {selectedPatient.gender}</p>
                                <p className="text-sm text-gray-400">{selectedPatient.diagnosis}</p>
                            </div>

                            <hr className="mb-6 border-gray-100" />

                            <div className="space-y-4 flex-1">
                                {checklistOptions.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleCheck(item)}
                                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all"
                                    >
                                        <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${checkedItems.includes(item) ? "bg-slate-900 border-slate-900" : "border-gray-200"
                                            }`}>
                                            {checkedItems.includes(item) && <MdCheckCircle className="text-white text-lg" />}
                                        </div>
                                        <span className={`text-[15px] font-medium ${checkedItems.includes(item) ? "text-slate-900" : "text-slate-500"}`}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                disabled={checkedItems.length < checklistOptions.length}
                                className={`w-full mt-8 py-4 rounded-2xl font-bold transition-all ${checkedItems.length === checklistOptions.length
                                        ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                {checkedItems.length === checklistOptions.length
                                    ? "Xác nhận hoàn tất xuất viện"
                                    : `Cần hoàn thành ${checklistOptions.length - checkedItems.length} mục`}
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                            <MdInfoOutline className="text-5xl opacity-20" />
                            <p className="text-sm px-10">Vui lòng chọn bệnh nhân từ danh sách "Chờ xuất viện" để tiến hành kiểm tra checklist</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DischargeProcess;