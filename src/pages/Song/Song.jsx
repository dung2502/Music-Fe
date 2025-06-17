import {Avatar, Button, Card, Container, Flex, Grid, Group, Typography} from "lvq";
import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as songService from "../../core/services/SongService";
import "./Song.scss";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import * as favoriteService from "../../core/services/FavoriteService";
import {toast} from "react-toastify";
import {FiUserPlus} from "react-icons/fi";
import {add} from "react-modal/lib/helpers/classList";
import * as authenticationService from "../../core/services/AuthenticationService";
import {IoIosHeart, IoIosHeartEmpty} from "react-icons/io";

export function Song() {
    const {
        playSongList,
        songIndexList,
        addSongList,
        changeSongIndex,
        toggleIsPlayingSong,
        isPlayingSong,
    } = usePlayMusic();
    const { id } = useParams();
    const [song, setSong] = useState({});
    const [totalFavSong, setTotalFavSong] = useState({});
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (song) {
            setIsFavorited(song.userFavoriteStatus || false);
        }
    }, [song]);

    const chartData = song.songListens?.map(item => ({
        date: new Date(item.dateCreate).toLocaleDateString('vi-VN'),
        listens: item.total
    }));


    useEffect(() => {
        const fetchData = async () => {
            await getSongById(id);
        };
        fetchData();
    }, [id]);


    useEffect(() => {
        const fetchData = async () => {
            await getTotalFavSong(id);
        };
        fetchData();
    }, [id]);



    const getSongById = async (id) => {
        const temp = await songService.getSongById(id);
        setSong(temp);
    };

    const getTotalFavSong = async (songId) => {
        let temp = await  songService.getTotalFavSongBySongId(songId)
        setTotalFavSong(temp);
    }

    const getFavoriteSongsList = async (sort, direction,page,size) => {
        const temp = await songService.getAllFavoriteSongs(sort, direction,page,size);
        setFavoriteSongs(temp.content);
    }
    useEffect(() => {
        const fetchData = async () => {
            await getFavoriteSongsList('','DESC',0,100)
        }
        fetchData().then().catch(console.error);
    }, []);
    
    useEffect(() => {
        if (favoriteSongs && song.songId) {
            const isFav = favoriteSongs.some(favSong => favSong.songId === song.songId);
            setIsFavorited(isFav);
        }
    }, [favoriteSongs, song]);

    const addNewFavoriteSongById = async (song) => {
        console.log(song.songId);
        try {
            const response = await favoriteService.addFavoriteSongBySongId(song.songId);
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

    const handlePlaySong = () => {
        addSongList([song]);
        changeSongIndex(0);
        toggleIsPlayingSong(true);
    };

    return (
        <Container withShadow={false} className="song-container">
            <Grid columns={2}>
                <Flex className="song-main" gap={24} wrap>
                    <Card className="song-picture" srcImg={song.coverImageUrl} />
                    <Group className="song-details">
                        <Typography tag="h1" className="song-title">{song.title}</Typography>
                        <Typography className="song-artist">
                            Nghệ sĩ: {song.artists?.map((artist, index) => (
                            <Link key={artist.artistId} to={`/artists/${artist.artistId}`}>
                                {artist.artistName}{index !== song.artists.length - 1 && ', '}
                            </Link>
                        ))}
                        </Typography>
                        <Typography className="song-duration">Thời lượng: {((song.duration) / 60).toFixed(2).replace('.', ':')}</Typography>
                        <Button onClick={handlePlaySong} text="Phát bài hát" className="song-play-button" />
                        {authenticationService.isAuthenticated() && (
                            <Button
                                className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                                icon={isFavorited ? <IoIosHeart size={18}/> : <IoIosHeartEmpty size={18}/>}
                                text={isFavorited ? 'Đã quan tâm' : 'Quan tâm'}
                                onClick={(e) => {
                                    if (isFavorited) {
                                        deleteFavoriteSong(song);
                                    } else {
                                        addNewFavoriteSongById(song);
                                    }
                                }}
                            />
                        )}
                    </Group>
                </Flex>
                <Group className="song-chart">
                    <Typography tag="h2">Lượt nghe theo thời gian</Typography>
                    <ResponsiveContainer width="90%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="listens" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Group>
            </Grid>
            <Grid columns={2}>
                <Card className="song-info-inner">
                    <Typography tag="h3">Album</Typography>
                    <Link to={`/albums/${song.album?.albumId}`}>
                        <Typography>{song.album?.title}</Typography>
                    </Link>

                    <Typography tag="h3">Ngày phát hành</Typography>
                    <Typography>{new Date(song.dateCreate).toLocaleDateString()}</Typography>

                    <Typography tag="h3">Thể loại</Typography>
                    <Typography>{song.genres?.map(g => g.genreName).join(', ')}</Typography>

                    <Typography tag="h3">Số lượt yêu thích</Typography>
                    <Typography>{Number(totalFavSong) || 0}</Typography>
                </Card>
                <Group className="song-lyrics">
                    <Typography

                         tag="h2">Lời bài hát</Typography>
                    <div
                        className="lyrics-content"
                        dangerouslySetInnerHTML={{ __html: song.lyrics }}
                    />
                </Group>
            </Grid>
            <Group className="song-artists">
                <Typography tag="h2">Nghệ sĩ tham gia</Typography>
                <Flex gap="20px" wrap>
                    {song.artists?.map(artist => (
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
        </Container>
    );
}