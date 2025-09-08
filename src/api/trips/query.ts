import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./api";

const queries = {
  GetDriverTrips: (id: string, page: number, limit: number) =>
    useQuery({
      queryKey: ["driver-trips", id, page, limit],
      queryFn: () => API.getDriverTrips(id, page, limit),
    }),

  GetUserTrips: (id: string, page: number, limit: number) =>
    useQuery({
      queryKey: ["user-trips", id, page, limit],
      queryFn: () => API.getUserTrips(id, page, limit),
    }),
};

export default queries;
