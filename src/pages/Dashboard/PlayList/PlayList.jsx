import {Button, Container, Flex, Group, Input, Pagination, Table, Typography, Modal} from "lvq";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import * as PlaylistService from "../../../core/services/PlayListService";
import {CiEdit} from "react-icons/ci";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";

function PlayList() {
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState(null);
    const {register, handleSubmit, formState: {errors}} = useForm({criteriaMode: "all"});

    useEffect(() => {
        document.title = `Quản lý Playlist`;
        const fetchData = async () => {
            await showPlaylist("", pageNumber);
        };
        fetchData();
    }, [pageNumber]);

    const showPlaylist = async (playlistName, page) => {
        try {
            const response = await PlaylistService.getAllPlaylist(playlistName, page);
            setPlaylist(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching playlist:", error);
            toast.warning('Error fetching playlist.');
        }
    };

    const handlePageChange = (page) => {
        setPageNumber(page);
    };

    const onSubmit = async (data) => {
        const {playlistName = ''} = data;
        try {
            const temp = await PlaylistService.getAllPlaylist(playlistName, pageNumber);
            setPlaylist(temp.content);
            setTotalPages(temp.totalPages);
        } catch (e) {
            setPlaylist([]);
        }
    };

    const confirmDeletePlaylist = async () => {
        try {
            console.log("Delete");
            await PlaylistService.removePlaylistById(playlistToDelete);
            toast.success('Xóa playlist thành công!');
            setModalVisible(false);
            await showPlaylist("", pageNumber);
        } catch (error) {
            toast.error('Xóa playlist thất bại.');
        }
    };

    const handleDeleteClick = (playlistId) => {
        console.log(playlistId);
        setPlaylistToDelete(playlistId);
        setModalVisible(true);
    };

    const columns = [
        {
            key: 'playlist',
            header: 'Tên playlist',
            render: (row) => row.playlistName,
        },
        {
            key: 'dateCreate',
            header: 'Ngày phát hành và thời gian phát hành',
            render: (row) => row.dateCreate,
        },
        {
            key: 'artist',
            header: 'Mã PlaylistUser',
            render: (row) => row.playlistCode,
        },
        {
            key: 'action',
            header: '',
            render: (row) => (
                <Flex justifyContent='center'>
                    <Button theme='reset' text='' onClick={() => navigate(`/dashboard/playlist-update/${row.playlistId}`)}
                            icon={<CiEdit size={22} color='#eab308' />} />
                    <Button theme='reset' text='' icon={<MdDelete size={22} color='red' />}
                            onClick={() => handleDeleteClick(row.playlistId)} />
                </Flex>
            ),
        },
    ];

    return (
        <Container>
            <Flex justifyContent='between'>
                <Typography tag="h1">Danh sách Playlists</Typography>
                <Button text='Thêm mới' onClick={() => navigate("/dashboard/playlist-create")} />
            </Flex>
            <Group className=''>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Input type="text"
                           {...register("playlistName")}
                           gd={{maxWidth: "400px"}}
                           placeholder='Tìm kiếm playlist ...'/>
                    <Button text='Tìm Kiếm' gd={{display:'none'}}/>
                </form>
                <Table columns={columns} data={playlist} rowKey={"id"}/>

                <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={handlePageChange}/>
            </Group>
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

export default PlayList;