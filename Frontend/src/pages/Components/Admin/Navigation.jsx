import { NavLink } from "react-router-dom";
import { MdDashboard, MdManageAccounts, MdBarChart, MdLogout } from "react-icons/md";

const Navigation = () => {
    const tabs = [
        { id: "accounts", label: "Quản lý Tài khoản", icon: <MdManageAccounts size={20} /> },
        { id: "reports", label: "Báo cáo Hệ thống", icon: <MdBarChart size={20} /> },

    ];

    return (
        <nav className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-[1.5rem] border border-slate-200/50 shadow-sm mb-10">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.id}
                    to={`/admin/${tab.id}`}
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
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;