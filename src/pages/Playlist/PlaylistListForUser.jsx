import { Button, Card, Flex } from "lvq";
import { Link } from "react-router-dom";
import { IoIosHeart } from "react-icons/io";
import React, { useEffect, useState } from "react";
import "./CardPlaylist.scss";
import wave from "../../assets/gif/icon-playing.gif";
import { FaPlay } from "react-icons/fa";
import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import * as favoriteService from "../../core/services/FavoriteService";
import * as playlistService from "../../core/services/PlayListService";

import { toast } from "react-toastify";

function PlaylistForUser() {
    const [playlist, setPlaylist] = useState([]);

    const {
        addSongList,
        changeSongIndex,
        albumOrPlaylistId,
        toggleIsPlayingSong,
        isPlayingSong,
        setAlbumPlaylistId
    } = usePlayMusic();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const temp = await playlistService.getAllPlaylistByUserId();
                setPlaylist(temp);
            } catch (error) {
                console.error("Lỗi khi lấy playlist:", error);
            }
        };
        fetchData();
    }, []);

    const addNewFavoritePlaylist = async (playlistItem) => {
        try {
            await favoriteService.addFavoritePlaylist(playlistItem);
            toast.success("Đã cập nhật playlist yêu thích mới");
        } catch (error) {
            toast.error("Lỗi khi thêm vào danh sách yêu thích");
        }
    };

    const handlePlayPlaylist = (playlistItem) => {
        if (
            playlistItem?.songOfPlaylist &&
            Array.isArray(playlistItem.songOfPlaylist) &&
            playlistItem.songOfPlaylist.length > 0
        ) {
            addSongList(playlistItem.songOfPlaylist);
            changeSongIndex(0);
            setAlbumPlaylistId(playlistItem.playlistId);
        }
    };

    const handlePlayAndPausePlaylist = () => {
        toggleIsPlayingSong(!isPlayingSong);
    };

    return (
        <div className="playlist-row">
            {playlist?.map((item) => (
                <Card
                    key={item.playlistId}
                    srcImg={item.coverImageUrl}
                    id="albumCard"
                    gd={{ position: "relative" }}
                    className={`albumCard ${
                        albumOrPlaylistId === item.playlistId && isPlayingSong ? "active" : ""
                    }`}
                    title={
                        item.playlistName?.length > 25
                            ? `${item.playlistName.substring(0, 15)}...`
                            : item.playlistName
                    }
                    urlLink={`/playlist/${item.playlistId}`}
                    LinkComponent={Link}
                    children={
                        <Flex justifyContent="center" alignItems="center" className="action-menu">
                            <Button
                                className="card-icon heart"
                                type="button"
                                theme="reset"
                                icon={
                                    <IoIosHeart
                                        size={22}
                                        fill={item.userFavoriteStatus ? "red" : "white"}
                                    />
                                }
                                onClick={() => addNewFavoritePlaylist(item)}
                            />

                            {albumOrPlaylistId === item.playlistId ? (
                                <Button
                                    theme="reset"
                                    className="card-icon play"
                                    onClick={handlePlayAndPausePlaylist}
                                    icon={
                                        isPlayingSong ? (
                                            <img src={wave} height={30} alt="wave" />
                                        ) : (
                                            <FaPlay size={30} style={{ paddingLeft: 5 }} fill="white" />
                                        )
                                    }
                                    gd={{ border: "none" }}
                                />
                            ) : (
                                <Button
                                    theme="reset"
                                    className="card-icon play"
                                    onClick={() => handlePlayPlaylist(item)}
                                    icon={<FaPlay size={30} style={{ paddingLeft: 5 }} fill="white" />}
                                    gd={{ border: "none" }}
                                />
                            )}

                            <Button
                                className="card-icon menu"
                                theme="reset"
                                id={`active-album-menu-${item.playlistId}`}
                                icon={<HiOutlineDotsHorizontal size={22} fill="white" />}
                            />
                        </Flex>
                    }
                />
            ))}
        </div>
    );
}

export default PlaylistForUser;
