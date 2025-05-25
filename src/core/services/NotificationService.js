import axiosClient from "../../utils/axiosClient";

export const getAllNotifications = async (roleId) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.userId;
        console.log(userId)
        const temp = await axiosClient.get(`/notifications/list?roleId=${roleId}&userId=${userId}`);
        return temp.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const updateMarkAllRead = async () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.userId;
        console.log(userId)
        const temp = await axiosClient.patch(`/notifications/markAllAsRead?userId=${userId}`);
        console.log(temp)
        return temp;
    } catch (e) {
        console.log(e);
        return [];
    }
}
export const createNotification = async (notificationData) => {
    try {
        const res = await axiosClient.post(`/notifications/sendToAll`, notificationData);
        return res.data;
    } catch (e) {
        console.log("Failed to create notification", e);
        throw e;
    }
};
