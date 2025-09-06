import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./api";

const queries = {
  GetAllRole: () =>
    useQuery({
      queryKey: ["roles"],
      queryFn: API.getAllRole,
    }),

  AddRole: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (payload: {
        title: string;
        roles: string[];
        description: string;
      }) => API.addRole(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      },
    });
  },

  DeleteRole: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => API.deleteRole(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      },
    });
  },
};

export default queries;
