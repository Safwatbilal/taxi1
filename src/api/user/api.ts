import axios from "@/lib/axios";

const API = {
  getAllUsers: async (page: number, limit: number) => {
    const { data } = await axios.get("users", {
      params: {
        page,
        limit,
      },
    });
    return data;
  },
  getUserId: async (id: string) => {
    const { data } = await axios.get(`users/${id}`);
    return data;
  },
  getDriver: async (id: string) => {
    const { data } = await axios.get(`driver/${id}`);
    return data;
  },
  getEmp: async (id: string) => {
    const { data } = await axios.get(`employees/${id}`);
    return data;
  },
};

export default API;
