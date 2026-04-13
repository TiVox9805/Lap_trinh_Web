import { NavLink } from "react-router-dom";
import { MdDashboard, MdPeople, MdHotel, MdDescription } from "react-icons/md";

const Navigation = () => {
    const tabs = [
        { id: "ManagePatient", label: "Bệnh nhân (1)", icon: <MdPeople size={20} /> },
        { id: "DischargeProcess", label: "Quy trình xuất viện", icon: <MdDescription size={20} /> },

    ];

    return (
        <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex gap-1 mb-10 border border-slate-100">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.id}
                    to={`/doctor/${tab.id}`}
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                            ? "bg-white text-slate-900 shadow-sm shadow-slate-200 border border-slate-50"
                            : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                        }`
                    }
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;