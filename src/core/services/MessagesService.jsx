import axiosClient from "../../utils/axiosClient";

export const getHistoryMessages = async () => {
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