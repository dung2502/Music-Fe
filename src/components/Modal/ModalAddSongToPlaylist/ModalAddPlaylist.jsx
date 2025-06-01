import { Button, Card, Flex, Group, Modal, Typography } from "lvq";
import React, { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import * as playlistService from "../../../core/services/PlayListService";
import { toast } from "react-toastify";
import style from "./ModalAddPlaylist.module.scss";
import {usePopUp} from "../../../core/contexts/PopUpContext";

const ModalAddPlaylist = ({ isOpen, onClose, song }) => {

    const [playlists, setPlaylists] = useState([]);
    const showToast = usePopUp();


    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const userPlaylists = await playlistService.getAllPlaylistByUserId();
                setPlaylists(userPlaylists);
            } catch (error) {
                console.error("Error fetching playlists:", error);
                toast.error("Không thể tải danh sách playlist");
            }
        };
        fetchPlaylists();
    }, []);

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await playlistService.addSongToPlaylist(playlistId, song.songId);
            showToast("Thêm thành công bài hát vào playlist " + playlistId + " ! ", 'success' , '5000');
            onClose();
        } catch (error) {
            showToast("Thêm bài hát vào playlist thất " + playlistId + "!", 'error' , '5000');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            displayCoat={false}
            gd={{
                padding: "1rem",
                position: "absolute",
                zIndex: 1,
                maxWidth: 400,
                minWidth: 300,
                maxHeight: 500,
                minHeight: 200,
            }}
        >
            <Group className={style.modalHeader}>
                <Typography tag="h3">Thêm vào playlist</Typography>
            </Group>
            <Group className={style.modalBody}>
                {playlists.length > 0 ? (
                    <ul className={style.playlistList}>
                        {playlists.map((playlist) => (
                            <li key={playlist.playlistId} className={style.playlistItem}>
                                <Card
                                    long
                                    sizeImg={40}
                                    srcImg={playlist.coverImageUrl}
                                    title={playlist.playlistName}
                                    description={`${playlist.description}`}
                                />
                                <Button
                                    theme="reset"
                                    icon={<IoIosAddCircleOutline size={22} />}
                                    onClick={() => handleAddToPlaylist(playlist.playlistId)}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography tag="p" className={style.noPlaylists}>
                        Bạn chưa có playlist nào
                    </Typography>
                )}
            </Group>
        </Modal>
    );
};

export default ModalAddPlaylist; 