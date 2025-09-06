import ax from "axios";
// import { toast } from "sonner";
import { AUTH_PATH } from "../routes/path";

export const API_BASE_URL =
  "https://taxi-git-master-ahmad-alnajjars-projects.vercel.app/api";
const axios = ax.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use((config) => {
  const pageNumber = new URLSearchParams(window.location.search).get("page");
  config.headers.Authorization = "Bearer " + localStorage.getItem("token");
  config.headers["Accept-Language"] =
    localStorage.getItem("i18nextLng") ?? "en";

  const requestParams = config.params;
  config.params = {
    ...requestParams,
    PageNumber: requestParams?.PageNumber || pageNumber || undefined,
  };
  return config;
});

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     // error?.response.status != 401 &&
//     //   toast.error(error.response.data.errorMessage);

//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem("refreshToken");

//       try {
//         const { data } = await axios.post(`${API_BASE_URL}auth/refresh`, {
//           refreshToken,
//         });
//         const { token } = data;
//         localStorage.setItem("token", token);
//         localStorage.setItem("refreshToken", data.refreshToken);
//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return axios(originalRequest);
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         localStorage.clear();
//         window.location.href = `${AUTH_PATH.LOGIN}`;
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;
