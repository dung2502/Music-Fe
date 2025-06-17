import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
export const getLyricJsonBySongId = async (songId) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/public/lyrics-timing/lyric-json/${songId}`);
        console.log(response);
        return  response;
    } catch (error) {
        console.error("Lỗi trong getLyricJsonBySongId:", error);
        return null;
    }
};