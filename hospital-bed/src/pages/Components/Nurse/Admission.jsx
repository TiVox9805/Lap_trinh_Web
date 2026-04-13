import { MdExpandMore } from "react-icons/md";

const Admission = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const Label = ({ children, required }) => (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );

    const inputClass =
        "w-full bg-[#f1f5f9] border border-gray-100 rounded-xl px-5 py-3 text-slate-800 text-[15px] focus:ring-2 focus:ring-slate-300 focus:outline-none transition-all placeholder:text-gray-400";

    return (
        // Phần nền mờ bên ngoài
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">

            {/* Khung Modal chính */}
            <div className="bg-white rounded-[1.2rem] shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-10 relative animate-in zoom-in-95 duration-300">

                {/* Header & Nút đóng (X) */}
                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6 -mx-4 px-4">
                    <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Nhập viện bệnh nhân mới
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-slate-900 transition text-3xl p-2 rounded-full hover:bg-slate-100">
                        &times;
                    </button>
                </div>

                {/* Nội dung Modal (Form) */}
                <div className="flex flex-col gap-10">


                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
                            Thông tin cá nhân
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            <div className="col-span-1">
                                <label required>Họ và tên</label>
                                <input type="text" placeholder="Ví dụ: Nguyễn Văn A" className={inputClass} />
                            </div>

                            <div className="col-span-1">
                                <label required>Năm sinh</label>
                                <input type="number" placeholder="YYYY" className={inputClass} />
                            </div>

                            <div className="col-span-1 relative">
                                <label required>Giới tính</label>
                                <select className={`${inputClass} appearance-none cursor-pointer`}>
                                    <option>Chọn giới tính</option>
                                    <option>Nam</option>
                                    <option>Nữ</option>
                                    <option>Khác</option>
                                </select>

                                <div className="absolute right-5 top-1/2  flex items-center pointer-events-none text-gray-400 text-xl"><MdExpandMore /></div>
                            </div>

                            <div className="col-span-1">
                                <label>Số điện thoại</label>
                                <input type="tel" placeholder="Ví dụ: 0912345xxx" className={inputClass} />
                            </div>

                            <div className="col-span-2">
                                <label>Địa chỉ</label  >
                                <input type="text" placeholder="Số nhà, tên đường, phường/xã, quận/huyện" className={inputClass} />
                            </div>

                            <div className="col-span-2 relative">
                                <label>Số BHYT</label>
                                <input type="text" placeholder="Ví dụ: GD-xxx" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* --- Phần 2: Thông tin y tế --- */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight border-t border-gray-100 pt-8 -mx-4 px-4">
                            Thông tin y tế
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                            <div className="col-span-1 relative">
                                <label required>Khoa điều trị</label>
                                <select className={`${inputClass} appearance-none cursor-pointer`}>
                                    <option>Chọn khoa</option>
                                    <option>Nội Tim Mạch</option>
                                    <option>Ngoại Tổng Hợp</option>
                                </select>
                                <div className="absolute right-5 top-1/2  flex items-center pointer-events-none text-gray-400 text-xl"><MdExpandMore /></div>
                            </div>

                            <div className="col-span-1 relative">
                                <label required>Bác sĩ phụ trách</label>
                                <select className={`${inputClass} appearance-none cursor-pointer`}>
                                    <option>Chọn bác sĩ</option>
                                    <option>BS. Nguyễn Văn B</option>
                                    <option>BS. Trần Thị C</option>
                                </select>
                                <div className="absolute right-5 top-1/2  flex items-center pointer-events-none text-gray-400 text-xl"><MdExpandMore /></div>
                            </div>

                            <div className="col-span-2 relative">
                                <label required>Chẩn đoán ban đầu</label>
                                <input type="text" placeholder="Triệu chứng chính, nghi vấn" className={inputClass} />
                            </div>

                            <div className="col-span-2 relative">
                                <label>Lý do nhập viện</label>
                                <textarea rows="3" placeholder="Ghi chú thêm" className={`${inputClass} resize-none`}></textarea>
                            </div>

                            <div className="col-span-2 relative">
                                <label>Bệnh sử</label>
                                <textarea rows="3" placeholder="Ghi chú thêm về tiền sử bệnh" className={`${inputClass} resize-none`}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Phần Footer: Các nút bấm --- */}
                <div className="flex justify-end gap-3 mt-12 border-t border-gray-100 pt-8 -mx-4 px-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => { alert("Đã nhập viện thành công!"); onClose(); }}
                        className="px-8 py-3 rounded-2xl bg-[#0f172a] text-white font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-95"
                    >
                        Nhập viện
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Admission;