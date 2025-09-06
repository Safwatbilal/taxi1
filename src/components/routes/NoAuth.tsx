import { Navigate, Outlet } from "react-router-dom";
import { AUTH_PATH } from "@/routes/path";

const NotAuth = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default NotAuth;
