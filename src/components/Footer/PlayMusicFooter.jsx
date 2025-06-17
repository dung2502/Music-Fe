import {
    AudioPlayer,
    AudioToolbar,
    Button,
    Card,
    Grid,
    RenderIf,
    Typography,
    useResponsive
} from "lvq";
import {
    CiHeart,
    CiMenuKebab
} from "react-icons/ci";
import {
    IoPause,
    IoPlaySkipForwardSharp
} from "react-icons/io5";
import {
    IoIosHeart,
    IoMdPlay
} from "react-icons/io";
import React, {
    useEffect,
    useRef,
    useState
} from "react";
import { usePlayMusic } from "../../core/contexts/PlayMusicContext";
import * as songService from "../../core/services/SongService";
import * as favoriteService from "../../core/services/FavoriteService";
import { toast } from "react-toastify";

export function PlayMusicFooter({ callPlayLyrics, callPlayList, openMenuSongFooter }) {
    const audioPlayerRef = useRef(null);
    const [hasReachedHalf, setHasReachedHalf] = useState(false);
    const [playTime, setPlayTime] = useState(0);
    const playIntervalRef = useRef(null);
    const breakpoints = useResponsive([480, 640, 768, 1024, 1280, 1536]);

    const {
        playSongList,
        songIndexList,
        isPlayingSong,
        audioRef,
        toggleIsPlayingSong,
        changeSongIndex
    } = usePlayMusic();

    const audioPlayerState = JSON.parse(localStorage.getItem("audioPlayerState"));
    const [isRandom, setIsRandom] = useState(audioPlayerState !== null ? audioPlayerState.random : false);
    const [loopSong, setLoopSong] = useState(audioPlayerState !== null ? audioPlayerState.loop : 0);
    const [playedRandomIndexes, setPlayedRandomIndexes] = useState([]);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);

    // Lưu state vào localStorage
    useEffect(() => {
        localStorage.setItem("audioPlayerState", JSON.stringify({
            random: isRandom,
            loop: loopSong
        }));
    }, [isRandom, loopSong]);

    const updatePlayCount = async () => {
        await songService.updateListens(playSongList[songIndexList].songId);
    };

    const updateUserListen = async () => {
        await songService.updateUserListens(playSongList[songIndexList].songId);
    };

    const startCountingPlayTime = () => {
        if (!playIntervalRef.current) {
            playIntervalRef.current = setInterval(() => {
                setPlayTime(prevTime => prevTime + 1);
            }, 1000);
        }
    };

    const stopCountingPlayTime = () => {
        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
        }
    };

    useEffect(() => {
        if (isPlayingSong) {
            startCountingPlayTime();
        } else {
            stopCountingPlayTime();
        }
        return () => stopCountingPlayTime();
    }, [isPlayingSong]);

    useEffect(() => {
        if (audioRef.current) {
            const songDuration = audioRef.current.duration;
            if (playTime >= songDuration / 2 && !hasReachedHalf) {
                setHasReachedHalf(true);
                const fetchData = async () => {
                    await updatePlayCount();
                    await updateUserListen();
                }
                fetchData();
            }
        }
    }, [playTime, audioRef, playSongList, songIndexList, hasReachedHalf]);

    useEffect(() => {
        setPlayTime(0);
        setHasReachedHalf(false);
    }, [songIndexList]);

    const handleRandomSong = (value) => {
        if (value) {
            setLoopSong(0);
            setPlayedRandomIndexes([songIndexList]);
            setIsRandom(true);
        } else {
            setIsRandom(false);
            setPlayedRandomIndexes([]);
        }
    };

    const handleLoopSong = (value) => {
        if (value > 0) {
            setIsRandom(false);
            setPlayedRandomIndexes([]);
        }
        setLoopSong(value);
    };

    const handleBackSong = () => {
        const newIndex = (songIndexList - 1 + playSongList.length) % playSongList.length;
        changeSongIndex(newIndex);
    };

    const handleNextSong = () => {
        let newIndex;

        if (isRandom) {
            let remaining = playSongList
                .map((_, idx) => idx)
                .filter(idx => !playedRandomIndexes.includes(idx));

            if (remaining.length === 0) {
                remaining = playSongList.map((_, idx) => idx);
                setPlayedRandomIndexes([]);
            }

            newIndex = remaining[Math.floor(Math.random() * remaining.length)];
            setPlayedRandomIndexes(prev => [...prev, newIndex]);
        } else {
            newIndex = (songIndexList + 1) % playSongList.length;
        }

        changeSongIndex(newIndex);
    };

    const handleChangeSong = (value) => {
        if (value === -1) {
            handleBackSong();
        } else {
            handleNextSong();
        }
    };

    const handleChangeMusicWhenEndSong = () => {
        if (isRandom) {
            handleNextSong();
            return;
        }

        if (loopSong === 1) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
        }

        if (loopSong === 2) {
            const newIndex = (songIndexList + 1) % playSongList.length;
            changeSongIndex(newIndex);
            return;
        }

        if (songIndexList < playSongList.length - 1) {
            changeSongIndex(songIndexList + 1);
        } else {
            toggleIsPlayingSong(false);
        }
    };

    const handleSetVolume = (volume) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    };

    const showPlayLyrics = () => {
        callPlayLyrics();
    };

    const showPlayList = () => {
        callPlayList();
    };

    const handlePlaySong = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    };

    const openSongMenu = () => {
        openMenuSongFooter(true);
    };

    const addNewFavoriteSong = async (song) => {
        await favoriteService.addFavoriteSong(song);
        toast.success("Đã cập nhật bài hát yêu thích mới");
    };

    return (
        <Grid columns={1} md={2} lg={3} gap={4} alignItems="center" className="w-full h-full c-m-0">
            <Card
                srcImg={playSongList[songIndexList].coverImageUrl}
                title={
                    playSongList[songIndexList]?.title.length > 15
                        ? `${playSongList[songIndexList]?.title.substring(0, 15)}...`
                        : playSongList[songIndexList]?.title
                }
                long
                description={playSongList[songIndexList]?.artists.map((artist, index) => (
                    <Typography tag={"span"} gd={{ fontSize: ".8rem" }} key={artist.artistId}>
                        {artist.artistName}
                        {index !== playSongList[songIndexList].artists.length - 1 && (
                            <Typography tag={"span"}>, </Typography>
                        )}
                    </Typography>
                ))}
                sizeImg={56}
                onClick={window.innerWidth < 768 ? showPlayLyrics : null}
            >
                <Button
                    className={"card-icon heart"}
                    type={"button"}
                    theme={"reset"}
                    icon={
                        <IoIosHeart
                            size={24}
                            fill={playSongList[songIndexList].userFavoriteStatus ? "red" : "white"}
                        />
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        addNewFavoriteSong(playSongList[songIndexList]);
                    }}
                />
                {window.innerWidth < 768 && (
                    <>
                        <Button
                            theme="reset"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlaySong();
                            }}
                            icon={isPlayingSong ? <IoPause size={20} /> : <IoMdPlay size={20} />}
                            gd={{ borderRadius: "50%", padding: 5 }}
                        />
                        <Button
                            theme="reset"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleChangeSong(1);
                            }}
                            icon={<IoPlaySkipForwardSharp size={20} />}
                            gd={{ borderRadius: "50%", padding: 5 }}
                        />
                    </>
                )}
                {window.innerWidth >= 768 && (
                    <Button
                        theme="reset"
                        icon={<CiMenuKebab size={22} />}
                        id={`active-song-menu-${playSongList[songIndexList].songId}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            openSongMenu();
                        }}
                    />
                )}
            </Card>

            <RenderIf isTrue={[3, 4, 5, 6].includes(breakpoints)} hiddenCSS>
                <AudioPlayer
                    ref={audioRef}
                    isPlay={isPlayingSong}
                    onEnded={handleChangeMusicWhenEndSong}
                    audioSrc={playSongList[songIndexList]?.songUrl}
                    onSwitchAudio={(value) => handleChangeSong(value)}
                    onRandomChange={(e) => handleRandomSong(e)}
                    onLoopChange={(e) => handleLoopSong(e)}
                />
            </RenderIf>

            <RenderIf isTrue={[4, 5, 6].includes(breakpoints)}>
                <AudioToolbar
                    onVolumeChange={handleSetVolume}
                    gd={{ marginLeft: "auto" }}
                    onClickLyric={showPlayLyrics}
                    onClickPlaylist={showPlayList}
                />
            </RenderIf>
        </Grid>
    );
}
