import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
    baseURL: `${apiUrl}/api/auth`,  // Ví dụ: https://api.music-streaming-website.blog/api/auth
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            config.headers.Userid = user.userId; // BE yêu cầu header này để xử lý rft
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem("user");
            window.location.href = "/login";
        } else if (err.code === "ERR_NETWORK") {
            toast.error("Không thể kết nối đến máy chủ!");
        }
        return Promise.reject(err);
    }
);

export default axiosClient;
