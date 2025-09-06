import axios from "@/lib/axios";
import type { LoginBody } from "./type";

const API = {
  login: async (body: LoginBody) => {
    const { data } = await axios.post("auth/login", body);
    return data;
  },
  registerUser: async (body: any) => {
    const { data } = await axios.post("auth/register", body);
    return data;
  },
  appleyDriver: async (body: any) => {
    const { data } = await axios.post("driver/apply", body);
    return data;
  },
  appleyEmployee: async (body: any) => {
    const { data } = await axios.post("employees/apply", body);
    return data;
  },
};

export default API;
