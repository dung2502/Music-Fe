import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Container, Flex, Grid, Button, Card, Typography} from "lvq";
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


const featuredItems = [
    {
        title: "BXH Nhạc Mới",
        className: "bg-blue",
    },
    {
        title: "Top 100",
        className: "bg-purple",
    },
    {
        title: "Nhạc Cover",
        className: "bg-brown",
    },
    {
        title: "Nhạc Trẻ",
        className: "bg-orange",
    },
];
const additionalItems = [
    {
        title: "Nhạc Xuân",
        className: "bg-xuan",
    },
    {
        title: "Nhạc Trẻ",
        className: "bg-tre",
    },
    {
        title: "Nhạc Vui",
        className: "bg-vui",
    },
    {
        title: "Nhạc Buồn",
        className: "bg-buon",
    },
];
const National = [
    {
        title: "Nhạc Việt",
        image: VN,
    },
    {
        title: "Nhạc Hàn Quốc",
        image: HQ,
    },
    {
        title: "Nhạc Âu Mỹ",
        image: US,
    },
];
const Emotion  = [
    {
        title: "DINNER",
        image: DINNER,
    },
    {
        image: RUNNING,
    },
    {
        image: GYM,
    },
    {
        image: GAME,
    },
    {
        title: "COFFEE",
        image: COFFEE,
    },
    {
        image: TRAVEL,
    },
    {
        image: PARTY,
    },
    {
        image: CONCENTRATE,
    },
];

function Hub() {

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

    useEffect(() => {
        const fetchData = async () => {
                    await getAllAlbumsFromService();
                    await getAllSongSuggested();
        };
        fetchData();

    }, [])

    const getAllAlbumsFromService = async () => {
        const temp = await albumsService.getAllSuggestedAlbums();
        setAlbums(temp);
    }

    const getAllSongSuggested = async () => {
        const temp = await songService.getAllSuggestedSongs();
        setSuggestedSongs(temp);
    }
    const [showMore, setShowMore] = useState(false);


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
                    <Typography tag="h2">Nổi Bật</Typography>
                </Flex>

                <Grid columns={4} rows={showMore ? 3 : 2} gap={6}>
                    {featuredItems.map((item, index) => (
                        <div
                            key={index}
                            className={`featured-card ${item.className || ""}`}
                        >
                            {item.title}
                        </div>
                    ))}

                    {showMore && additionalItems.map((item, index) => (
                        <div key={index} className={`featured-card ${item.className || ""}`}>
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
            <Grid columns={3} rows={showMore ? 3 : 2} gap={6}>
                {National.map((item, index) => (
                    <div
                        key={index}
                        className={`featured-card ${item.className || ""}`}
                        style={{
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: "white", // Đảm bảo text nổi bật trên ảnh
                            textShadow: "0 0 5px rgba(0,0,0,0.5)" // Tăng độ tương phản cho chữ
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
                            style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                color: "white", // Đảm bảo text nổi bật trên ảnh
                                textShadow: "0 0 5px rgba(0,0,0,0.5)" // Tăng độ tương phản cho chữ
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

        </>
    );
}

export default Hub;