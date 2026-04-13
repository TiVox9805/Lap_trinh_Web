import Navigation from "../Components/Doctor/Navigation";
import { Outlet } from "react-router-dom";
const LayoutDoctor = () => {
    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-san">
            <div className="mb-6">
                <h1 className="text-[28px] font-bold text-slate-900 leading-tight">
                    Quản lý Bệnh nhân Nội trú
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-0.5">
                    Hệ thống quản lý giường bệnh và theo dõi diễn biến
                </p>

            </div>
            <Navigation />

            <div className="mt-4">
                <Outlet /> {/* Nội dung con sẽ hiển thị ở đây */}
            </div>
        </div>
    );
};
export default LayoutDoctor;