import axios from "axios";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL;

// --- LOGIN ---
export const login = async (data) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/authenticate`, data, {
            withCredentials: true
        });
        const { userId } = response.data;
        localStorage.setItem("user", JSON.stringify({ userId }));
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Đăng nhập thất bại");
        throw error;
    }
};

// --- REGISTER ---
export const register = async (userData) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data.errors;
    }
};

// --- GET PROFILE ---
export const getYourProfile = async () => {
    try {
        const response = await axiosClient.get(`get-profile`);
        return response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
};

// --- UPDATE PASSWORD ---
export const updatePasswordUser = async (userData) => {
    try {
        const userId = JSON.parse(localStorage.getItem("user"))?.userId;
        const response = await axiosClient.put(`update-password/${userId}`, userData);
        return response.data;
    } catch (err) {
        throw err.response.data.errors;
    }
};

// --- CHECK EMAIL ---
export const checkEmail = async (data) => {
    try {
        const resp = await axiosClient.post(`check-email`, data);
        return resp.data;
    } catch (err) {
        throw err.response.data.errors;
    }
};

// --- FORGOT PASSWORD ---
export const forgotPassword = async (data) => {
    try {
        const resp = await axiosClient.post(`forgot-password`, data);
        return resp.data;
    } catch (err) {
        throw err.response.data.errors;
    }
};

// --- LOGOUT ---
export const logout = async () => {
    try {
        const userId = JSON.parse(localStorage.getItem("user"))?.userId;
        await axiosClient.post(`/logout?userId=${userId}`);
        localStorage.removeItem("user");
        window.location.href = "/";
    } catch (e) {
        console.error(e);
    }
};

// --- CHECK AUTH ---
export const isAuthenticated = () => {
    return !!JSON.parse(localStorage.getItem("user"));
};

// --- GET ROLE ---
export const getRoles = async () => {
    try {
        const resp = await axiosClient.get(`/user-role`);
        return resp.data;
    } catch (e) {
        return [];
    }
};

export const isAdmin = async () => {
    const roles = await getRoles();
    return roles.some(role => role.roleName === 'ROLE_ADMIN');
};

export const isAssistant = async () => {
    const roles = await getRoles();
    return roles.some(role => role.roleName === 'ROLE_ASSISTANT');
};

export const isListener = async () => {
    const roles = await getRoles();
    return roles.some(role => role.roleName === 'ROLE_LISTENER');
};
