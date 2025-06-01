import { Button, Card, Flex, Typography } from "lvq";
import { Link } from "react-router-dom";
import { IoIosHeart } from "react-icons/io";
import React from "react";
import "./Card.scss";
import wave from "../../assets/gif/icon-playing.gif";
import { FaPlay } from "react-icons/fa";
import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import * as favoriteService from "../../core/services/FavoriteService";
import { toast } from "react-toastify";

export default function PlaylistCard({ playlist, listenCount }) {
    const {
        playSongList,
        songIndexList,
        albumOrPlaylistId,
        addSongList,
        changeSongIndex,
        toggleIsPlayingSong,
        isPlayingSong,
        setAlbumPlaylistId
    } = usePlayMusic();

    const addNewFavoritePlaylist = async (playlist) => {
        await favoriteService.addFavoritePlaylist(playlist);
        toast.success("Đã cập nhật playlist yêu thích mới");
    };

    const handlePlayPlaylist = (index) => {
        if (
            playlist?.songOfPlaylist &&
            Array.isArray(playlist.songOfPlaylist) &&
            playlist.songOfPlaylist.length > 0
        ) {
            addSongList(playlist.songOfPlaylist);
            changeSongIndex(0);
            setAlbumPlaylistId(index);
        }
    };

    const handlePlayAndPausePlaylist = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    };

    return (
        <Card
            srcImg={playlist?.coverImageUrl}
            id={"albumCard"}
            gd={{ position: "relative" }}
            className={`albumCard ${albumOrPlaylistId === playlist?.playlistId && isPlayingSong ? "active" : ""}`}
            title={
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>
                        {playlist?.playlistName
                            ? playlist.playlistName.length > 25
                                ? `${playlist.playlistName.substring(0, 15)}...`
                                : playlist.playlistName
                            : ""}
                    </span>
                    <Typography tag="span" style={{ fontSize: "12px", color: "#ccc", marginTop: 2 }}>
                        {listenCount?.toLocaleString() || 0} lượt nghe
                    </Typography>
                </div>
            }
            urlLink={playlist?.playlistId ? `/playlist/${playlist.playlistId}` : "#"}
            LinkComponent={Link}
        >
            <Flex justifyContent="center" alignItems="center" className="action-menu">
                <Button
                    className="card-icon heart"
                    type="button"
                    theme="reset"
                    icon={
                        <IoIosHeart
                            size={22}
                            fill={playlist.userFavoriteStatus ? "red" : "white"}
                        />
                    }
                    onClick={(e) => addNewFavoritePlaylist(playlist)}
                />
                {albumOrPlaylistId === playlist.playlistId ? (
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
                        onClick={() => handlePlayPlaylist(playlist?.playlistId)}
                        icon={<FaPlay size={30} style={{ paddingLeft: 5 }} fill="white" />}
                        gd={{ border: "none" }}
                    />
                )}
                <Button
                    className="card-icon menu"
                    theme="reset"
                    id={`active-album-menu-${playlist?.playlistId}`}
                    icon={<HiOutlineDotsHorizontal size={22} fill="white" />}
                />
            </Flex>
        </Card>
    );
}
