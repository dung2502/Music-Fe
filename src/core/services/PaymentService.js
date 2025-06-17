import axios from "axios";
import axiosClient from "../../utils/axiosClient";
const BASE_URL = process.env.REACT_APP_API_URL;


export async function getVipPackage() {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/vip-package/all`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function paymentMethod(amount, bankCode, userId, vipPackageId) {
    try {
        const response = await axiosClient.get(
            `/payments/vn-pay`,
            {
                params: {
                    amount,
                    bankCode,
                    userId,
                    vipPackageId
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (e) {
        console.error("Payment error:", e);
        throw e;
    }
}

export const paymentMethodTest = async (amount, bankCode, userId, vipPackageId) => {
    try {
        const temp
            = await axiosClient.get(`/payments/vn-pay?amount=${amount}&bankCode=${bankCode}&userId=${userId}&vipPackageId=${vipPackageId}`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getAllPayments = async (page) => {
    try {
        const temp= await axiosClient.get(`/payments/findAll?page=${page}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return null;
    }
}

export const getAllPaymentsUser = async (userId, page) => {
    try {
        const res = await axiosClient.get(`/payments/${userId}?page=${page}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

