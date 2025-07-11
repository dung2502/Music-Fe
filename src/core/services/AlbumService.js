import axios from "axios";
import axiosClient from "../../utils/axiosClient";

const BASE_URL = process.env.REACT_APP_API_URL;

export const getAllAlbums = async () => {
    try {
        const temp
            = await axiosClient.get(`albums/all`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getAllAlbumsWithPage = async (contentSearch, page) => {
    try {
        const temp
            = await axiosClient.get(`albums?title=${contentSearch}&artistName=${contentSearch}&page=${page-1}`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}


export const getAllSuggestedAlbums = async () => {
    try {
        const temp= await axios.get(`${BASE_URL}/api/public/albums/suggestedAlbums`);
        console.log(temp.data)
        return temp.data.content;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getSixAlbumsBest = async () => {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/albums/top-albums`);
        console.log(temp.data)
        return temp.data.content;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getSixAlbumsBestForUser = async () => {
    try {
        const res = await axiosClient.get(`/albums/top-albums-for-user`);
        console.log(res.data)
        return res.data.content;
    } catch (e) {
        console.error('Error updating user listen:', e);
    }
}

export const getAllNewAlbumsRelease = async (national) => {
    try {
        const temp
            = await axios.get(`${BASE_URL}/api/public/albums/new-albums-release?national=${national}`);
        console.log(temp.data)
        return temp.data;
    } catch (e) {
        console.log(e)
        return [];
    }
}

export const getAllFavoriteAlbums = async (sort, direction,page,size) => {
    try {
        if (direction === undefined) {
            direction = "ASC";
        }
        const response
            = await axiosClient.get(`albums/favorites?sort=${sort}&direction=${direction}&page=${page}&size=${size}`);
        console.log(response.data)
        return response.data;
    } catch (e) {
        return [];
    }
}

export const getAlbumById = async (albumId) => {
    try {
        const temp = await axios.get(`${BASE_URL}/api/public/albums/${albumId}`);
        console.log(temp.data);
        return temp.data;
    } catch (e) {
        console.log(e)
        return {}
    }
}

export const saveAlbum = async (album) => {
    try {
        const temp = await axiosClient.post(`albums`, album);
        return temp.data;
    } catch (e) {
        console.log(e)
        throw e.response?.data;
    }
}

export const updateAlbum = async (album) => {
    try {
        const temp = await axiosClient.put(`albums/${album.albumId}`, album);
        return temp.data;
    } catch (e) {
        console.log(e)
        throw e.response?.data;
    }
}

export const removeAlbum = async (albumId) => {
    try {
        const temp = await axiosClient.put(`albums/remove/${albumId}`);
        return temp.data;
    }catch (error) {
        console.log(error + " error");
        return null;
    }
}
