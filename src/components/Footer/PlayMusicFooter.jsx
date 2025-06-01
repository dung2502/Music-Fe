import { AudioPlayer, AudioToolbar, Button, Card, Flex, Grid, Group, Input, RenderIf, Typography, useResponsive } from "lvq";
import { CiHeart, CiMenuKebab } from "react-icons/ci";
import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import React, { useEffect, useRef, useState } from "react";
import {IoPause, IoPlaySkipForwardSharp} from "react-icons/io5";
import {IoIosHeart, IoMdPlay} from "react-icons/io";
import * as songService from "../../core/services/SongService";
import * as favoriteService from "../../core/services/FavoriteService";
import {toast} from "react-toastify";


export function PlayMusicFooter({ callPlayLyrics, callPlayList, openMenuSongFooter }) {
    const audioPlayerRef = useRef(null);
    const [hasReachedHalf, setHasReachedHalf] = useState(false);  // Đánh dấu xem đã đạt đến một nửa thời gian phát thực tế chưa
    const [playTime, setPlayTime] = useState(0);  // Bộ đếm thời gian phát thực tế
    const playIntervalRef = useRef(null);
    const breakpoints = useResponsive([480, 640, 768, 1024, 1280, 1536])
    const {
        playSongList,
        songIndexList,
        isPlayingSong,
        audioRef,
        toggleIsPlayingSong,
        changeSongIndex
    } = usePlayMusic();

    // Hàm cập nhật lượt nghe
    const updatePlayCount = async () => {
        await songService.updateListens(playSongList[songIndexList].songId);
    };
    // Hàm Theo dõi lịch sử nghe nhạc của người dùng.
    const updateUserListen = async () => {
        console.log("Updating user listen");
        await songService.updateUserListens(playSongList[songIndexList].songId);
    };


    // Hàm bắt đầu bộ đếm thời gian phát thực tế
    const startCountingPlayTime = () => {
        if (!playIntervalRef.current) {
            playIntervalRef.current = setInterval(() => {
                setPlayTime(prevTime => prevTime + 1);
            }, 1000); // Tính thời gian phát theo giây
        }
    };

    const stopCountingPlayTime = () => {
        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
        }
    };

    // Theo dõi khi bài hát phát hoặc tạm dừng để cập nhật bộ đếm thời gian
    useEffect(() => {
        if (isPlayingSong) {
            startCountingPlayTime();
        } else {
            stopCountingPlayTime();
        }

        return () => stopCountingPlayTime(); // Dừng khi component unmount
    }, [isPlayingSong]);

    // Khi tổng thời gian phát lớn hơn hoặc bằng nửa bài hát thì cập nhật lượt nghe
    useEffect(() => {
        if (audioRef.current) {
            const songDuration = audioRef.current.duration;
            if (playTime >= songDuration / 2 && !hasReachedHalf) {
                setHasReachedHalf(true);
                const fetchData = async ()=> {
                    await updatePlayCount();
                    await updateUserListen();
                }
                fetchData();
            }
        }
    }, [playTime, audioRef, playSongList, songIndexList, hasReachedHalf]);

    // Reset lại bộ đếm và trạng thái khi chuyển sang bài hát mới
    useEffect(() => {
        setPlayTime(0);
        setHasReachedHalf(false);
    }, [songIndexList]);

    const audioPlayerState = JSON.parse(localStorage.getItem("audioPlayerState"));
    const [isRandom, setIsRandom] = useState(audioPlayerState !== null ? audioPlayerState.random : false);
    const [loopSong, setLoopSong] = useState(audioPlayerState !== null ? audioPlayerState.loop : 0);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);


    const handleChangeSong = (value) => {
        if (value === -1) {
            handleBackSong();
        } else {
            handleNextSong();
        }
    }


    const handleBackSong = () => {
        const newIndex = (songIndexList - 1 + playSongList.length) % playSongList.length;
        changeSongIndex(newIndex);
    }

    const handleNextSong = () => {
        let newIndex;
        if (isRandom) {
            do {
                newIndex = Math.floor(Math.random() * playSongList.length);
            } while (newIndex === songIndexList);
            console.log(newIndex)
        } else {
            newIndex = (songIndexList + 1) % playSongList.length;
        }
        changeSongIndex(newIndex);
    }

    const handleChangeMusicWhenEndSong = () => {
        let newIndex;
        if (isRandom) {
            do {
                newIndex = Math.floor(Math.random() * playSongList.length);
            } while (newIndex === songIndexList);
            console.log(newIndex)
            changeSongIndex(newIndex);
            return;
        }

        if (songIndexList === playSongList.length - 1) {
            if (loopSong === 1) {

            } else if (loopSong === 2) {
                changeSongIndex(0);
            } else {
                toggleIsPlayingSong(false);
            }
        } else {
            if (loopSong === 1) {

            } else {
                newIndex = (songIndexList + 1) % playSongList.length;
                changeSongIndex(newIndex);
            }
        }
    }

    const handleRandomSong = (value) => {
        console.log(value);
        const random = value;
        setIsRandom((prevState) => prevState === random);
    }

    const handleLoopSong = (value) => {
        setLoopSong(value);
    }

    const handleSetVolume = (volume) => {
        if (audioRef.current) {
            audioRef.current.volume = volume; // Điều chỉnh volume của audio
        }
    };
    const showPlayLyrics = () => {
        callPlayLyrics();
    }

    const showPlayList = () => {
        callPlayList();
    }

    const handlePlaySong = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    }

    const openSongMenu = () => {
        openMenuSongFooter(true);
    }

    const addNewFavoriteSong = async (song) => {
        await favoriteService.addFavoriteSong(song);
        toast.success("Đã cập nhật bài hát yêu thích mới");

    }

    return (
        <Grid columns={1} md={2} lg={3} gap={4} alignItems="center" className="w-full h-full c-m-0">
            <Card className="" srcImg={playSongList[songIndexList].coverImageUrl}
                  title={playSongList[songIndexList]?.title.length > 15 ? `${playSongList[songIndexList]?.title.substring(0, 15)}...` : playSongList[songIndexList]?.title}
                long description={
                    playSongList[songIndexList]?.artists.map((artist, index) => (
                        <Typography tag={"span"} gd={{ fontSize: '.8rem' }} key={artist.artistId}>
                            {artist.artistName}
                            {index !== playSongList[songIndexList].artists.length - 1 && <Typography tag={'span'}>, </Typography>}
                        </Typography>
                    ))} sizeImg={56}
                  onClick={window.innerWidth < 768 ? showPlayLyrics : null}
            >
                <Button className={'card-icon heart'} type={'button'}
                        theme={'reset'}
                        icon={<IoIosHeart size={24} fill={playSongList[songIndexList].userFavoriteStatus ? "red" : "white"}/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            addNewFavoriteSong(playSongList[songIndexList])
                        }}>
                </Button>

                {
                    window.innerWidth < 768 &&
                    <Button theme="reset" text=""
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlaySong();
                            }}
                            icon={
                                isPlayingSong ? <IoPause size={20} />
                                    : <IoMdPlay size={20} />
                            }
                            gd={{
                                borderRadius: '50%',
                                padding: 5,
                            }}
                    />
                }
                {
                    window.innerWidth < 768 ?
                        <Button theme="reset" text=""
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeSong(1);
                                }}
                                icon={<IoPlaySkipForwardSharp size={20} />}
                                gd={{
                                    borderRadius: '50%',
                                    padding: 5,
                                }}
                        />
                        :
                        <Button theme="reset" text="" icon={<CiMenuKebab size={22} />}
                                id={`active-song-menu-${playSongList[songIndexList].songId}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openSongMenu()
                                }}
                        />
                }
            </Card>
            <RenderIf isTrue={[3, 4, 5, 6].includes(breakpoints)} hiddenCSS>
                <AudioPlayer
                    ref={audioRef}
                    isPlay={isPlayingSong}
                    onEnded={handleChangeMusicWhenEndSong}
                    audioSrc={playSongList[songIndexList]?.songUrl}
                    onSwitchAudio={(value) => handleChangeSong(value)}
                    onRandomChange={(e) => handleRandomSong(e)}
                    onLoopChange={e => handleLoopSong(e)}
                />
            </RenderIf>
            <RenderIf isTrue={[4, 5, 6].includes(breakpoints)}>
                <AudioToolbar onVolumeChange={(volume) => handleSetVolume(volume)}
                              gd={{ marginLeft: "auto" }}
                              onClickLyric={showPlayLyrics}
                              onClickPlaylist={showPlayList}
                />
            </RenderIf>
        </Grid>
    )
}