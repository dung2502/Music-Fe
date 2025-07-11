import axios from "axios";
import axiosClient from "../../utils/axiosClient";

const BASE_URL = process.env.REACT_APP_API_URL;

export async function getAllSongs() {
    try {
        const temp
            = await axiosClient.get(`songs/all`, {});
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getAllSongListens() {
    try {
        const temp
            = await axiosClient.get(`SongListens/findAll`, {});
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}


export async function getAllSongsWithPage(contentSearch, page) {
    try {
        const temp
            = await axiosClient.get(`songs?title=${contentSearch}&artistName=${contentSearch}&page=${page-1}`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}



export async function getAllSuggestedSongs() {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/songs/suggestedSongs`, {});
        console.log(temp.data);
        return temp.data.content;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getTop3SongsIn7Days() {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/songs/top-3-songs-in-7-days`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getTop100SongsWithTimes(national, size) {
    try {
        if (size === undefined) {
            size = 100;
        }
        const temp
            = await axios.get(`${BASE_URL}/api/public/songs/top-song?national=${national}&size=${size}`);
        console.log(temp.data);
        return temp.data.content;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getAllFavoriteSongs = async (sort, direction,page,size) => {
    try {
        if (direction === undefined) {
            direction = "ASC";
        }
        const response
            = await axiosClient.get(`songs/favorites?sort=${sort}&direction=${direction}&page=${page}&size=${size}`);
        console.log(response.data)
        return response.data;
    } catch (e) {
        return [];
    }
}

export async function getNew100Songs() {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/songs/new-song-ratings`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getNewSongsRelease(national) {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/songs/new-songs-release?national=${national}`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getTop100Songs() {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/songs/top-100-songs`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getSongById = async (songId) => {
    try {
        const temp = await axios.get(`${BASE_URL}/api/public/songs/${songId}`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const getSongByIdAuth = async (songId) => {
    try {
        const temp = await axiosClient.get(`songs/${songId}`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

export const saveSong= async (song) => {
    try {
        const temp = await axios.post(`${BASE_URL}/api/public/songs`, song);
        return temp.data;
    } catch (e) {
        console.log(e)
        throw e.response?.data;
        
    }

}

export const updateSong= async (song) => {
    try {
        const temp = await axiosClient.put(`songs/${song.songId}`, song);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        throw new Error("Không thể cập nhật!")
    }
}

export const updateListens = async (songId) => {
    try {
        await axios.put(`${BASE_URL}/api/public/song-listens?songId=${songId}`);

    } catch (e) {
        console.log(e)
    }
}


export const updateUserListens = async (songId) => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    try {
        const { userId } = JSON.parse(userData);
        if (!userId) return;

        await axiosClient.put(`/user-listens/update?songId=${songId}&userId=${userId}`);
    } catch (e) {
        console.error('Error updating user listen:', e);
    }
}

export const getRecentUserListens = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return [];

    try {
        const { userId } = JSON.parse(userData);
        if (!userId) return [];

        const response = await axiosClient.get(`/user-listens/recent/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent listens:", error);
        return [];
    }
};

export const getSixSongsBest = async () => {
    try {
        const temp = await axios.get(`${BASE_URL}/api/public/songs/top-6-most-listened`);
        return temp.data.content;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getSixSongsBestForUser() {
    try {
        const res = await axiosClient.get(`/songs/top-6-most-listened-for-user`);
        console.log("abc");
        return res.data.content;
    } catch (e) {
        console.error('Error updating user listen:', e);
    }
}

export  const getSongNewReleased = async () => {
    try {
        const temp = await axios.get(`${BASE_URL}/api/public/songs/song-new-released`);
        return temp.data.content;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export async function getSuggestedSongsForUser() {
    try {
        const res = await axiosClient.get(`/songs/suggestions`);
        console.log(res.data)
        return res.data.content;
    } catch (e) {
        console.error('Error updating user listen:', e);
    }
}
export async function getReleasedSongsForUser() {
    try {
        const res = await axiosClient.get(`/songs/released`);
        console.log(res.data)
        return res.data.content;
    } catch (e) {
        console.error('Error updating user listen:', e);
    }
}

export const getTotalSongListenBySongId = async (songId) => {
    try {
        const temp = await axios.get(`${BASE_URL}/api/public/song-listens/total?songId=${songId}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getTotalFavSongBySongId = async (songId) => {
    try {
        const temp = await axios.get(`${BASE_URL}/api/public/songs/total-fav-song?songId=${songId}`);
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}



