import axios from "axios";
import axiosClient from "../../utils/axiosClient";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

export const login = async (data) => {
    try {
        const response = await axios.post(`${baseURL}/api/auth/authenticate`, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return error;
    }
}

export const register = async (userData) => {
    try{
        const response = await axios.post(`${baseURL}/api/auth/register`, userData)
        return response.data;
    }catch(error){
        throw error.response.data.errors;
    }
}

export const getYourProfile = async () => {
    try{
        const response = await axiosClient.get(`get-profile`);
        console.log(response.data)
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const updatePasswordUser = async (userData, token) => {
    try{
        const userId = localStorage.getItem("id");
        const response = await axiosClient.put(`update-password/${userId}`, userData);
        return response.data;
    }catch(err){
        console.log(err)
        err.message = "Cập nhật mật khẩu thất bại!"
        throw err.response.data.errors;
    }
}

export const checkEmail = async (data) => {
    try {
        const resp = await axiosClient.post(`check-email`, data);
        return resp.data;
    } catch (err) {
        console.log(err)
        err.message = "Kiểm tra email khẩu thất bại!"
        throw err.response.data.errors;
    }
}

export const forgotPassword = async (data) => {
    try {
        const resp = await axiosClient.post(`forgot-password`, data);
        console.log(data);
        return resp.data;
    } catch (err) {
        console.log(err)
        err.message = "Đổi mật khẩu thất bại!"
        throw err.response.data.errors;
    }
}

/**AUTHENTICATION CHECKER */
export const logout = async() => {
    try {
        const userId = JSON.parse(localStorage.getItem("user")).userId || JSON.parse(localStorage.getItem("user")).uid ;
        await axios.post(`${baseURL}/api/auth/logout?userId=${userId}`);
        localStorage.removeItem("user");
        window.location.href = "/";
    } catch (e) {
        throw e;
    }
}

export const isAuthenticated = () =>{
    const user=JSON.parse(localStorage.getItem("user"));
    const token=user?.token;
    return !!token
}

export const getRoles = async () => {
    try {
        const response = await axiosClient.get(`${baseURL}/api/auth/user-role`)
        return response.data;
    } catch (e) {
        return [];
    }
}
export const isAdmin = async() =>{
    const roles = await getRoles();
    return roles.some(role => role.roleName === 'ROLE_ADMIN');

}

export const isAssistant = async() =>{
    const roles = await getRoles();
    return roles.some(role => role.roleName === 'ROLE_ASSISTANT');

}

export const isListener = async() =>{
    const roles = await getRoles();
    return roles.some(role => role.roleName === 'ROLE_LISTENER');

}

export const adminOnly = () =>{
    return this.isAuthenticated() && this.isAdmin();
}