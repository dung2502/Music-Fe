import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Container,
    Flex,
    Group,
    Typography
} from "lvq";
import {
    FaAngleDown,
    FaCommentDots,
    FaPlay
} from "react-icons/fa";
import { HiMiniEllipsisHorizontal } from "react-icons/hi2";

import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import wave from "../../assets/gif/icon-playing.gif";
import ModalSongMenu from "../Modal/ModalMenu/ModalSongMenu";
import * as songService from "../../core/services/SongService";
import "./PlayQueue.css";

export function PlayQueue({ showPlayList }) {
    const [isOpenQueue, setIsOpenQueue] = useState(showPlayList);
    const [activeButton, setActiveButton] = useState(1);
    const [modalSongIndex, setModalSongIndex] = useState(0);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);
    const [recentListens, setRecentListens] = useState([]);

    const {
        playSongList,
        songIndexList,
        isPlayingSong,
        audioRef,
        toggleIsPlayingSong,
        changeSongIndex,
        addSongList,
    } = usePlayMusic();

    useEffect(() => {
        setIsOpenQueue(showPlayList);
    }, [showPlayList]);

    useEffect(() => {
        const fetchRecentListens = async () => {
            const data = await songService.getRecentUserListens();
            setRecentListens(data);
        };
        fetchRecentListens().catch(console.error);
    }, []);

    const handlePlaySong = () => {
        toggleIsPlayingSong(!isPlayingSong);
    };

    const handlePlaySongIndex = (songs, index) => {
        addSongList(songs);
        changeSongIndex(index);
    };

    const openSongMenu = (songId) => {
        setModalSongIndex(songId);
        setIsOpenSongMenu(true);
    };

    const handleCloseSongMenu = () => {
        setModalSongIndex(0);
        setIsOpenSongMenu(false);
    };

    const renderSongCard = (song, index, songsList) => (
        <Flex className="audio-card" key={song.songId}>
            <Card
                srcImg={song.coverImageUrl}
                title={song.title.length > 17 ? `${song.title.substring(0, 15)}...` : song.title}
                long
                description={song.artists.map((artist, i) => (
                    <Typography tag="span" gd={{ fontSize: ".8rem" }} key={artist.artistId}>
                        {artist.artistName}
                        {i !== song.artists.length - 1 && <Typography tag="span">, </Typography>}
                    </Typography>
                ))}
                sizeImg={56}
                gd={{ margin: "5px 0" }}
                onClick={() => handlePlaySongIndex(songsList, index)}
            />
            <Flex
                justifyContent="center"
                alignItems="center"
                className="audio-play"
                gd={{ width: 56, height: 56, margin: "5px 0" }}
            >
                <Button
                    theme="reset"
                    onClick={() => handlePlaySongIndex(songsList, index)}
                    icon={<FaPlay size={20} style={{ paddingLeft: 5 }} color="white" />}
                />
            </Flex>
        </Flex>
    );

    return (
        <Container withShadow={false} className={isOpenQueue ? "queue active-queue" : "queue"}>
            <Flex center gd={{ height: "5vh", position: "fixed" }}>
                <Flex center className="button-header">
                    <Button
                        theme="reset"
                        text="Danh sách phát"
                        onClick={() => setActiveButton(0)}
                        className={activeButton === 0 ? "button-song active-button" : "button-song"}
                    />
                    <Button
                        theme="reset"
                        text="Nghe gần đây"
                        onClick={() => setActiveButton(1)}
                        className={activeButton === 1 ? "button-song active-button" : "button-song"}
                    />
                </Flex>
                <Button
                    theme="reset"
                    text=""
                    icon={
                        <HiMiniEllipsisHorizontal
                            size={22}
                            onClick={(e) => {
                                e.stopPropagation();
                                openSongMenu(playSongList[songIndexList]?.songId);
                            }}
                        />
                    }
                    className="button-header"
                    gd={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        position: "relative"
                    }}
                />
                {playSongList[songIndexList]?.songId === modalSongIndex && (
                    <ModalSongMenu
                        isOpen={isOpenSongMenu}
                        onClose={handleCloseSongMenu}
                        song={playSongList[songIndexList]}
                    />
                )}
            </Flex>

            <Group className="queue-content" gd={{ marginTop: "5vh", height: "80vh", overflowY: "auto" }}>
                {activeButton === 0 && (
                    <>
                        <Group gd={{ padding: "10px 0" }}>
                            {playSongList.map((song, index) => (
                                index < songIndexList && renderSongCard(song, index, playSongList)
                            ))}
                            <Group className="current-song" gd={{ position: "sticky", top: 0 }}>
                                <Flex className={isPlayingSong ? "audio-card active" : "audio-card"}>
                                    <Card
                                        className="song"
                                        srcImg={playSongList[songIndexList].coverImageUrl}
                                        title={
                                            <Typography tag="p" gd={{ fontSize: ".9rem" }}>
                                                {playSongList[songIndexList]?.title.length > 17
                                                    ? `${playSongList[songIndexList].title.substring(0, 15)}...`
                                                    : playSongList[songIndexList].title}
                                            </Typography>
                                        }
                                        long
                                        description={playSongList[songIndexList]?.artists.map((artist, i) => (
                                            <Typography tag="span" gd={{ fontSize: ".8rem" }} key={artist.artistId}>
                                                {artist.artistName}
                                                {i !== playSongList[songIndexList].artists.length - 1 && (
                                                    <Typography tag="span">, </Typography>
                                                )}
                                            </Typography>
                                        ))}
                                        sizeImg={56}
                                        gd={{ padding: 5 }}
                                    />
                                    <Flex
                                        justifyContent="center"
                                        alignItems="center"
                                        className="audio-play"
                                        gd={{ width: 56, height: 56, margin: "11px 5px" }}
                                    >
                                        <Button
                                            theme="reset"
                                            onClick={handlePlaySong}
                                            icon={
                                                isPlayingSong ? (
                                                    <img src={wave} height={20} alt="wave" />
                                                ) : (
                                                    <FaPlay size={20} style={{ paddingLeft: 5 }} color="white" />
                                                )
                                            }
                                        />
                                    </Flex>
                                </Flex>
                                <Typography tag="p" gd={{ fontSize: ".8rem" }}>
                                    Tiếp theo
                                </Typography>
                                <Typography tag="p" gd={{ fontSize: ".9rem", color: "#cf10b5", marginBottom: 10 }}>
                                    Top 100 Bài hát
                                </Typography>
                            </Group>
                        </Group>
                        <Group className="next-song">
                            {playSongList.map((song, index) => (
                                index > songIndexList && renderSongCard(song, index, playSongList)
                            ))}
                        </Group>
                    </>
                )}

                {activeButton === 1 && (
                    <Group className="recent-songs" gd={{ padding: "10px 0" }}>
                        {recentListens.map((listen, index) =>
                            renderSongCard(listen.song, index, recentListens.map(r => r.song))
                        )}
                    </Group>
                )}
            </Group>
        </Container>
    );
}
