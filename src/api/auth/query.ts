import { useMutation } from "@tanstack/react-query";
import API from "./api";

const queries = {
  Login: () => useMutation({ mutationFn: API.login }),
  RegisterUser: () => useMutation({ mutationFn: API.registerUser }),
  AppleyDriver: () => useMutation({ mutationFn: API.appleyDriver }),
  AppleyEmployee: () => useMutation({ mutationFn: API.appleyEmployee }),
};
export default queries;
