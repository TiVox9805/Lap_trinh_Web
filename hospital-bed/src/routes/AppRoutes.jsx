import LayoutNurse from "../pages/Nurse/LayoutNurse";
import Overview from "../pages/Components/Overview";
import PatientList from "../pages/Components/Nurse/PatientList";
import ArrangeBed from "../pages/Components/Nurse/ArrangeBed";
import LayoutDoctor from "../pages/Doctor/LayoutDoctor";
import DischargeProcess from "../pages/Components/Doctor/DischargeProcess";
import ManagePatient from "../pages/Components/Doctor/ManagePatient";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Navigate to="/nurse/overview" replace />} />

                <Route path="/nurse" element={<LayoutNurse />}>
                    <Route index element={<Navigate to="overview" replace />} />

                    <Route path="overview" element={<Overview />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="beds" element={<ArrangeBed />} />
                </Route> */}
                <Route path="/doctor" element={<LayoutDoctor />}>
                    <Route index element={<Navigate to="ManagePatient" replace />} />
                    <Route path="DischargeProcess" element={<DischargeProcess />} />
                    <Route path="ManagePatient" element={<ManagePatient />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}
export default AppRoutes;