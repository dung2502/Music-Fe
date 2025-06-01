import {Avatar, Button, Card, Container, Flex, Grid, Group, Typography} from "lvq";
import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as songService from "../../core/services/SongService";
import "./Song.scss";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

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

    const getSongById = async (id) => {
        const temp = await songService.getSongById(id);
        setSong(temp);
    };

    const handlePlaySong = () => {
        addSongList([song]);
        changeSongIndex(0);
        toggleIsPlayingSong(true);
    };

    return (
        <Container withShadow={false} className="song-container">
            <Grid columns={2}>
                <Flex className="song-main" gap={24} wrap>
                    <Card className="song-image" srcImg={song.coverImageUrl} />
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
                    </Group>
                </Flex>
                <Group className="song-chart">
                    <Typography tag="h2">Lượt nghe theo thời gian</Typography>
                    <ResponsiveContainer width="100%" height={300}>
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
                </Card>
                <Group className="song-lyrics">
                    <Typography tag="h2">Lời bài hát</Typography>
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
                        <Card key={artist.artistId}
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