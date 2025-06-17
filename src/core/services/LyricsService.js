import axios from "axios";

export const getLyricJsonBySongId = async (songId) => {
    try {
        const response = await axios.post(`http://localhost:8080/api/public/lyrics-timing/lyric-json/${songId}`);
        console.log(response);
        return  response;
    } catch (error) {
        console.error("Lỗi trong getLyricJsonBySongId:", error);
        return null;
    }
};