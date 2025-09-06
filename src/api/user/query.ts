import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./api";

const queries = {
  GetAllUsers: (page: number, limit: number) =>
    useQuery({
      queryKey: ["users", page, limit],
      queryFn: () => API.getAllUsers(page, limit),
    }),
  GetUsers: (id: string) =>
    useQuery({
      queryKey: ["users", id],
      queryFn: () => API.getUserId(id),
    }),
  GetDriver: (id: string) =>
    useQuery({
      queryKey: ["driver", id],
      queryFn: () => API.getDriver(id),
    }),
  GetEmp: (id: string) =>
    useQuery({
      queryKey: ["emp", id],
      queryFn: () => API.getEmp(id),
    }),
};

export default queries;
