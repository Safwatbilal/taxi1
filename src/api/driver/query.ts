import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./api";

const queries = {
  GetAllDriver: (page: number, limit: number) =>
    useQuery({
      queryKey: ["drivers", page, limit],
      queryFn: () => API.getAllDriver(page, limit),
    }),
  ApproveDriver: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => API.approvedDriver(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
      },
    });
  },
  AvailablilityDriver: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
        API.availablilityDriver(id, isAvailable),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
      },
    });
  },
  DeletedDriver: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => API.deleteDriver(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
      },
    });
  },
    // GetDriverAvailability: (id:number) =>
    // useQuery({
    //   queryKey: ["drivers", id],
    //   queryFn: () => API.getAllDriver(page, limit),
    // }),
};

export default queries;
