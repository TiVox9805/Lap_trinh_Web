import { MdExpandMore } from "react-icons/md";
import { useState, useEffect } from "react";

const Admission = ({ isOpen, onClose, onRefresh }) => {
    const [departments, setDepartments] = useState([]);

    // Lấy thông tin user ngay khi component render
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : {};

    const [formData, setFormData] = useState({
        ho_ten: '',
        nam_sinh: '',
        gioi_tinh: '',
        so_dien_thoai: '',
        dia_chi: '',
        so_bhyt: '',
        khoa_id: '',
        bac_si_id: userData.id || '', // Gán ID bác sĩ đang đăng nhập
        chan_doan: '',
        ly_do: '',
        benh_su: '',
    });

    useEffect(() => {
        if (isOpen) {
            const fetchDepartments = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/departments');
                    if (res.ok) setDepartments(await res.json());
                } catch (error) {
                    console.error("Lỗi lấy khoa:", error);
                }
            };
            fetchDepartments();

            // Đảm bảo ID bác sĩ luôn được gán khi mở modal
            if (userData.id) {
                setFormData(prev => ({ ...prev, bac_si_id: userData.id }));
            }
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirm = async (e) => {
        e.preventDefault();

        // CHUẨN HÓA DỮ LIỆU TRƯỚC KHI GỬI
        const dataToSend = {
            ...formData,
            // Ép kiểu ID sang Number để khớp với kiểu dữ liệu Integer trong Database
            khoa_id: parseInt(formData.khoa_id),
            bac_si_id: parseInt(userData.id),
            nam_sinh: parseInt(formData.nam_sinh)
        };

        // Kiểm tra logic trước khi gửi
        if (!dataToSend.ho_ten || !dataToSend.khoa_id || !dataToSend.bac_si_id || !dataToSend.chan_doan) {
            console.error("Dữ liệu thiếu:", dataToSend);
            return alert("Vui lòng điền đầy đủ: Họ tên, Khoa và Chẩn đoán!");
        }

        try {
            const response = await fetch('http://localhost:5000/api/admission/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend) // Gửi data đã chuẩn hóa
            });

            const result = await response.json();

            if (response.ok) {
                alert("Đã tạo hồ sơ bệnh nhân thành công!");
                setFormData({
                    ho_ten: '', nam_sinh: '', gioi_tinh: '', so_dien_thoai: '',
                    dia_chi: '', so_bhyt: '', khoa_id: '',
                    bac_si_id: userData.id || '',
                    chan_doan: '', ly_do: '', benh_su: ''
                });
                onClose();
                if (onRefresh) onRefresh();
            } else {
                // Hiển thị lỗi chi tiết từ Backend trả về
                alert("Lỗi từ hệ thống: " + (result.message || "Không xác định"));
            }
        } catch (error) {
            console.error("Lỗi fetch:", error);
            alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra Backend!");
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full bg-[#f1f5f9] border border-gray-100 rounded-xl px-5 py-3 text-slate-800 text-[15px] focus:ring-2 focus:ring-slate-300 focus:outline-none transition-all placeholder:text-gray-400";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[1.2rem] shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-10 relative animate-in zoom-in-95 duration-300">

                <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6 -mx-4 px-4">
                    <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Nhập viện bệnh nhân mới</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-slate-900 transition text-3xl p-2 rounded-full hover:bg-slate-100">&times;</button>
                </div>

                <form onSubmit={handleConfirm} className="flex flex-col gap-10">
                    {/* Phần 1: Thông tin cá nhân */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Thông tin cá nhân</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                                <input name="ho_ten" value={formData.ho_ten} onChange={handleChange} type="text" placeholder="Nguyễn Văn A" className={inputClass} required />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Năm sinh <span className="text-red-500">*</span></label>
                                <input name="nam_sinh" value={formData.nam_sinh} onChange={handleChange} type="number" placeholder="YYYY" className={inputClass} required />
                            </div>

                            <div className="col-span-1 relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Giới tính <span className="text-red-500">*</span></label>
                                <select name="gioi_tinh" value={formData.gioi_tinh} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} required>
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                                <div className="absolute right-5 top-[46px] text-gray-400 text-xl pointer-events-none"><MdExpandMore /></div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                                <input name="so_dien_thoai" value={formData.so_dien_thoai} onChange={handleChange} type="tel" className={inputClass} />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ</label>
                                <input name="dia_chi" value={formData.dia_chi} onChange={handleChange} type="text" className={inputClass} />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Số BHYT</label>
                                <input name="so_bhyt" value={formData.so_bhyt} onChange={handleChange} type="text" className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Phần 2: Thông tin y tế */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight border-t border-gray-100 pt-8 -mx-4 px-4">Thông tin y tế</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="col-span-1 relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Khoa điều trị <span className="text-red-500">*</span></label>
                                <select name="khoa_id" value={formData.khoa_id} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} required>
                                    <option value="">-- Chọn khoa --</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.ten_khoa}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-[46px] text-gray-400 text-xl pointer-events-none"><MdExpandMore /></div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bác sĩ phụ trách</label>
                                <input
                                    type="text"
                                    value={userData.fullname || "Đang đăng nhập..."}
                                    disabled
                                    className="w-full bg-slate-100 border border-gray-200 rounded-xl px-5 py-3 text-slate-500 font-medium"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Chẩn đoán ban đầu <span className="text-red-500">*</span></label>
                                <input name="chan_doan" value={formData.chan_doan} onChange={handleChange} type="text" className={inputClass} required />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Lý do nhập viện</label>
                                <textarea name="ly_do" value={formData.ly_do} onChange={handleChange} rows="2" className={`${inputClass} resize-none`}></textarea>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bệnh sử</label>
                                <textarea name="benh_su" value={formData.benh_su} onChange={handleChange} rows="2" className={`${inputClass} resize-none`}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-12 border-t border-gray-100 pt-8 -mx-4 px-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 transition">Hủy</button>
                        <button type="submit" className="px-8 py-3 rounded-2xl bg-[#0f172a] text-white font-bold hover:bg-slate-800 transition shadow-lg">Nhập viện</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Admission;