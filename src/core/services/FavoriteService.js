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
        const response = await axiosClient.post(`favorites/song`, {
            data: song
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Thêm fav bài hát lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi thêm bài hát khỏi danh sách yêu thích"
        };
    }
}

export const addFavoriteSongBySongId = async (songId) => {
    try {
        const response = await axiosClient.post(`favorites/song-by-id`, { songId });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Thêm fav bài hát lỗi rồi", error);
        return {
            success: false,
            error: error.response?.data || "Có lỗi xảy ra khi thêm bài hát vào danh sách yêu thích"
        };
    }
};


export const addFavoriteAlbum = async (album) => {
    try {
        const response = await axiosClient.post(`favorites/album`, { albumId: album.albumId });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Thêm fav album lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi thêm album khỏi danh sách yêu thích"
        };
    }
}

export const addFavoriteArtist = async (artist) => {
    try {
        const response = await axiosClient.post(`favorites/artist`,artist);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Thêm fav ca sĩ lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi thêm ca sĩ khỏi danh sách yêu thích"
        };
    }
}

export const addFavoritePlaylist = async (playlist) => {
    try {
        const response = await axiosClient.post(`favorites/playlist`,playlist);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        return {
            success: false,
            error: "Có lỗi xảy ra khi thêm playlist khỏi danh sách yêu thích"
        };
    }
}

export const deleteFavoriteArtist = async (artist) => {
    try {
        const response = await axiosClient.delete(`favorites/artist`, {
            data: artist
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Xóa fav ca sĩ lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi xóa ca sĩ khỏi danh sách yêu thích"
        };
    }
}

export const deleteFavoritePlaylist = async (playlist) => {
    console.log(playlist);
    try {
        const response = await axiosClient.delete(`favorites/playlist`, {
            data: playlist
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Xóa playlist yêu thích lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi xóa playlist khỏi danh sách yêu thích"
        };
    }
}

export const deleteFavoriteAlbum = async (album) => {
    try {
        const response = await axiosClient.delete(`favorites/album`, {
            data: album
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Xóa album yêu thích lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi xóa album khỏi danh sách yêu thích"
        };
    }
}

export const deleteFavoriteSong = async (song) => {
    try {
        const response = await axiosClient.delete(`favorites/song`, {
            data: song
        });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return {
                success: false,
                error: "Bạn không có quyền thực hiện thao tác này"
            };
        }
        console.log("Xóa bài hát yêu thích lỗi rồi", error);
        return {
            success: false,
            error: "Có lỗi xảy ra khi xóa bài hát khỏi danh sách yêu thích"
        };
    }
}

