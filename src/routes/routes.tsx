import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";

import { AUTH_PATH } from "./path";
import NotAuth from "@/components/routes/NoAuth";
import LoginPage from "@/pages/auth/login";
import JoinUs from "@/pages/joinUs/JoinUs";
import RegisterUser from "@/pages/user/RegisterUser";
import ApplyDriver from "@/pages/driver/ApplyDriver";
import ApplyEmployee from "@/pages/employee/AppleyEmployee";

import ProtectedRoute from "@/components/routes/ProtectedRoute";
import HomePage from "@/pages/home/HomePage";
import ErrorPage from "@/components/error/ErrorPage";
import Drivers from "@/pages/driver/Drivers";
import DriverDashboard from "@/pages/driver/DriverDashboard";
import DriverTips from "@/pages/driver/DriverTips";
import DriverEarning from "@/pages/driver/DriverEarning";
import DriverProfile from "@/pages/driver/DriverProfile";
import Employees from "@/pages/employee/Employes";
import Users from "@/pages/user/Users";
import TripPlanner from "@/pages/trip/NewTrip";
import NavBar from "@/pages/layout/Layout";
import Chat from "@/pages/driver/NOT";
import Profile from "@/pages/global/Profile";
import Roles from "@/pages/global/Roles";
import Trips from "@/pages/global/Trips";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<NotAuth />}>
        <Route path={AUTH_PATH.LOGIN} element={<LoginPage />} />
        <Route path="/joinUs" element={<JoinUs />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/appleyDriver" element={<ApplyDriver />} />
        <Route path="/appleyEmployee" element={<ApplyEmployee />} />
      </Route>

      <Route element={<NavBar />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/drivers" element={<Drivers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/users" element={<Users />} />
          <Route path="/new" element={<Chat />} />

          <Route path="/request-trip" element={<TripPlanner />} />
          <Route path="/current-trip" element={<DriverDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/role" element={<Roles />} />
          <Route path="/trips" element={<Trips />} />

          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </>
  )
);

export default routes;
