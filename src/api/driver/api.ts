import axios from "@/lib/axios";

const API = {
  getAllDriver: async (page: number, limit: number) => {
    const { data } = await axios.get("driver", {
      params: {
        page,
        limit,
      },
    });
    return data;
  },
  approvedDriver: async (id: string) => {
    const { data } = await axios.put(`driver/approve/${id}`);
    return data;
  },
  availablilityDriver: async (id: string, isAvailable: boolean) => {
    console.log({ id, isAvailable });
    const { data } = await axios.post("driver/availablility", {
      id,
      isAvailable: isAvailable.toString(), // "true" أو "false"
    });
    return data;
  },
 
  deleteDriver: async (id: string) => {
    const { data } = await axios.delete(`driver/${id}`);
    return data;
  },
};

export default API;
