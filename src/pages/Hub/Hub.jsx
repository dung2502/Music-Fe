import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Flex, Grid, Button, Card, Typography } from "lvq";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdArrowForwardIos } from "react-icons/md";
import * as albumsService from "../../core/services/AlbumService";
import * as songService from "../../core/services/SongService";
import * as playlistService from "../../core/services/PlayListService";
import './Hub.css';
import VN from "../../assets/images/hub/Flag_of_Vietnam.svg.png";
import HQ from "../../assets/images/hub/Flag_of_South_Korea.svg.png";
import US from "../../assets/images/hub/Flag_of_the_United_States.svg.png";
import DINNER from "../../assets/images/hub/dinner1.jpg";
import RUNNING from "../../assets/images/hub/runninf.jpg";
import GYM from "../../assets/images/hub/gym.jpg";
import GAME from "../../assets/images/hub/game1.jpg";
import COFFEE from "../../assets/images/hub/coffee.jpg";
import TRAVEL from "../../assets/images/hub/travel.jpg";
import PARTY from "../../assets/images/hub/party.jpg";
import CONCENTRATE from "../../assets/images/hub//maxresdefault.jpg";
import TopSongCard from "../../components/TopSongs/TopSongCard";
import PlaylistCard from "../../components/AlbumAndPlayListCard/PlaylistCard";

const BaseUrl = "http://localhost:3000/";

const featuredItems = [
    { title: "BXH Nhạc Mới", className: "bg-blue", link: `${BaseUrl}/new-songs-ratings` },
    { title: "Top 100", className: "bg-purple", link: `${BaseUrl}/top-100-songs` },
    { title: "Nhạc Cover", className: "bg-brown", link: `${BaseUrl}/top-100-songs` },
    { title: "Nhạc Trẻ", className: "bg-orange", link: `${BaseUrl}/top-100-songs` },
];
const additionalItems = [
    { title: "Nhạc Xuân", className: "bg-xuan", link: `${BaseUrl}/albums/1` },
    { title: "Nhạc Trẻ", className: "bg-tre", link: `${BaseUrl}/albums/1` },
    { title: "Nhạc Vui", className: "bg-vui", link: `${BaseUrl}/albums/1` },
    { title: "Nhạc Buồn", className: "bg-buon", link: `${BaseUrl}/albums/1` },
];
const National = [
    { title: "Nhạc Việt", image: VN, link: `${BaseUrl}/m-chart-week/Việt Nam` },
    { title: "Nhạc Hàn Quốc", image: HQ, link: `${BaseUrl}/m-chart-week/Hàn Quốc` },
    { title: "Nhạc Âu Mỹ", image: US, link: `${BaseUrl}/m-chart-week/Âu Mỹ` },
];
const Emotion = [
    { title: "DINNER", image: DINNER, link: `${BaseUrl}/albums/1` },
    { image: RUNNING, link: `${BaseUrl}/albums/1` },
    { image: GYM, link: `${BaseUrl}/albums/1` },
    { image: GAME, link: `${BaseUrl}/albums/1` },
    { title: "COFFEE", image: COFFEE, link: `${BaseUrl}/albums/1` },
    { image: TRAVEL, link: `${BaseUrl}/albums/1` },
    { image: PARTY, link: `${BaseUrl}/albums/1` },
    { image: CONCENTRATE, link: `${BaseUrl}/albums/1` },
];

