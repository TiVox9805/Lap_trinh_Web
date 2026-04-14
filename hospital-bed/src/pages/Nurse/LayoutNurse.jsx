import { useState } from "react";
import Navigation from "../Components/Nurse/Navigation";
import Admission from "../Components/Nurse/Admission";
import { CiCirclePlus } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { Outlet } from "react-router-dom";
const LayoutNurse = () => {
    const [isOpenAdmission, setIsOpenAdmission] = useState(false);


    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-san">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 leading-tight">
                        Quản lý Bệnh nhân Nội trú - Y tá
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">
                        Hệ thống quản lý giường bệnh và theo dõi diễn biến
                    </p>
                </div>

                <div className="h-8 w-[1px] bg-slate-200"></div>
                <div className="flex items-center gap-3">
                    <button type='button' className='py-2.5 px-6 text-sm bg-indigo-500 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-700' onClick={() => setIsOpenAdmission(true)}>
                        <CiCirclePlus className="inline mr-2 text-2xl top-50px" />
                        Nhập viện
                    </button>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Nurse</p>
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
            <Admission
                isOpen={isOpenAdmission} // Truyền state mở
                onClose={() => setIsOpenAdmission(false)} // Truyền hàm đóng
            />
            <Navigation />

            <div className="mt-4">
                <Outlet /> {/* Nội dung con sẽ hiển thị ở đây */}
            </div>


        </div>
    );
};

export default LayoutNurse;