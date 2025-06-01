import axios from "axios";
import axiosClient from "../../utils/axiosClient";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getAllFavoriteForUser = async () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.userId;
        console.log(userId)
        const response = await axios.get(`${BASE_URL}/api/auth/favorites?userId=${userId}`);
        return response.data;
    } catch (e) {
        return [];
    }
}

export const addFavoriteSong = async (song) => {
    try {
        const response = await axiosClient.post(`favorites/song`,song);
        return response.data;
    } catch (e) {
        return [];
    }
}

export const addFavoriteAlbum = async (album) => {
    try {
        const response = await axiosClient.post(`favorites/album`,album);
        return response.data;
    } catch (e) {
        return [];
    }
}

export const addFavoriteArtist = async (artist) => {
    try {
        const response = await axiosClient.post(`favorites/artist`,artist);
        return response.data;
    } catch (e) {
        return [];
    }
}

export const addFavoritePlaylist = async (playlist) => {
    try {
        const response = await axiosClient.post(`favorites/playlist`,playlist);
        return response.data;
    } catch (e) {
        return [];
    }
}
export const deleteFavoritePlaylist = async (playlist) => {
    try {
        const response = await axiosClient.delete(`favorites/playlist`, {
            data: playlist // axios cần `data` để gửi body với DELETE
        });
        return response.data;
    } catch (e) {
        return [];
    }
};
