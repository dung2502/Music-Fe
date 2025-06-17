import {Avatar, Button, Card, Container, Flex, Grid, Group, Input, Pagination, Table, Typography} from "lvq";
import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AiFillHeart, AiFillPlayCircle, AiFillPlusCircle, AiOutlineArrowRight, AiOutlineRight} from "react-icons/ai";
import {TimeExtractor} from "./TimeExtractor";
import {RiMusic2Line} from "react-icons/ri";
import * as songService from "../../core/services/SongService";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {FaPlay} from "react-icons/fa";
import ModalSongMenu from "../../components/Modal/ModalMenu/ModalSongMenu";
import {IoIosHeart} from "react-icons/io";
import {LiaMicrophoneAltSolid} from "react-icons/lia";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import wave from "../../assets/gif/icon-playing.gif";
import * as albumService from "../../core/services/AlbumService";
import AlbumCard from "../../components/AlbumAndPlayListCard/AlbumCard";
import * as PlaylistService from "../../core/services/PlayListService";
import PlaylistCard from "../../components/AlbumAndPlayListCard/PlaylistCard";
import * as playlistService from "../../core/services/PlayListService";
import * as artistService from "../../core/services/ArtistService";
import * as favoriteService from "../../core/services/FavoriteService";
import {toast} from "react-toastify";

