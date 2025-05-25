import {Button, Card, Container, Flex, Form, Group, Input, Modal, Pagination, Table, Typography} from "lvq";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {CiEdit} from "react-icons/ci";
import {MdDelete} from "react-icons/md";
import Moment from "moment";
import * as albumService from "../../../core/services/AlbumService";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import * as AlbumService from "../../../core/services/AlbumService";

function AlbumsList() {
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [contentSearch, setContentSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState(null);
    const {register, handleSubmit, formState: {errors}, setValue, control} = useForm({

    });

    useEffect(() => {

        const fetchProducts = async () => {
            await getAlbumsList(contentSearch, currentPage);
        }
        fetchProducts().then().catch(console.error);
    }, [contentSearch, currentPage]);

    const getAlbumsList = async (contentSearch, page) => {
        const temp = await albumService.getAllAlbumsWithPage(contentSearch, page);
        setAlbums(temp.content);
        setTotalPages(temp.totalPages);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleDeleteClick = (albumId) => {
        console.log(albumId);
        setAlbumToDelete(albumId);
        setModalVisible(true);
    };
    const confirmDeleteAlbum = async () => {
        try {
            await AlbumService.removeAlbum(albumToDelete);
            toast.success('Xóa album thành công!');
            setModalVisible(false);
            await getAlbumsList("", currentPage);
        } catch (error) {
            toast.error('Xóa album thất bại.');
        }
    };


    const columns = [
        {
            key: 'album',
            header: 'Tên album',
            render: (row) => row.title,
        },
        {
            key: 'dateCreate',
            header: 'Ngày phát hành',
            render: (row) => Moment(row.dateCreate).format("DD/MM/yyyy"),
        },
        {
            key: 'artist',
            header: 'Nghệ sĩ thực hiện',
            render: (row) => row.artists.map(artist => (
                <Link to={"/dashboard/albums"} key={artist.artistId}
                      style={{color: "#ec1ea4"}}>{artist.artistName}, </Link>
            )),
        },
        {
            key: 'action',
            header: '',
            render: (row) => (
                <Flex justifyContent='center'>
                    <Button theme='reset' text='' onClick={() => navigate(`/dashboard/album-update/${row.albumId}`)}
                            icon={<CiEdit size={22} color='#eab308' />} />
                    <Button theme='reset' text='' icon={<MdDelete size={22} color='red' />}
                    onClick={() => handleDeleteClick(row.albumId)}/>
                </Flex>
            ),
        },
    ];

    const onSubmit = (data) => {
        console.log(data)
        setContentSearch(data.contentSearch);
    }
    return (
        <Container>
            <Flex justifyContent='between'>
                <Typography tag="h1">Danh sách Albums</Typography>
                <Button text='Thêm mới' onClick={() => navigate("/dashboard/album-create")} />
            </Flex>
            <Group className=''>
                <Form className={'bg-transparent'} onSubmit={handleSubmit(onSubmit)} >
                    <Input type="text" gd={{ maxWidth: "400px" }} {...register("contentSearch")}
                           placeholder='Tìm kiếm bài hát ...' />
                    <Button type={"submit"} text='Tìm kiếm' gd={{display: "none"}}/>
                </Form>
                <Table border={false} columns={columns} data={albums} rowKey={"id"} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </Group>
            {modalVisible && (
                <Modal title="Confirm Deletion" visible={modalVisible} onClose={() => setModalVisible(false)} isOpen>
                    <Typography>Are you sure you want to delete this album?</Typography>
                    <Flex justifyContent='end'>
                        <Button text="Cancel" onClick={() => setModalVisible(false)} />
                        <Button text="Delete" onClick={confirmDeleteAlbum} />
                    </Flex>
                </Modal>
            )}
        </Container>
    );
}

export default AlbumsList;