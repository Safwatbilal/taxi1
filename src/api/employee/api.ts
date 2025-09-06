import axios from "@/lib/axios";

const API = {
  getAllEmployees: async (page: number, limit: number) => {
    const { data } = await axios.get("employees", {
      params: {
        page,
        limit,
      },
    });
    return data;
  },
  approvedemployees: async (id: string) => {
    const { data } = await axios.put(`employees/approve/${id}`);
    return data;
  },

  deleteEmployees: async (id: string) => {
    const { data } = await axios.delete(`employees/${id}`);
    return data;
  },
};

export default API;