function Hub() {
    const navigate = useNavigate();
    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [playlistListenCounts, setPlaylistListenCounts] = useState({});
    const [songListenCounts, setSongListenCounts] = useState({});
    const isAuthenticated = !!localStorage.getItem('user');


    const getSixSongsHighListening = async () => {
        const temp = await songService.getSixSongsBest();
        setSongs(temp);
        const listenCounts = {};
        for (const song of temp){
            const count = await songService.getTotalSongListenBySongId(song.songId)
            listenCounts[song.songId] = count;
        }
        setSongListenCounts(listenCounts);
    };

    const getAllAlbumsFromService = async () => {
        const temp = await albumsService.getAllSuggestedAlbums();
        setAlbums(temp);
    };

    const getAllPlaylists = async () => {
        const temp = await playlistService.getAllPlaylists();
        setPlaylists(temp);
        const listenCounts = {};
        for (const playlist of temp) {
            const count = await playlistService.getTotalPlaylistListens(playlist.playlistId);
            listenCounts[playlist.playlistId] = count;
        }
        setPlaylistListenCounts(listenCounts);
    };


    useEffect(() => {
        const fetchData = async () => {
            await getAllAlbumsFromService();
            await getSixSongsHighListening();
            if (isAuthenticated) {
                await getAllPlaylists();
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Container withShadow={false} gd={{ overflow: "hidden" }}>
                <Slider {...settings}>
                    <Card srcImg="https://photo-zmp3.zmdcdn.me/banner/e/9/0/b/e90bda49a4e6618b4b607a83131d11d2.jpg" />
                    <Card srcImg="https://photo-zmp3.zmdcdn.me/banner/2/d/2/d/2d2ddc0508828b26f6e59e8dd8395583.jpg" />
                    <Card srcImg="https://photo-zmp3.zmdcdn.me/banner/5/0/3/b/503b76b9c1d5102e06fe07c26b507a5c.jpg" />
                </Slider>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Nổi Bật</Typography>
                </Flex>
                <Grid columns={4} rows={showMore ? 3 : 2} gap={6}>
                    {featuredItems.map((item, index) => (
                        <div
                            key={index}
                            className={`featured-card ${item.className || ""}`}
                            onClick={() => navigate(item.link.replace(BaseUrl, ""))}
                            style={{ cursor: "pointer" }}
                        >
                            {item.title}
                        </div>
                    ))}
                    {showMore && additionalItems.map((item, index) => (
                        <div
                            key={index}
                            className={`featured-card ${item.className || ""}`}
                            onClick={() => navigate(item.link.replace(BaseUrl, ""))}
                            style={{ cursor: "pointer" }}
                        >
                            {item.title}
                        </div>
                    ))}
                    <div style={{ gridColumn: "1 / span 4", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button
                            text={showMore ? "Ẩn" : "Tất cả"}
                            theme="transparent"
                            size={3}
                            icon={showMore ? null : <MdArrowForwardIos />}
                            iconPosition="right"
                            gap={1}
                            onClick={() => setShowMore(prev => !prev)}
                        />
                    </div>
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Quốc Gia</Typography>
                </Flex>
                <Grid columns={3} rows={2} gap={6}>
                    {National.map((item, index) => (
                        <div
                            key={index}
                            className={`featured-card ${item.className || ""}`}
                            onClick={() => navigate(item.link.replace(BaseUrl, ""))}
                            style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                color: "white",
                                textShadow: "0 0 5px rgba(0,0,0,0.5)",
                                cursor: "pointer"
                            }}
                        >
                            {item.title}
                        </div>
                    ))}
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Tâm Trạng Và Hoạt Động</Typography>
                </Flex>
                <Grid columns={4} rows={2} gap={6}>
                    {Emotion.map((item, index) => (
                        <div
                            key={index}
                            className={`featured-card ${item.className || ""}`}
                            onClick={() => navigate(item.link.replace(BaseUrl, ""))}
                            style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                color: "white",
                                textShadow: "0 0 5px rgba(0,0,0,0.5)",
                                cursor: "pointer"
                            }}
                        >
                            {item.title}
                        </div>
                    ))}
                </Grid>
            </Container>

            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Nhạc Hot Gây Bão</Typography>
                    <Link to={"/top-100-songs"} gd={{ color: "var(--color-text)" }}>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos />} iconPosition="right" gap={1} gd={{ color: "var(--color-text)" }} />
                    </Link>
                </Flex>
                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {songs && songs.map((song, index) => (
                        <TopSongCard
                            listenCount={songListenCounts[song.songId] || 0}
                            songList={songs}
                            song={song}
                            key={index} />
                    ))}
                </Grid>
            </Container>

            {isAuthenticated && (
            <Container withShadow={false}>
                <Flex alignItems="center" justifyContent="between">
                    <Typography tag="h2">Danh Sách Phát Mọi Người Tạo</Typography>
                    <Link to={"/new-release/songs"} gd={{ color: "var(--color-text)" }}>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos />} iconPosition="right" gap={1} gd={{ color: "var(--color-text)" }} />
                    </Link>
                </Flex>
                <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                    {playlists && playlists.map((playlist, index) => (
                        <PlaylistCard
                            playlist={playlist}
                            key={index}
                            listenCount={playlistListenCounts[playlist.playlistId] || 0}
                        />
                    ))}
                </Grid>

            </Container>
            )}
        </>
    );
}
export default Hub;
