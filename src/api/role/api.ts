import axios from "@/lib/axios";

const API = {
  getAllRole: async () => {
    const { data } = await axios.get("roles");
    return data;
  },

  addRole: async (payload: {
    title: string;
    roles: string[];
    description: string;
  }) => {
    const { data } = await axios.post("roles/add-role", payload);
    return data;
  },

  deleteRole: async (id: string) => {
    const { data } = await axios.delete(`roles/${id}`);
    return data;
  },
};

export default API;
