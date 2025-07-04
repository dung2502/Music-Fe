import React, {useEffect, useState} from 'react';
import './CreatePlaylistModal.scss';
import { useForm } from "react-hook-form";
import * as PlaylistService from "../../../core/services/PlayListService";
import { toast } from "react-toastify";
import {Button, ErrorMessage, Flex, Form, Group, Input, Label, Modal, Typography} from "lvq";
import { useNavigate } from "react-router-dom";
import {IoClose} from "react-icons/io5";
import {usePopUp} from "../../../core/contexts/PopUpContext";

const CreatePlaylistModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [isPublic, setIsPublic] = useState(true);
    const [isShuffle, setIsShuffle] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const showToast = usePopUp();
    const { register, handleSubmit, formState: { errors } } = useForm({});

    useEffect(() => {
        setOpenModal(isOpen);
        console.log(isOpen);
    }, [isOpen])

    const onSubmit = async (data) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.userId;
            if (userId) {
                data.userId = userId;
            }
            console.log(data);
            await PlaylistService.createPlaylistUser(data);
            showToast("Tạo mới playlist thành công!", 'success' , '5000');
            onClose();
            navigate("/favorites");
        } catch (e) {
            console.error("Error adding playlist:", e);
            showToast("Tạo mới playlist thất bại!", 'error' , '5000');
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}
               displayCoat={false}
               idControl="modal-new-playlist"
               className="modal-new-playlist">
            <Group className="modal" onClick={(e) => e.stopPropagation()}>

                <Group className="modal-header-content">
                    <Typography tag={"h2"} >Tạo playlist mới</Typography>
                    <Button
                        theme={'reset'}
                        className="close-button-playlist"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        text={<IoClose />}>
                    </Button>
                </Group>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Flex className="modal-content" column={true}>
                        <Input
                            size={4}
                            placeholder="Tên playlist"
                            {...register("playlistName", {
                                required: "Không được để trống!"
                            })}
                        />
                        {errors.playlistName && <ErrorMessage>{errors.playlistName.message}</ErrorMessage>}
                        <Group className="toggle-section">
                            <Flex className="toggle-item" justifyContent={'between'} alignItems={"center"}>
                                <Flex column>
                                    <Typography tag={'span'} className="title">Công khai</Typography>
                                    <Typography tag={'span'} className="value">Mọi người có thể nhìn thấy playlist này</Typography>
                                </Flex>
                                <Label className="switch">
                                    <Input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={() => setIsPublic(!isPublic)}
                                    />
                                    <Typography tag={'span'} className="slider" children={''}></Typography>
                                </Label>
                            </Flex>
                        </Group>
                    </Flex>
                    <Button className="create-button" type="submit" text={"TẠO MỚI"}></Button>
                </Form>

            </Group>
        </Modal>
    );
};

export default CreatePlaylistModal;
