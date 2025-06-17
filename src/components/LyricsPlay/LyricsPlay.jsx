import React, { useEffect, useRef, useState } from 'react';
import * as lyricsService from '../../core/services/LyricsService';
import './LyricsPlay.css';
import { usePlayMusic } from '../../core/contexts/PlayMusicContext';

const LyricsPlay = () => {
    const {
        playSongList,
        songIndexList,
        audioRef,
    } = usePlayMusic();

    const [lyricsData, setLyricsData] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingTimeout, setLoadingTimeout] = useState(null);
    const lyricsRef = useRef(null);

    useEffect(() => {
        const fetchLyricJson = async () => {
            setIsLoading(true);
            const songId = playSongList[songIndexList]?.songId;
            if (!songId) return;

            // Kiểm tra trong sessionStorage
            const cachedLyrics = sessionStorage.getItem(`lyrics_${songId}`);
            if (cachedLyrics) {
                setLyricsData(JSON.parse(cachedLyrics));
                setIsLoading(false);
                return;
            }

            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 5000);
            setLoadingTimeout(timeout);

            try {
                const json = await lyricsService.getLyricJsonBySongId(songId);
                const lyrics = Array.isArray(json.data) ? json.data : [];
                sessionStorage.setItem(`lyrics_${songId}`, JSON.stringify(lyrics)); // Cache vào sessionStorage
                setLyricsData(lyrics);
            } catch (error) {
                console.error('Error fetching lyrics:', error);
                setLyricsData([]);
            } finally {
                clearTimeout(timeout);
                setIsLoading(false);
            }
        };

        fetchLyricJson();

        return () => {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
        };
    }, [songIndexList, playSongList]);


    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        audio.addEventListener('timeupdate', updateTime);
        return () => audio.removeEventListener('timeupdate', updateTime);
    }, [audioRef]);

    const findCurrentLineIndex = () => {
        for (let i = 0; i < lyricsData.length; i++) {
            const start = lyricsData[i].s / 1000;
            const end = lyricsData[i].e / 1000;
            if (currentTime >= start && currentTime < end) {
                return i;
            }
        }
        return 0;
    };

    useEffect(() => {
        const index = findCurrentLineIndex();
        setCurrentLineIndex(index);
    }, [currentTime, lyricsData]);

    useEffect(() => {
        const lyricsContainer = lyricsRef.current;
        const activeLine = lyricsContainer?.querySelector('.highlight');

        if (activeLine) {
            activeLine.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }, [currentLineIndex]);



    const handleLyricClick = (line) => {
        if (audioRef.current) {
            const startTime = line.s / 1000;
            audioRef.current.currentTime = startTime;
        }
    };

    const currentSong = playSongList[songIndexList];

    return (
        <div className="lyrics-play-container">
            <h2 className="song-title-lyrics">{currentSong?.title || 'Unknown Song'}</h2>
            <div className="lyrics-layout">
                <div className="lyrics-section">
                    <div
                        className="lyrics-content"
                        ref={lyricsRef}
                    >
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Đang tải lời bài hát...</p>
                            </div>
                        ) : lyricsData.length > 0 ? (
                            lyricsData.map((line, i) => {
                                const isActive = i === currentLineIndex;

                                return (
                                    <p
                                        key={i}
                                        className={`lyric-line ${isActive ? 'highlight' : ''}`}
                                        onClick={() => handleLyricClick(line)}
                                    >
                                        {line.l.map((word, j) => {
                                            const wordStart = word.s / 1000;
                                            const wordEnd = word.e / 1000;
                                            const isWordActive = currentTime >= wordStart && currentTime < wordEnd;
                                            return (
                                                <span
                                                    key={j}
                                                    className={`lyric-word ${isWordActive ? 'active' : ''}`}
                                                >
                                                    {word.d}
                                                </span>
                                            );
                                        })}
                                    </p>
                                );
                            })
                        ) : (
                            <p className="no-lyrics">Bài hát này chưa tích hợp chức năng lời bài hát.</p>
                        )}
                    </div>
                </div>
                <div className="song-image-lyrics">
                    <img 
                        src={currentSong?.coverImageUrl || '/default-song-image.jpg'}
                        alt={currentSong?.title || 'Song cover'} 
                        className="song-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default LyricsPlay;
