import {Button, Card, Flex} from "lvq";
import {Link} from "react-router-dom";
import {IoIosHeart} from "react-icons/io";
import React, {useEffect, useState} from "react";
import * as favoriteService from "../../core/services/FavoriteService";
import * as authenticationService from "../../core/services/AuthenticationService";
import "./Card.scss";
import wave from "../../assets/gif/icon-playing.gif";
import {FaPlay} from "react-icons/fa";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {toast} from "react-toastify";

export default function AlbumCard({album, key}) {
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
    const isAuthenticated = authenticationService.isAuthenticated();

    useEffect(() => {
        if (album) {
            setIsFavorited(album.userFavoriteStatus || false);
        }
    }, [album]);

    const addNewFavoriteAlbum = async (album) => {
        console.log(album);
        try {
            const response = await favoriteService.addFavoriteAlbum(album);
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
    }

    const deleteFavoriteAlbum = async (album) => {
        try {
            const response = await favoriteService.deleteFavoriteAlbum(album);
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

    const handlePlayAlbum = (index) => {

        if (album?.songs && Array.isArray(album.songs) && album.songs.length > 0)
        {
            addSongList(album.songs);
            changeSongIndex(0);
            setAlbumPlaylistId(index);
        }
    }

    const handlePlayAndPauseAlbum = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    }

    return (
        <Card srcImg={album.coverImageUrl} key={key} id={"albumCard"} gd={{position: "relative"}}
              className={`albumCard ${albumOrPlaylistId === album.albumId && isPlayingSong ? "active" : ""}`}
              title={album.title.length > 17 ? `${album.title.substring(0, 15)}...` : album.title}
              urlLink={`/albums/${album.albumId}`}
              LinkComponent={Link} description={album.provide}

              children={
                  <Flex justifyContent={"center"} alignItems={"center"} className={'action-menu'}>
                      {isAuthenticated && (
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
                                      deleteFavoriteAlbum(album);
                                  } else {
                                      addNewFavoriteAlbum(album);
                                  }
                              }}
                          />
                      )}

                      {
                          albumOrPlaylistId === album.albumId ?

                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={handlePlayAndPauseAlbum}
                                      icon={
                                          isPlayingSong ? <img src={wave} height={30} alt="wave"/>
                                              : <FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>
                                      }
                                      gd={{border: 'none'}}
                              >
                              </Button>

                              :
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={() => handlePlayAlbum(album.albumId)}
                                      icon={<FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>}
                                      gd={{border: 'none'}}
                              >
                              </Button>
                      }
                      <Button className={'card-icon menu'} theme={'reset'} id={`active-album-menu-${album.albumId}`}
                              icon={<HiOutlineDotsHorizontal size={22} fill={"white"}/>}></Button>
                  </Flex>
              }
        >
        </Card>
    );
}