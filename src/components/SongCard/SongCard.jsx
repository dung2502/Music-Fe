import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {Button, Card, Flex, Typography} from "lvq";
import "./SongCard.scss";
import {LiaMicrophoneAltSolid} from "react-icons/lia";
import {IoIosHeart} from "react-icons/io";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import ModalSongMenu from "../Modal/ModalMenu/ModalSongMenu";
import wave from "../../assets/gif/icon-playing.gif";
import {FaPlay} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import * as favoriteService from "../../core/services/FavoriteService";
import * as authenticationService from "../../core/services/AuthenticationService";
import {toast} from "react-toastify";
export default function SongCard({songList, song, index}) {
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

    const [modalSongIndex, setModalSongIndex] = useState(0);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);


    useEffect(() => {
        if (song) {
            setIsFavorited(song.userFavoriteStatus || false);
        }
    }, [song]);

    const handlePlaySong = (index) => {
        if (playSongList !== songList) {
            addSongList(songList);
        }
        changeSongIndex(index);
    };

    const handlePlayAndPauseSong = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    }

    const openSongMenu = (songId) => {
        setModalSongIndex(songId);
        setIsOpenSongMenu(true);
    }

    const handleCloseSongMenu = () => {
        setModalSongIndex(0);
        setIsOpenSongMenu(false);
    }

    const addNewFavoriteSong = async (song) => {
        console.log(song);
        try {
            const response = await favoriteService.addFavoriteSong(song);
            if (response.success) {
                setIsFavorited(true);
                toast.success("Đã thêm vào danh sách yêu thích");
            } else {
                toast.error(response.error || "Không thể thêm vào danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Không thể thêm vào danh sách yêu thích");
            console.error(error);
        }
    };

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

    return(
        <Flex className={playSongList[songIndexList]?.songId === song.songId && isPlayingSong
            ? "audio-card active" : "audio-card"} key={index}>
            <Card sizeImg={60}
                  className={playSongList[songIndexList]?.songId === song.songId ? "song-card active" : "song-card"}
                  long
                  srcImg={song.coverImageUrl}
                  title={song.title.length > 17 ? `${song.title.substring(0, 15)}...` : song.title}
                  description={song.artists.map((artist, index) => (
                      <Typography tag={'span'}>
                          {artist.artistName}
                          {index !== song.artists.length - 1 &&
                              <Typography tag={'span'}>, </Typography>}
                      </Typography>
                  ))}

                  children={
                      <Flex justifyContent={'end'} alignItems={'center'}>
                          <Button className={'card-icon kara'} theme={'reset'}
                                  icon={<LiaMicrophoneAltSolid size={18}/>}>

                          </Button>

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

                          <Button className={'card-icon menu'}
                                  theme={'reset'}
                                  id={`active-song-menu-${song.songId}`}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      openSongMenu(song.songId)
                                  }}
                                  icon={<HiOutlineDotsHorizontal size={18}/>}>
                          </Button>

                          <Typography className={'duration'} right
                                      tag="small">{((song.duration) / 60).toFixed(2).replace('.', ':')}
                          </Typography>


                          {song.songId === modalSongIndex &&
                              <ModalSongMenu
                                  isOpen={isOpenSongMenu}
                                  onClose={handleCloseSongMenu}
                                  song={song}>

                              </ModalSongMenu>
                          }
                      </Flex>
                  }
                  gd={{maxWidth: '100%'}}
                  onClick={() => handlePlaySong(index)}
            >
            </Card>


            <Flex justifyContent={"center"} alignItems={'center'}
                  className={'audio-play'}
                  gd={{width: 60, height: 60, margin: 10}}
            >
                {
                    playSongList[songIndexList]?.songId === song.songId ?
                        <Button theme={'reset'}
                                onClick={handlePlayAndPauseSong}
                                icon={
                                    isPlayingSong ? <img src={wave} height={20} alt="wave"/>
                                        : <FaPlay size={20} style={{paddingLeft: 5}} color={"white"}/>
                                }
                                gd={{border: 'none'}}
                        >
                        </Button>
                        :
                        <Button theme={'reset'}
                                onClick={() => handlePlaySong(index)}
                                icon={<FaPlay size={20} style={{paddingLeft: 5}} color={"white"}/>}
                                gd={{border: 'none'}}
                        >
                        </Button>
                }
            </Flex>
        </Flex>
    );
}