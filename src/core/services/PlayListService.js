import axios from "axios";
import axiosClient from "../../utils/axiosClient";

const BASE_URL = process.env.REACT_APP_API_URL;


export const getAllPlaylists = async () => {
    try {
        const temp
            = await axiosClient.get(`playlists/findAll`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getAllFavoritePlaylists = async (sort, direction,page,size) => {
    try {
        if (direction === undefined) {
            direction = "ASC";
        }
        const response
            = await axiosClient.get(`playlists/favorites?sort=${sort}&direction=${direction}&page=${page}&size=${size}`);
        console.log(response.data)
        return response.data;
    } catch (e) {
        return [];
    }
}

export const getAllPlaylistAuth = async (playlistName, page) => {
    try {
        const temp= await axiosClient.get(`playlists/getAllWithPage?playlistName=${playlistName}&page=${page-1}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getAllPlaylistByUserId = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;
    try {
        const temp= await axiosClient.get(`playlists/user/${userId}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const savePlaylistAuth = async (data) => {
    try {
        const response = await axiosClient.post(`playlists`, data, {
            params: {
                userId: data.userId
            }
        });
        return response.data;
    }
    catch (e){
        console.error("Error saving PlaylistUser:", e);
        throw new Error("Không thể thêm mới");
    }
};

export const createPlaylistUser = async (data) => {
    try {
        const response = await axiosClient.post(`playlists/create-playlist-user`,
            data,
            {
                params: { userId: data.userId },
            }
        );
        return response.data;
    } catch (e) {
        console.error("Error saving PlaylistUser:", e);
        throw new Error("Không thể thêm mới");
    }
};


export const addSongToPlaylist = async (playlistId, songId) => {
    try {
        const response = await axiosClient.post(`playlists/${playlistId}/add-song/${songId}`);
        return response.data;
    } catch (e) {
        console.error("Add song error:", e);
        throw e;
    }
};

export const removePlaylistById = async (playlistId) => {
    try {
        const response = await axiosClient.put(`playlists/remove/${playlistId}`);
        return response.data;
    } catch (error) {
        console.log(error + " error");
        return null;
    }
};

export const getPlaylistById = async (playlistId) => {
    try {
        const response = await axiosClient.get(`playlists/${playlistId}`);
        return response.data;
    } catch (e) {
        console.log(e)
        return {}
    }
}

export const updatePlaylist = async (playlist) => {
    try {
        const response = await axiosClient.put(`playlists/update/${playlist.playlistId}`, playlist);
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const getTotalPlaylistListens = async (playlistId) => {
    try {
        const response = await axiosClient.get(`playlists/${playlistId}/total-listens`);
        return response.data;
    } catch (e) {
        console.error(e);
        return 0;
    }
};




