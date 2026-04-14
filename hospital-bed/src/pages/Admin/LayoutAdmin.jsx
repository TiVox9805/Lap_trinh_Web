import Navigation from "../Components/Admin/Navigation";
import { Outlet } from "react-router-dom";
import { MdLogout } from "react-icons/md";
const LayoutAdmin = () => {

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-san">
            <div className="flex justify-between items-center mb-6">

                <div className="mb-6">
                    <h1 className="text-[28px] font-bold text-slate-900 leading-tight">
                        Quản lý Bệnh nhân Nội trú - Admin
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">
                        Hệ thống quản lý giường bệnh và theo dõi diễn biến
                    </p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin</p>
                        <p className="text-sm font-bold text-slate-900">Hi, Minh Đức</p>
                    </div>
                    <button
                        onClick={() => console.log("Logout clicked")}
                        className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 group"
                        title="Đăng xuất"
                    >
                        <MdLogout size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
            <Navigation />

            <div className="mt-4">
                <Outlet /> {

                }
            </div>
        </div>
    );
}
export default LayoutAdmin;