export function FavoriteList() {
    const navigate = useNavigate();
    const {
        playSongList,
        songIndexList,
        addSongList,
        changeSongIndex,
        toggleIsPlayingSong,
        isPlayingSong,
    } = usePlayMusic();
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [favoriteAlbums, setFavoriteAlbums] = useState([]);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [favoritePlayLists, setFavoritePlaylists] = useState([]);
    const [modalSongIndex, setModalSongIndex] = useState(0);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);
    const [numberSelected, setNumberSelected] = useState(0);
    const [playlistListenCounts, setPlaylistListenCounts] = useState({});
    const [playlistListenCountsFav, setPlaylistListenCountsFav] = useState({});
    const [favoriteStatusMap, setFavoriteStatusMap] = useState({});

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (numberSelected === 0) {
                await getFavoriteSongsList('','DESC',0,100);
            } else if(numberSelected === 1) {
                await getFavoriteAlbumList('','DESC',0,100);
            }else if(numberSelected === 2) {
                await getFavoritePlaylist('','DESC',0,100);
            }else {
                await getFavoriteArtists('','DESC',0,100)
            }
        }
        fetchData().then().catch(console.error);
    }, [numberSelected]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            switch(hash) {
                case '#album':
                    setNumberSelected(1);
                    document.getElementById('album')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '#playlist':
                    setNumberSelected(2);
                    document.getElementById('playlist')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '#artist':
                    setNumberSelected(3);
                    document.getElementById('artist')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '#song':
                    setNumberSelected(0);
                    document.getElementById('song')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                default:
                    setNumberSelected(0);
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    useEffect(() => {
        const fetchPlaylists = async () => {
            await getAllPlaylists();
        }
        fetchPlaylists();
    }, [])

    const getFavoriteArtists = async (sort, direction,page,size) => {
        const temp = await artistService.getAllFavoriteArtists(sort, direction,page,size);
        setFavoriteArtists(temp.content);
    }

    const getFavoriteSongsList = async (sort, direction,page,size) => {
        const temp = await songService.getAllFavoriteSongs(sort, direction,page,size);
        setFavoriteSongs(temp.content);
        const statusMap = {};
        temp.content.forEach(song => {
            statusMap[song.songId] = song.userFavoriteStatus || false;
        });
        setFavoriteStatusMap(statusMap);
    }

    const getFavoriteAlbumList = async (sort, direction,page,size) => {
        const temp = await albumService.getAllFavoriteAlbums(sort, direction,page,size);
        setFavoriteAlbums(temp.content);
    }
    const getFavoritePlaylist = async (sort, direction,page,size) => {
        const temp = await PlaylistService.getAllFavoritePlaylists(sort, direction,page,size);
        setFavoritePlaylists(temp.content);
        const listenCounts = {};
        for (const playlist of temp.content) {
            const count = await playlistService.getTotalPlaylistListens(playlist.playlistId);
            listenCounts[playlist.playlistId] = count;
        }
        setPlaylistListenCountsFav(listenCounts);
    }

    const getAllPlaylists = async () => {
        const temp = await playlistService.getAllPlaylistByUserId();
        setPlaylists(temp);

        const listenCounts = {};
        for (const playlist of temp) {
            const count = await playlistService.getTotalPlaylistListens(playlist.playlistId);
            listenCounts[playlist.playlistId] = count;
        }
        setPlaylistListenCounts(listenCounts);
    };

    const handlePlaySong = (index) => {
        if (playSongList !== favoriteSongs) {
            addSongList(favoriteSongs);
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
        try {
            const response = await favoriteService.addFavoriteSong(song);
            if (response.success) {
                setFavoriteStatusMap(prev => ({
                    ...prev,
                    [song.songId]: true
                }));
                toast.success("Đã thêm vào danh sách yêu thích");
                await getFavoriteSongsList('','DESC',0,100);
            } else {
                toast.error(response.error || "Không thể thêm vào danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Không thể thêm vào danh sách yêu thích");
            console.error(error);
        }
    };

    const deleteFavoriteSong = async (song) => {
        try {
            const response = await favoriteService.deleteFavoriteSong(song);
            if (response.success) {
                setFavoriteStatusMap(prev => ({
                    ...prev,
                    [song.songId]: false
                }));
                toast.success("Đã xóa khỏi danh sách yêu thích");
                await getFavoriteSongsList('','DESC',0,100);
            } else {
                toast.error(response.error || "Không thể xóa khỏi danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Không thể xóa khỏi danh sách yêu thích");
            console.error(error);
        }
    }
    return (
        <Container>
            <Group>
                <Typography tag="h1" gd={{fontSize: "40px", marginBottom:"16px"}}>THƯ VIỆN <AiFillPlayCircle style={{paddingTop:"10px"}}/></Typography>
            </Group>

            <Group id="playlist" gd={{marginBottom:"30px"}}>
                <Flex between={true} gd={{marginBottom:"20px"}}>
                    <Typography tag={"h1"} gd={{fontSize:"25px"}}>PLAYLIST <AiFillPlusCircle style={{paddingTop:"10px",fontSize:"30px"}}/></Typography>
                    <Typography 
                        tag={"p"}
                        gd={{
                            fontSize:"15px",
                            color:"#333",
                            cursor: "pointer",
                            "&:hover": {
                                color: "#1db954"
                            }
                        }}
                        onClick={() => navigate('/playlists')}
                    > 
                        Tất cả <AiOutlineRight style={{marginTop:"5px"}}/>
                    </Typography>
                </Flex>
                <Flex gap={7} >
                    <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                        {playlists && playlists.map((playlist, index) => (
                            <PlaylistCard
                                playlist={playlist}
                                key={index}
                                listenCount={playlistListenCounts[playlist.playlistId] || 0}
                            />
                        ))}
                    </Grid>
                </Flex>
            </Group>

            <Flex gap={8} gd={{borderBottom:"1px solid white",marginBottom:"30px", padding: "5px 0"}}>
                <Button id="song" theme={"reset"}
                        gd={numberSelected === 0 ? {color: "#fff"} : {}}
                        onClick={() => {
                            setNumberSelected(0);
                            window.location.hash = 'song';
                        }}
                        text={"BÀI HÁT"}
                ></Button>
                <Button id="album" theme={"reset"}
                        gd={numberSelected === 1 ? {color: "#fff"} : {}}
                        onClick={() => {
                            setNumberSelected(1);
                            window.location.hash = 'album';
                        }}
                        text={"ALBUM"}
                ></Button>
                <Button id="playlist" theme={"reset"}
                        gd={numberSelected === 2 ? {color: "#fff"} : {}}
                        onClick={() => {
                            setNumberSelected(2);
                            window.location.hash = 'playlist';
                        }}
                        text={"PLAYLIST"}
                ></Button>
                <Button id="artist" theme={"reset"}
                        gd={numberSelected === 2 ? {color: "#fff"} : {}}
                        onClick={() => {
                            setNumberSelected(2);
                            window.location.hash = 'artist';
                        }}
                        text={"CA SĨ"}
                ></Button>
            </Flex>

            {numberSelected === 0 ? (
                <Grid columns={1} md={2} xl={3} gap={6}>
                    {favoriteSongs && favoriteSongs.map((song, index) => (
                        <Flex className={playSongList[songIndexList].songId === song.songId && isPlayingSong
                            ? "audio-card active" : "audio-card"}>
                            <Card sizeImg={60}
                                  className={playSongList[songIndexList].songId === song.songId ? "song-card active": "song-card"}
                                  key={index} long
                                  srcImg={song.coverImageUrl}
                                  title={song.title.length > 17 ? `${song.title.substring(0, 15)}...` : song.title}
                                  description={song.artists.map((artist, index) => (
                                      <Typography tag={'span'}>
                                          {artist.artistName}
                                          {index !== song.artists.length - 1 && <Typography tag={'span'}>, </Typography>}
                                      </Typography>
                                  ))}
                                  children={
                                      <Flex justifyContent={'end'} alignItems={'center'}>
                                          <Button className={'card-icon kara'} type={'button'} theme={'reset'} icon={<LiaMicrophoneAltSolid size={18}/>}></Button>

                                          <Button
                                              className="card-icon heart"
                                              type="button"
                                              theme="reset"
                                              icon={
                                                  <IoIosHeart
                                                      size={22}
                                                      fill={favoriteStatusMap[song.songId] ? "red" : "white"}
                                                  />
                                              }
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (favoriteStatusMap[song.songId]) {
                                                      deleteFavoriteSong(song);
                                                  } else {
                                                      addNewFavoriteSong(song);
                                                  }
                                              }}
                                          />

                                          <Button className={'card-icon menu'} theme={'reset'} id={`active-song-menu-${song.songId}`}
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      openSongMenu(song.songId)
                                                  }}
                                                  icon={<HiOutlineDotsHorizontal size={18}/>}
                                          >

                                          </Button>
                                          <Typography className={'duration'} right tag="small">{((song.duration)/60).toFixed(2).replace('.', ':')}</Typography>
                                          {song.songId === modalSongIndex &&
                                              <ModalSongMenu
                                                  isOpen={isOpenSongMenu}
                                                  onClose={handleCloseSongMenu}
                                                  song={song}
                                              >

                                              </ModalSongMenu>
                                          }
                                      </Flex>
                                  }
                                  gd={{ maxWidth: '100%'}}
                                  onClick={()=>handlePlaySong(index)}
                            >
                            </Card>
                            <Flex justifyContent={"center"} alignItems={'center'}
                                  className={'audio-play'}
                                  gd={{width: 60, height: 60, margin: 10}}
                            >
                                {
                                    playSongList[songIndexList].songId === song.songId ? (
                                        <Button theme={'reset'}
                                                onClick={handlePlayAndPauseSong}
                                                icon={
                                                    isPlayingSong ? <img src={wave} height={20} alt="wave"/>
                                                        : <FaPlay size={20} style={{paddingLeft: 5}} color={"white"}/>
                                                }
                                                gd={{border: 'none'}}
                                        >
                                        </Button>
                                    ) : (
                                        <Button theme={'reset'}
                                                onClick={() => handlePlaySong(index)}
                                                icon={<FaPlay size={20} style={{paddingLeft: 5}} color={"white"}/>}
                                                gd={{border: 'none'}}
                                        >
                                        </Button>
                                    )
                                }
                            </Flex>
                        </Flex>
                    ))}
                </Grid>
            ) : numberSelected === 1 ? (

                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {favoriteAlbums && favoriteAlbums.map((album, index) => (
                        <AlbumCard album={album} key={index}/>
                    ))}
                </Grid>

            ) : numberSelected === 2 ? (
                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {favoritePlayLists && favoritePlayLists.map((playlist, index) => (
                        <PlaylistCard
                            playlist={playlist}
                            key={index}
                            listenCount={playlistListenCountsFav[playlist.playlistId] || 0}
                        />
                    ))}
                </Grid>
            ) : (
                <Group className="song-artists">
                    <Flex gap="20px" wrap>
                        {favoriteArtists?.map(artist => (
                            <Card
                                className="circle"
                                key={artist.artistId}
                                shape="circle"
                                srcImg={artist.avatar}
                                urlLink={`/artists/${artist.artistId}`}
                                LinkComponent={Link}
                                alt={artist.artistName}
                                title={artist.artistName} />
                        ))}
                    </Flex>
                </Group>
                )

            }`
        </Container>
    );
}