import { NavLink } from "react-router-dom";
import { MdDashboard, MdPeople, MdHotel, MdDescription } from "react-icons/md";
import { useEffect, useState, useMemo } from "react";
const Navigation = () => {
    const tabs = [
        { id: "overview", label: "Tổng quan", icon: <MdDashboard size={20} /> },
        { id: "patients", label: "Bệnh nhân", icon: <MdPeople size={20} /> },
        { id: "beds", label: "Giường bệnh", icon: <MdHotel size={20} /> },
        { id: "DischargeProcessNurse", label: "Quy trình xuất viện", icon: <MdDescription size={20} /> },

    ];
    const [counts, setCounts] = useState(0);
    const userObj = useMemo(() => {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }, []);
    const fetchPendingActions = async () => {
        if (!userObj?.id) return;
        try {
            const response = await fetch(`http://localhost:5000/api/nurse/pending-actions/${userObj.id}`);
            if (response.ok) {
                const data = await response.json();
                setCounts(data);
            } else {
                console.error("Lỗi phản hồi từ server", response.status);
            }
        } catch (error) {
            console.error("Lỗi lấy thông báo", error);
        }
    };
    useEffect(() => {
        fetchPendingActions();
        const interval = setInterval(fetchPendingActions, 30000);
        return () => clearInterval(interval);
    }, [userObj?.id]);
    return (
        <nav className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-[1.5rem] border border-slate-200/50 shadow-sm mb-10">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.id}
                    to={`/nurse/${tab.id}`}
                    className={({ isActive }) => `
                        relative flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 group
                        ${isActive
                            ? "bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100"
                            : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                        }
                    `}
                >
                    <span className="text-[20px] transition-transform duration-300 group-hover:scale-110">
                        {tab.icon}
                    </span>
                    <span className="relative z-10">{tab.label}</span>

                    {/* Hiển thị Badge thông báo cho tab Bệnh nhân nếu có y lệnh chờ */}
                    {tab.id === "patients" && counts > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            {/* Hiệu ứng sóng nháy để cảnh báo có việc mới */}
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-[10px] text-white items-center justify-center font-black border-2 border-white">
                                {counts > 9 ? "9+" : counts}
                            </span>
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;