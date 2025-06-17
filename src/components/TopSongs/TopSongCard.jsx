import {Button, Card, Flex, Typography} from "lvq";
import {Link} from "react-router-dom";
import {IoIosHeart} from "react-icons/io";
import React, {useEffect, useState} from "react";
import {getAllFavoriteForUser, addFavoriteSong} from "../../core/services/FavoriteService";
import "./Card.scss";
import wave from "../../assets/gif/icon-playing.gif";
import {FaPlay} from "react-icons/fa";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {toast} from "react-toastify";
import * as favoriteService from "../../core/services/FavoriteService";
import * as authenticationService from "../../core/services/AuthenticationService";

export default function TopSongCard({songList,song, key, listenCount}) {
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

    const [isFavorited, setIsFavorited] = useState(false);


    useEffect(() => {
        if (song) {
            setIsFavorited(song.userFavoriteStatus || false);
        }
    }, [song]);

    const addNewFavoriteSongById = async (song) => {
        console.log(song.songId);
        try {
            const response = await favoriteService.addFavoriteSongBySongId(song.songId); // chỉ truyền songId
            if (response.success) {
                setIsFavorited(true);
                toast.success("Đã thêm vào danh sách yêu thích");
            } else {
                toast.error(response.error || "Không thể thêm vào danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Không thể thêm vào danh sách yêu thích");
            console.error("Lỗi khi thêm yêu thích:", error);
        }
    };


    const deleteFavoriteSong = async (song) => {
        try {
            const response = await favoriteService.deleteFavoriteSong(song);
            if (response.success) {
                setIsFavorited(false);
                toast.success("Đã xóa khỏi danh sách yêu thích");
            } else {
                toast.error(response.error || "Không thể xóa khỏi danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Không thể xóa khỏi danh sách yêu thích");
            console.error(error);
        }
    }

    const handlePlaySong = (index) => {
        console.log("abc")
        if (playSongList !== songList) {
            addSongList(songList);
        }
        changeSongIndex(index);
    };

    const handlePlayAndPauseSong = () => {
        console.log("abc")

        toggleIsPlayingSong(!isPlayingSong);
    };

    return (
        <Card srcImg={song.coverImageUrl} key={key} id={"songCard"} gd={{position: "relative"}}
              className={`songCard ${albumOrPlaylistId === song.songId && isPlayingSong ? "active" : ""}`}
              title={
                  <div style={{display: "flex", flexDirection: "column"}}>
                       <span>
                      {song.title.length > 17 ? `${song.title.substring(0, 15)}...` : song.title}
                        </span>
                      <Typography tag="span" style={{ fontSize: "12px", color: "#ccc", marginTop: 2 }}>
                          {listenCount?.toLocaleString() || 0} lượt nghe
                      </Typography>
                  </div>
              }

                      urlLink={`/song/${song.songId}`}
                      LinkComponent={Link} description={song.artist}
                      children={
                      <Flex justifyContent={"center"} alignItems={"center"} className={'action-menu'}>
                          {authenticationService.isAuthenticated() && (
                              <Button
                                  className="card-icon heart"
                                  type="button"
                                  theme="reset"
                                  icon={
                                      <IoIosHeart
                                          size={22}
                                          fill={isFavorited ? "red" : "white"}
                                      />
                                  }
                                  onClick={(e) => {
                                      if (isFavorited) {
                                          deleteFavoriteSong(song);
                                      } else {
                                          addNewFavoriteSongById(song);
                                      }
                                  }}
                              />
                          )}

                          {albumOrPlaylistId === song.songId ? (
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={handlePlayAndPauseSong}
                                      icon={isPlayingSong
                                          ? <img src={wave} height={30} alt="wave"/>
                                          : <FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>}
                                      gd={{border: 'none'}}/>
                          ) : (
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={() => handlePlaySong(songList.findIndex(s => s.songId === song.songId))}
                                      icon={<FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>}
                                      gd={{border: 'none'}}/>
                          )}

                          <Button className={'card-icon menu'} theme={'reset'} id={`active-song-menu-${song.songId}`}
                                  icon={<HiOutlineDotsHorizontal size={22} fill={"white"}/>}>
                          </Button>
                      </Flex>
                  }>
                  </Card>
                  );
}
