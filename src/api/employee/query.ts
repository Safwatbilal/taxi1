import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./api";

const queries = {
  GetAllEmployees: (page: number, limit: number) =>
    useQuery({
      queryKey: ["employees", page, limit],
      queryFn: () => API.getAllEmployees(page, limit),
    }),

  ApproveEmployees: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => API.approvedemployees(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
      },
    });
  },

  DeletedEmployees: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => API.deleteEmployees(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
      },
    });
  },
};

export default queries;
