import { MdClose, MdAdd } from 'react-icons/md';
const NoteProressCard = ({ isOpen, onClose, patientName }) => {
    if (!isOpen) return null;
    return (

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Theo dõi diễn biến - {patientName}</h2>
                        <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase">Ngoại Tổng Hợp</span>
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold rounded-full uppercase">Chờ xếp giường</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <MdClose size={24} />
                    </button>
                </div>

                {/* Nội dung diễn biến */}
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Theo dõi hàng ngày</h3>
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
                            <MdAdd size={18} /> Thêm diễn biến
                        </button>
                    </div>

                    {/* Form thêm mới giống image_481706.png */}
                    <div className="p-6 border border-slate-200 rounded-2xl space-y-4">
                        <p className="font-bold text-sm text-slate-800">Thêm diễn biến mới</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Ngày</label>
                                <input type="text" defaultValue="04/14/2026" className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Bác sĩ</label>
                                <input type="text" defaultValue="vỗ ti" className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                            </div>
                        </div>
                        {/* Các chỉ số: Mạch, Huyết áp... */}
                        <div className="grid grid-cols-4 gap-4">
                            {['Mạch (lần/phút)', 'Huyết áp (mmHg)', 'Nhiệt độ (°C)', 'Nhịp thở (lần/phút)'].map((label, idx) => (
                                <div key={idx} className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 leading-tight block">{label}</label>
                                    <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Diễn biến</label>
                            <textarea placeholder="Mô tả tình trạng bệnh nhân..." className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm h-20 focus:outline-none resize-none"></textarea>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Hủy</button>
                            <button className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-lg shadow-lg">Lưu diễn biến</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoteProressCard;