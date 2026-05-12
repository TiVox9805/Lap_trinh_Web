import { useNavigate } from "react-router-dom";
const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            sessionStorage.clear();
            navigate('/login', { replace: true });
        }
    }
    return logout;
};
export default useLogout;
