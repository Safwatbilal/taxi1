import axios from "@/lib/axios";

const API = {
  getDriverTrips: async (id: string, page: number, limit: number) => {
    const { data } = await axios.get(`driver/trips/${id}`, {
      params: { page, limit },
    });
    return data;
  },

  getUserTrips: async (id: string, page: number, limit: number) => {
    const { data } = await axios.get(`users/trips/${id}`, {
      params: { page, limit },
    });
    return data;
  },
};

export default API;
