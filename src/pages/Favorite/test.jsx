import {Avatar, Button, Card, Container, Flex, Grid, Group, Input, Pagination, Table, Typography} from "lvq";
import React, {useEffect, useState} from "react";
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
import * as artistService from "../../core/services/ArtistService";
import * as PlaylistService from "../../core/services/PlayListService";
import PlaylistCard from "../../components/AlbumAndPlayListCard/PlaylistCard";
import SongCard from "../../components/SongCard/SongCard";

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


    useEffect(() => {

        const fetchData = async () => {
            await getFavoriteArtistList('','DESC',0,9);
        }
        fetchData();
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            if (numberSelected === 0) {
                await getFavoriteSongsList('','DESC',0,100);
            } else if(numberSelected === 1) {
                await getFavoriteAlbumList('','DESC',0,100);
            }else{
                await getFavoritePlaylist('','DESC',0,100);
            }

        }
        fetchData().then().catch(console.error);
    }, [numberSelected]);

    const getFavoriteSongsList = async (sort, direction,page,size) => {
        const temp = await songService.getAllFavoriteSongs(sort, direction,page,size);
        setFavoriteSongs(temp.content);
    }

    const getFavoriteAlbumList = async (sort, direction,page,size) => {
        const temp = await albumService.getAllFavoriteAlbums(sort, direction,page,size);
        setFavoriteAlbums(temp.content);
    }
    const getFavoritePlaylist = async (sort, direction,page,size) => {
        const temp = await PlaylistService.getAllFavoritePlaylists(sort, direction,page,size);
        setFavoritePlaylists(temp.content);
    }

    const getFavoriteArtistList = async (sort, direction,page,size) => {
        const temp = await artistService.getAllFavoriteArtists(sort, direction,page,size);
        setFavoriteArtists(temp.content);
    }

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

    const removeFromFavoriteSong = (song) => {

    }


    const columns = [
        {
            key: 'title',
            header: 'BÀI HÁT',
            render: (row) => <Flex>
                <Typography gd={{fontSize:"15px", padding:"20px 5px"}}>
                    <RiMusic2Line />
                </Typography>
                <Card srcImg={row?.songDTO.coverImageUrl} shape={"square"} sizeImg={50}
                      title={<Flex>
                          <Typography>
                              {row.songDTO.title}
                          </Typography>
                          <Typography>
                              Premium
                          </Typography>
                      </Flex>}
                      long={true}
                      description={row?.songDTO.artists.map(artist => (
                          <a href="/public" key={artist.artistId}>{artist.artistName}, </a>
                      ))}/>
            </Flex>,
        },
        {
            key: 'album',
            header: 'ALBUM',
            render: (row) => row.songDTO.album.title
        },
        {
            key: 'thời gian',
            header: <Flex right={true}>THỜI GIAN</Flex>,
            render: (row) => <Flex right={true}><AiFillHeart style={{color:"#ec4899"}}/><TimeExtractor dateTime={row.addedAt}/></Flex>
        }
    ];

    return (
        <Container>
            <Group>
                <Typography tag="h1" gd={{fontSize: "40px", marginBottom:"16px"}}>THƯ VIỆN <AiFillPlayCircle style={{paddingTop:"10px"}}/></Typography>
                <Flex gap={"7"} gd={{ marginBottom:"16px"}}>
                    {favoriteArtists && favoriteArtists.map((artist, index) => (
                        <Card title={artist.artistName} key={index}
                              srcImg={artist.avatar}
                              shape={"circle"} sizeImg={130} gd={{ width: "16,666%"}}
                              urlLink={`/artists/${artist.artistName}`}
                        />
                    ))}
                    <Group gd={{textAlign: "center", width: "16,666%"}}>
                        <Typography gd={{
                            borderRadius: "50%",
                            border: "1px solid",
                            width: "130px",
                            height: "130px",
                            fontSize: "30px",
                            paddingTop: "50px"
                        }}>
                            <AiOutlineArrowRight/>
                        </Typography>
                        <Typography gd={{paddingRight :'36px'}}>Xem tất cả</Typography>
                    </Group>
                </Flex>
            </Group>
            <Group gd={{marginBottom:"30px"}}>
                <Flex between={true} gd={{marginBottom:"20px"}}>
                    <Typography tag={"h1"} gd={{fontSize:"25px"}}>PLAYLIST <AiFillPlusCircle style={{paddingTop:"10px",fontSize:"30px"}}/></Typography>
                    <Typography tag={"p"} gd={{fontSize:"15px",color:"#333"}}>Tất cả <AiOutlineRight style={{marginTop:"5px"}}/></Typography>
                </Flex>
                <Flex gap={7} >
                    <Card srcImg={"https://e1.pxfuel.com/desktop-wallpaper/424/1010/desktop-wallpaper-all-things-spotify-playlist-covers-aesthetic-playlist-covers.jpg"} sizeImg={200} title={"4U - On Repeat"} description={<Typography tag={"p"} gd={{color:"#ccc"}}>Zing MP3</Typography>}/>
                    <Card srcImg={"https://e1.pxfuel.com/desktop-wallpaper/424/1010/desktop-wallpaper-all-things-spotify-playlist-covers-aesthetic-playlist-covers.jpg"} sizeImg={200} title={"4U - On Repeat"} description={<Typography tag={"p"} gd={{color:"#ccc"}}>Zing MP3</Typography>}/>
                </Flex>
            </Group>
            <Flex gap={8} gd={{borderBottom:"1px solid white",marginBottom:"30px", padding: "5px 0"}}>
                <Button theme={"reset"}
                        gd={numberSelected === 0 ? {color: "#fff"} : {}}
                        onClick={()=>setNumberSelected(0)}
                        text={"BÀI HÁT"}
                ></Button>
                <Button theme={"reset"}
                        gd={numberSelected === 1 ? {color: "#fff"} : {}}
                        onClick={()=>setNumberSelected(1)}
                        text={"ALBUM"}
                ></Button>
                <Button theme={"reset"}
                        gd={numberSelected === 2 ? {color: "#fff"} : {}}
                        onClick={()=>setNumberSelected(1)}
                        text={"PLAYLIST"}
                ></Button>
            </Flex>
            <Flex gd={{marginBottom:"30px"}}>
                <Typography tag="p" gd={{color:"#fff", textAlign:"center", width:'100px', height:'25px',borderRadius:'30px', border:'1px solid black', background:"#ec4899",fontSize:"13px", paddingTop:'3px'}}>BÀI HÁT</Typography>
                <Typography tag="p" gd={{color:"#fff", textAlign:"center", width:'100px', height:'25px',borderRadius:'30px', border:'1px solid black',fontSize:"13px", paddingTop:'3px'}}>ĐÃ TẢI LÊN</Typography>
            </Flex>
            {numberSelected === 0 ?
                <Grid  columns={1} md={2} xl={3} gap={6}>
                    {favoriteSongs && favoriteSongs.map((song, index) => (
                        <SongCard songList={favoriteSongs} key={index} song={song} />
                    ))}
                </Grid>
                :
                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {favoriteAlbums && favoriteAlbums.map((album, index) => (
                        <AlbumCard album={album} key={index}/>
                    ))}
                </Grid>
            }
        </Container>
    );
}