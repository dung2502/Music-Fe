import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Container, Flex, Grid, Button, Card, Typography, Group} from "lvq";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {MdArrowForwardIos} from "react-icons/md";
import * as albumsService from "../../core/services/AlbumService";
import * as songService from "../../core/services/SongService";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {LiaMicrophoneAltSolid} from "react-icons/lia";
import {IoIosHeart} from "react-icons/io";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import wave from "../../assets/gif/icon-playing.gif";
import {FaPlay} from "react-icons/fa";
import ModalSongMenu from "../../components/Modal/ModalSongMenu";
import AlbumCard from "../../components/AlbumAndPlayListCard/AlbumCard";
import SongCard from "../../components/SongCard/SongCard";

function HomePage() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1200,
        pauseOnHover: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const [albums, setAlbums] = useState([]);
    const [suggestedSongs, setSuggestedSongs] = useState([]);
    const [recentListens, setRecentListens] = useState([]);
    const [top100Songs, setTop100Songs] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
                    await getAllAlbumsFromService();
                    await getAllSongSuggested();
        };
        fetchData();

    }, [])

    useEffect(() => {
        const fetchRecentListens = async () => {
            const data = await songService.getRecentUserListens();
            setRecentListens(data);
        };

        fetchRecentListens().catch(console.error);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getNew100Songs();
        }
        fetchData();
    }, []);

    const getAllAlbumsFromService = async () => {
        const temp = await albumsService.getAllSuggestedAlbums();
        setAlbums(temp);
    }

    const getAllSongSuggested = async () => {
        const temp = await songService.getAllSuggestedSongs();
        setSuggestedSongs(temp);
    }

    const getNew100Songs = async () => {
        const temp = await songService.getTop100Songs();
        setTop100Songs(temp);
    }

    return (
        <>
            <Container withShadow={false} gd={{overflow: "hidden"}}>
                <Slider {...settings}>
                    <Card
                        srcImg="https://photo-zmp3.zmdcdn.me/banner/e/9/0/b/e90bda49a4e6618b4b607a83131d11d2.jpg"></Card>
                    <Card
                        srcImg="https://photo-zmp3.zmdcdn.me/banner/2/d/2/d/2d2ddc0508828b26f6e59e8dd8395583.jpg"></Card>
                    <Card
                        srcImg="https://photo-zmp3.zmdcdn.me/banner/5/0/3/b/503b76b9c1d5102e06fe07c26b507a5c.jpg"></Card>
                </Slider>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Nghe Gần Đây</Typography>
                    <Link to="/history">
                        <Button gd={{ color: "white"}}
                            text="Tất cả"
                            theme="transparent"
                            size={1}
                            icon={<MdArrowForwardIos />}
                            iconPosition="right"
                            gap={1}
                        />
                    </Link>
                </Flex>
                <Grid columns={1} xs={2} md={4} xl={8} gap={6}>
                    {recentListens.slice(0, 8).map((listen, index) => (
                        <Card
                            key={index}
                            srcImg={listen.song.coverImageUrl}
                            title={listen.song.title}
                            urlLink={`/song/${listen.song.songId}`}
                            LinkComponent={Link}
                            description={listen.song.artists.map(artist => artist.artistName).join(", ")}
                        />
                    ))}
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Gợi Ý Dành Cho Bạn</Typography>
                    <Link to={"/new-release/songs"} gd={{color: "var(--color-text)"}}>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos/>} iconPosition="right"
                                                                 gap={1} gd={{color: "var(--color-text)"}}/>
                    </Link>
                </Flex>
                <Grid columns={1} md={2} xl={3} gap={6}>
                    {suggestedSongs && suggestedSongs.map((song, index) => (
                        <SongCard songList={suggestedSongs} song={song} index={index}/>
                    ))}
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Có thể bạn muốn nghe</Typography>
                    <Link to={"/new-release/albums"} gd={{color: "var(--color-text)"}}>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos/>} iconPosition="right"
                                gap={1} gd={{color: "var(--color-text)"}}/>
                    </Link>
                </Flex>
                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {albums && albums.map((album, index) => (
                        <AlbumCard album={album} key={index}/>
                    ))}
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Mới phát hành</Typography>
                    <Link to={"/new-release/songs"} gd={{color: "var(--color-text)"}}>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos/>} iconPosition="right"
                                gap={1} gd={{color: "var(--color-text)"}}/>
                    </Link>
                </Flex>
                <Grid columns={1} sm={2} xl={3} gap={6}>
                    {suggestedSongs && suggestedSongs.map((song, index) => (
                        <SongCard songList={suggestedSongs} song={song} index={index}/>
                    ))}
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Nhạc Hot Gây Bão</Typography>
                    <Link to={"/top-100-songs"} gd={{color: "var(--color-text)"}}>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos/>} iconPosition="right"
                                gap={1} gd={{color: "var(--color-text)"}}/>
                    </Link>
                </Flex>
                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {albums && albums.map((album, index) => (
                        <AlbumCard album={album} key={index}/>
                    ))}
                </Grid>
            </Container>

        </>
    );
}

export default HomePage;