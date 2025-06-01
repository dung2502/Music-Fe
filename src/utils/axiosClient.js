import axios from 'axios';
import {toast} from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL: `${apiUrl}/api/auth`,
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        config.headers.userId = user?.userId;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Lỗi 401: Unauthorized');
      // localStorage.removeItem('user');
      // toast.warning("Đã hết phiên đăng nhập");
      // setTimeout(() => {
      //   window.location.href = '/login';
      // }, 3000);
    }else if(error.code === "ERR_NETWORK"){
      toast.error("Máy chủ đang gặp sự cố !");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;