import axiosInstance from "../../utils/axiosClient";
import axiosClient from "../../utils/axiosClient";

export const getAllUsers = async () => {
    try {
        const temp
            = await axiosClient.get(`users/findAll`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getListAdminUsers = async () => {
    try {
        const response = await axiosClient.get('/users/list-admin');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách admin:", error);
        return [];
    }
};



export const getAllCustomer = async (fullName, page) => {
    try {
        const temp = await axiosClient.get(`users/customer?fullName=${fullName}&page=${page-1}`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}



export const getAllEmployee = async (searchContent, page) => {
    try {
        const temp = await axiosInstance.get(`/users/employees?userCode=${searchContent}` +
            `&fullName=${searchContent}&page=${page}`);
        return temp.data;
    } catch (e) {
        throw e.response.data;
    }
}

export const getUserById = async (userId) => {
    try {
        const temp = await axiosClient.get(`/users/${userId}`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const saveUser = async (employee) => {
    try {
        const temp = await axiosInstance.post(`/users`, employee)
        return temp.data;
    }catch (e) {
        console.log(e)
        throw e.response.data;
    }
}

export const updateUser = async (user) => {
    const token = localStorage.getItem('token');
    return axiosInstance.put(`/users/update/${user.userId}`,
        user,{
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );
};

export const deleteUser = async (userId) => {
    try {
        const temp = await axiosInstance.delete(`/users/${userId}`);
        return temp.data;
    } catch (e) {
        throw e.response.data.errors;
    }
}

export const disableUser = async (userId) => {
    try {
        const temp = await axiosInstance.put(`/users/disable/${userId}`);
        return temp.data;
    } catch (e) {
        throw e.response.data.errors;
    }
}

export const enableUser = async (userId) => {
    try {
        const temp = await axiosInstance.put(`/users/enable/${userId}`);
        return temp.data;
    } catch (e) {
        throw e.response.data.errors;
    }
}