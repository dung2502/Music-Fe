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

export default function TopSongCard({songList, song, key, listenCount}) {
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

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        console.log(song)
        const fetchFavorites = async () => {
            try {
                const favorites = await getAllFavoriteForUser();
                const isFav = favorites.some((fav) => String(fav.songId) === String(song.songId));
                console.log(isFav);
                setIsFavorite(isFav);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
        fetchFavorites();
    }, [song.songId]);

    const handleAddFavorite = async (e) => {
        e.stopPropagation();
        try {
            await addFavoriteSong(song);
            setIsFavorite(true);
            toast.success("Đã cập nhật bài hát yêu thích mới");
        } catch (error) {
            toast.error("Thêm yêu thích thất bại");
        }
    };

    const handlePlaySong = (index) => {
        if (song) {
            addSongList([song]);
            changeSongIndex(0);
            setAlbumPlaylistId(index);
        }
    };

    const handlePlayAndPauseSong = () => {
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
                          <Button className={'card-icon heart'} type={'button'} theme={'reset'}
                                  icon={<IoIosHeart size={22} fill={isFavorite ? "red" : "white"}/>}
                                  onClick={handleAddFavorite}>
                          </Button>

                          {albumOrPlaylistId === song.songId ? (
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={handlePlayAndPauseSong}
                                      icon={isPlayingSong
                                          ? <img src={wave} height={30} alt="wave"/>
                                          : <FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>}
                                      gd={{border: 'none'}}/>
                          ) : (
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={() => handlePlaySong(song.songId)}
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
