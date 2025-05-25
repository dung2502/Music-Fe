import {Button, Card, Flex} from "lvq";
import {Link} from "react-router-dom";
import {IoIosHeart} from "react-icons/io";
import React, {useState} from "react";
import "./Card.scss";
import wave from "../../assets/gif/icon-playing.gif";
import {FaPlay} from "react-icons/fa";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import * as favoriteService from "../../core/services/FavoriteService";

export default function PlaylistCard({playlist, key}) {
    const [isFavorite, setIsFavorite] = useState(playlist?.userFavoriteStatus || false);
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
        setIsFavorite(true);
    }

    const handleDeleteFavoritePlaylist = async (playlist) => {
        console.log("Run");
        await favoriteService.deleteFavoritePlaylist(playlist);
        setIsFavorite(false);
    }

    const handleToggleFavorite = async (e, playlist) => {
        e.stopPropagation();
        if (playlist) {
            if (isFavorite) {
                await handleDeleteFavoritePlaylist(playlist);
            } else {
                await addNewFavoritePlaylist(playlist);
            }
        }
    }

    const handlePlayPlaylist = (index) => {
        if (playlist?.songs) {
            addSongList(playlist.songs)
            changeSongIndex(0);
            setAlbumPlaylistId(index);
        }
    }

    const handlePlayAndPausePlaylist = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    }

    return (
        <Card srcImg={playlist?.coverImageUrl} key={key} id={"albumCard"} gd={{position:"relative"}}
              className={`albumCard ${albumOrPlaylistId === playlist?.playlistId && isPlayingSong ? "active" : ""}`}
              title={playlist?.playlistName ? (playlist.playlistName.length > 25 ? `${playlist.playlistName.substring(0, 15)}...` : playlist.playlistName) : ''}
              urlLink={playlist?.playlistId ? `/playlists/${playlist.playlistId}` : '#'}
              LinkComponent={Link}
              children={
                  <Flex justifyContent={"center"} alignItems={"center"} className={'action-menu'}>
                      <Button className={'card-icon heart'} type={'button'}
                              theme={'reset'} icon={<IoIosHeart size={22} fill={isFavorite ? "red" : "white"}/>}
                              onClick={(e) => handleToggleFavorite(e, playlist)}
                      >
                      </Button>
                      {
                          albumOrPlaylistId === playlist.playlistId ?
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={handlePlayAndPausePlaylist}
                                      icon={
                                          isPlayingSong ? <img src={wave} height={30} alt="wave"/>
                                              : <FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>
                                      }
                                      gd={{border: 'none'}}
                              >
                              </Button>
                              :
                              <Button theme={'reset'} className={'card-icon play'}
                                      onClick={() => handlePlayPlaylist(playlist?.playlistId)}
                                      icon={<FaPlay size={30} style={{paddingLeft: 5}} fill={"white"}/>}
                                      gd={{border: 'none'}}
                              >
                              </Button>
                      }
                      <Button className={'card-icon menu'} theme={'reset'} id={`active-album-menu-${playlist?.playlistId}`}
                              icon={<HiOutlineDotsHorizontal size={22} fill={"white"}/>}></Button>
                  </Flex>
              }
        >
        </Card>
    );
}