import {Button, Card, Container, Flex, Grid, Group, Modal, Table, Typography} from "lvq";
import {usePlayMusic} from "../../../core/contexts/PlayMusicContext";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import * as playlistsService from "../../../core/services/PlayListService";
import "./PlaylistInformation.css";
import * as PlaylistService from "../../../core/services/PlayListService";
import {toast} from "react-toastify";
import {usePopUp} from "../../../core/contexts/PopUpContext";

export function PlaylistInformation(){
    const {
        playSongList,
        songIndexList,
        addSongList,
        changeSongIndex,
        toggleIsPlayingSong,
        isPlayingSong,
    } = usePlayMusic();

    const {id} = useParams();
    const [playlist, setPlaylist] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);
    const showToast = usePopUp();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await getPlaylistById(id);
        }
        fetchData();
    }, [id]);

    const getPlaylistById = async (id) => {
        const temp = await playlistsService.getPlaylistById(id);
        setPlaylist(temp);
        console.log(temp);
    }

    const handlePlayAlbum = () => {
        if (playSongList !== playlist.songOfPlaylist) {
            addSongList(playlist.songOfPlaylist);
            changeSongIndex(0);
        } else {
            isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
        }
    };
    const confirmDeletePlaylist = async () => {
        try {
            await PlaylistService.removePlaylistById(playlistToDelete);
            showToast("Xóa playlist thành công!", 'success' , '5000');
            setModalVisible(false);
            navigate("/playlists");
        } catch (error) {
            showToast("Xóa playlist thất bại!", 'error' , '5000');
        }
    };

    const handlePlaySong = (index) => {
        if (playSongList !== playlist.songOfPlaylist) {
            addSongList(playlist.songOfPlaylist);
        }
        changeSongIndex(index);
    };

    const columns = [
        {
            key: 'index',
            header: '',
            render: (row, index) => (
                <Typography onClick={() => handlePlaySong(index)}
                            tag={'span'} gd={{fontSize: '0.8rem'}}>{index + 1}</Typography>
            ),
        },
        {
            key: 'name',
            header: 'Bài hát',
            render: (row) => (
                <Card
                    sizeImg={60}
                    long={true}
                    srcImg={row.coverImageUrl}
                    title={row.title}
                    description={row.artists?.map((artist, index) => (
                        <Link key={artist.id}>
                            {artist.artistName}
                            {index !== row.artists.length - 1 && <span>, </span>}
                        </Link>
                    ))}
                />
            ),
        },
        {
            key: 'duration',
            header: '',
            render: (row) =>
                <Typography right tag="small" gd={{display: "block"}}>{((row.duration)/60).toFixed(2).replace('.', ':')}</Typography>,
        }
    ];

    return(
        <Container withShadow={false} gd={{ overflow: "hidden" }}>

            <Flex justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                <Group  className={'album-card'} gd={{
                    backgroundColor: 'transparent',
                    textAlign: 'center',
                    minWidth: '25%',
                    maxWidth: '100%',
                    width: '25%'
                }} >
                    <Card srcImg={playlist.coverImageUrl}>
                        <Group>
                        <Typography tag={"h1"}>{playlist.title}</Typography>
                        <Flex center>
                            <Typography>Tạo bởi :</Typography>
                            {playlist.appUser &&(<Typography>{playlist.appUser.fullName}</Typography>
                            )}
                        </Flex>
                        <Typography>1 người yêu thích</Typography>
                        <Flex center>
                            <Button onClick={handlePlayAlbum} text={'Phát ngẫu nhiên'}></Button>
                        </Flex>
                            {playlist.appUser?.userId === currentUser.userId && (
                                <>
                                    <Flex center>
                                        <Button
                                            text={"Sửa danh sách phát"}
                                            onClick={() => navigate(`/playlist-update-for-user/${playlist.playlistId}`)}
                                        />
                                    </Flex>
                                    <Flex center>
                                        <Button
                                            text={"Xóa danh sách phát"}
                                            onClick={() => {
                                                setPlaylistToDelete(playlist.playlistId);
                                                setModalVisible(true);
                                            }}
                                        />
                                    </Flex>
                                </>
                            )}
                        </Group>
                    </Card>
                </Group>

                <Group className={'album-song-list'}
                    gd={{backgroundColor: 'transparent', minWidth: '74%', maxWidth: '100%', width: '74%'}}>
                    {playlist.songOfPlaylist  && <Table border={false} columns={columns}
                                                        data={playlist.songOfPlaylist}
                                                        rowKey={"id"}
                                                        className="custom-table"
                                                        onClickRow={(index) => handlePlaySong(index)}
                    />}
                </Group>
            </Flex>
            {modalVisible && (
                <Modal title="Confirm Deletion" visible={modalVisible} onClose={() => setModalVisible(false)} isOpen>
                    <Typography>Are you sure you want to delete this playlist?</Typography>
                    <Flex justifyContent='end'>
                        <Button text="Cancel" onClick={() => setModalVisible(false)} />
                        <Button text="Delete" onClick={confirmDeletePlaylist} />
                    </Flex>
                </Modal>
            )}
        </Container>
    );
}