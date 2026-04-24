import LayoutNurse from "../pages/Nurse/LayoutNurse";
import Overview from "../pages/Components/Overview";
import PatientList from "../pages/Components/Nurse/PatientList";
import ArrangeBed from "../pages/Components/Nurse/ArrangeBed";
import LayoutDoctor from "../pages/Doctor/LayoutDoctor";
import DischargeProcess from "../pages/Components/Doctor/DischargeProcess";
import ManagePatient from "../pages/Components/Doctor/ManagePatient";
import LayoutAdmin from "../pages/Admin/LayoutAdmin";
import AccountsManage from "../pages/Components/Admin/AccountManage";
import Reports from "../pages/Components/Admin/SystemReport";
import LoginLayout from "../pages/Login/LoginLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginLayout />} />
                <Route path="/" element={<Navigate to="/nurse/overview" replace />} />

                <Route path="/nurse" element={<LayoutNurse />}>
                    <Route index element={<Navigate to="overview" replace />} />

                    <Route path="overview" element={<Overview />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="beds" element={<ArrangeBed />} />
                </Route>
                <Route path="/doctor" element={<LayoutDoctor />}>
                    <Route index element={<Navigate to="ManagePatient" replace />} />
                    <Route path="DischargeProcess" element={<DischargeProcess />} />
                    <Route path="ManagePatient" element={<ManagePatient />} />
                </Route>
                <Route path="/admin" element={<LayoutAdmin />}>
                    <Route index element={<Navigate to="accounts" replace />} />
                    <Route path="accounts" element={<AccountsManage />} />
                    <Route path="reports" element={<Reports />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;