import {Button, Card, Container, Flex, Grid, Group, Modal, Table, Typography} from "lvq";
import {usePlayMusic} from "../../../core/contexts/PlayMusicContext";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import * as playlistsService from "../../../core/services/PlayListService";
import "./PlaylistInformation.css";
import * as PlaylistService from "../../../core/services/PlayListService";
import {usePopUp} from "../../../core/contexts/PopUpContext";
import * as playlistService from "../../../core/services/PlayListService";
import * as favoriteService from "../../../core/services/FavoriteService";
import {toast} from "react-toastify";
import {FiUserPlus} from "react-icons/fi";
import * as authenticationService from "../../../core/services/AuthenticationService";

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
    const [favoritePlayLists, setFavoritePlaylists] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const showToast = usePopUp();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = authenticationService.isAuthenticated();

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
    useEffect(() => {
        const fetchData = async () => {
            await getFavoritePlaylist('','DESC',0,100)
        }
        fetchData().then().catch(console.error);
    }, []);

    useEffect(() => {
        if (favoritePlayLists && playlist.playlistId) {
            const isFav = favoritePlayLists.some(favPlaylist => favPlaylist.playlistId === playlist.playlistId);
            setIsFavorited(isFav);
        }
    }, [favoritePlayLists, playlist]);

    const getFavoritePlaylist = async (sort, direction,page,size) => {
        const temp = await PlaylistService.getAllFavoritePlaylists(sort, direction,page,size);
        setFavoritePlaylists(temp.content);
    }

    useEffect(() => {
        if (playlist) {
            setIsFavorited(playlist.userFavoriteStatus || false);
        }
    }, [playlist]);

    const addNewFavoritePlaylist = async (playlist) => {
        try {
            const response = await favoriteService.addFavoritePlaylist(playlist);
            if (response.success) {
                setIsFavorited(true);
                toast.success("Đã thêm vào danh sách yêu thích");
            } else {
                toast.error(response.error || "Không thể thêm vào danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Không thể thêm vào danh sách yêu thích");
            console.error(error);
        }
    };

    const deleteFavoritePlaylist = async (playlist) => {
        try {
            const response = await favoriteService.deleteFavoritePlaylist(playlist);
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
                            <Flex center>
                                {isAuthenticated && (
                                    <Button
                                        className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                                        icon={<FiUserPlus size={18}/>}
                                        text={isFavorited ? 'Đã quan tâm' : 'Quan tâm'}
                                        onClick={(e) => {
                                            if (isFavorited) {
                                                deleteFavoritePlaylist(playlist);
                                            } else {
                                                addNewFavoritePlaylist(playlist);
                                            }
                                        }}
                                    />
                                )}
                            </Flex>
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
                <Modal 
                    title="Xác nhận xóa" 
                    visible={modalVisible} 
                    onClose={() => setModalVisible(false)} 
                    isOpen
                    className="delete-playlist-modal"
                >
                    <Flex direction="column" gap="20px" alignItems="center">
                        <Typography tag="h3" gd={{ color: '#ff4d4f', marginBottom: '10px' }}>
                            Cảnh báo
                        </Typography>
                        <Typography gd={{ textAlign: 'center', fontSize: '16px' }}>
                            Bạn có chắc chắn muốn xóa playlist này không? Hành động này không thể hoàn tác.
                        </Typography>
                        <Flex gap="10px" justifyContent='center' gd={{ marginTop: '20px' }}>
                            <Button 
                                text="Hủy" 
                                onClick={() => setModalVisible(false)}
                                gd={{
                                    padding: '8px 24px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                    }
                                }}
                            />
                            <Button 
                                text="Xóa" 
                                onClick={confirmDeletePlaylist}
                                gd={{
                                    padding: '8px 24px',
                                    backgroundColor: '#ff4d4f',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: '#ff7875',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 2px 8px rgba(255,77,79,0.35)'
                                    }
                                }}
                            />
                        </Flex>
                    </Flex>
                </Modal>
            )}
        </Container>
    );
}