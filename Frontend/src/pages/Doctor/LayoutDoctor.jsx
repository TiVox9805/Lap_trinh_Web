import { useState, useEffect } from 'react';
import Navigation from "../Components/Doctor/Navigation";
import Admission from "../Components/Doctor/Admission";
import { Outlet } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci"; // Import thêm icon này

const LayoutDoctor = () => {
    const [isOpenAdmission, setIsOpenAdmission] = useState(false);
    const [doctorName, setDoctorName] = useState('Bác sĩ');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.fullname) setDoctorName(user.fullname);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-san">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 leading-tight">
                        Quản lý Bệnh nhân Nội trú - Bác sĩ
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">
                        Hệ thống quản lý giường bệnh và hồ sơ điều trị
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Nút Nhập viện dành cho Bác sĩ */}
                    <button
                        type='button'
                        className='flex items-center py-2.5 px-6 text-sm bg-indigo-600 text-white rounded-full cursor-pointer font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:bg-indigo-700 active:scale-95'
                        onClick={() => setIsOpenAdmission(true)}
                    >
                        <CiCirclePlus className="text-2xl mr-2" />
                        Nhập viện
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200"></div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Bác sĩ</p>
                            <p className="text-sm font-bold text-slate-900">Hi, {doctorName}</p>
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
            </div>

            {/* Modal Admission sẽ hiện ra khi state isOpenAdmission là true */}
            <Admission
                isOpen={isOpenAdmission}
                onClose={() => setIsOpenAdmission(false)}
            />

            <Navigation />

            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutDoctor;