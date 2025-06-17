import {Button, Card, Flex, Group, Modal, Typography} from "lvq";
import style from "./ModalSongMenu.module.scss"
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {IoIosHeart} from "react-icons/io";
import {PiMicrophoneStage, PiMusicNotesPlusLight} from "react-icons/pi";
import {MdNextPlan} from "react-icons/md";
import {HiOutlineSignal} from "react-icons/hi2";
import {LyricAndComment} from "../../LyricAndComment/LyricAndComment";
import * as favoriteService from "../../../core/services/FavoriteService";
import {toast} from "react-toastify";
import ModalAddPlaylist from "../ModalAddSongToPlaylist/ModalAddPlaylist";
import { IoIosInformationCircleOutline } from "react-icons/io";

const ModalSongMenu = ({ isOpen, onClose, song}) => {
    const [isShowPlayLyrics, setShowPlayLyrics] = useState(false);
    const [isShowAddPlaylist, setIsShowAddPlaylist] = useState(false);
    const isAuthenticated = !!localStorage.getItem('user');
    const navigate = useNavigate();



    const handleShowPlayLyrics = () => {
        setShowPlayLyrics(!isShowPlayLyrics);
    }

    const handleShowAddPlaylist = () => {
        setIsShowAddPlaylist(!isShowAddPlaylist);
    }

    const handleGoToSongInformation = (songId) => {
        navigate('/song/'+ songId);
    }

    useEffect(() => {
        console.log(isOpen);
    }, [isOpen]);


    const addNewFavoriteSong = async (song) => {
        await favoriteService.addFavoriteSong(song);
        toast.success("Đã cập nhật bài hát yêu thích mới");
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} displayCoat = {false} idControl={`active-song-menu-${song.songId}`}
                   gd={{
                       padding: "0.5rem",
                       position: "absolute",
                       zIndex: 1,
                       maxWidth: 250,
                       minWidth: 200,
                       maxHeight: 500,
                       minHeight: 400,
                   }}
            >
                <Group className={style.modalHeader}>
                    <Card long sizeImg={40}
                          srcImg={song.coverImageUrl}
                          title={song.title}
                          description={
                              song.artists?.map((artist, index) => (
                                  <Link key={artist.artistId} to={`/artists/${artist.artistId}`}>
                                      {artist.artistName}
                                      {index !==  song.artists.length - 1 && <span>, </span>}
                                  </Link>))
                          }
                    >
                    </Card>

                    <Flex center justifyContent={"center"} alignItems={"center"} className={style.buttonMenu}>
                        <Button theme={'reset'} onClick={(e) => {
                            e.stopPropagation();
                            handleShowPlayLyrics();
                        }}
                                text={<Flex justifyContent={"center"} gap={0} alignItems={'center'} column>
                                        <PiMicrophoneStage />
                                        <Typography tag={'span'}>Lời bài hát</Typography>
                                    </Flex>
                                }>
                        </Button>
                    </Flex>
                </Group>
                {isAuthenticated && (
                    <Group className={style.modalBody}>
                        <ul>
                            <li>
                                Thêm vào thư viện
                                <Button className={'card-icon heart'} type={'button'}
                                        theme={'reset'}
                                        icon={<IoIosHeart size={22} fill={song.userFavoriteStatus ? "red" : "white"}/>}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addNewFavoriteSong(song)
                                        }}>
                                </Button>
                            </li>
                            <li>
                                Thêm vào playlist
                                <Button className={'card-icon heart'} type={'button'}
                                        theme={'reset'}
                                        icon={<PiMusicNotesPlusLight/>}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShowAddPlaylist();
                                        }}>
                                </Button>
                            </li>
                            <li>
                                Thông tin
                                <Button className={'card-icon heart'} type={'button'}
                                        theme={'reset'}
                                        icon={<IoIosInformationCircleOutline />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleGoToSongInformation(song.songId);
                                        }}>
                                </Button>
                            </li>
                        </ul>
                    </Group>
                )}{isShowPlayLyrics && <LyricAndComment showLyrics={isShowPlayLyrics} song={song}/>}
            </Modal>
            <ModalAddPlaylist
                isOpen={isShowAddPlaylist}
                onClose={handleShowAddPlaylist}
                song={song}
            />
        </>
    );
}

export default ModalSongMenu;