import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as PlaylistService from "../../../core/services/PlayListService";
import { toast } from "react-toastify";
import {
    Avatar,
    Button,
    Container,
    ErrorMessage,
    Flex,
    Form,
    Grid,
    Group,
    Input,
    Label, Option, Select,
    Typography
} from "lvq";
import { IoArrowBackSharp } from "react-icons/io5";
import { UploadOneImage } from "../../../firebase/UploadImage";
import { GrUpdate } from "react-icons/gr";
import { FaMusic, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

export function PlaylistUpdateForUser() {
    const { id } = useParams();
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [playlist, setPlaylist] = useState({});
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({});
    const navigate = useNavigate();
    const [validateError, setValidateError] = useState({});
    const [addSongs, setAddSongs] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            if (id !== undefined) {
                await getPlaylistById(id);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (playlist?.playListSongs) {
            setAddSongs(playlist.playListSongs.map(pls => ({
                ...pls.song,
                id: pls.id
            })));
        }
    }, [playlist]);

    const getPlaylistById = async (playlistId) => {
        const temp = await PlaylistService.getPlaylistById(playlistId);
        if (temp) {
            setPlaylist(temp);
            setValue("playlistId", temp.playlistId);
            setValue("playlistName", temp.playlistName);
            setValue("playlistCode", temp.playlistCode);
            setValue("coverImageUrl", temp.coverImageUrl);
            setValue("description", temp.description);
            setValue("dateCreate", temp.dateCreate);
            setValue("playListSongs", temp.songOfPlaylist);
            setValue("appUser", temp.appUser);
            setValue("provide", temp.provide);
            setAddSongs(temp.songOfPlaylist);
            setCoverImageUrl(temp.coverImageUrl);
        }
    }

    const handlePopSong = (song) => {
        const parsedSong = JSON.parse(song);
        setAddSongs(prevSongs => prevSongs.filter(s => s.songId !== parsedSong.songId));
    };

    const onSubmit = async (data) => {
        try {
            data.coverImageUrl = coverImageUrl;

            data.playListSongs = addSongs.map(song => ({
                id: song.id,
                song: {
                    songId: song.songId
                }
            }));

            console.log("send BE:", data);
            await PlaylistService.updatePlaylist(data);
            toast.success("Cập nhật playlist thành công!");
        } catch (error) {
            if (error.errorMessage && typeof error.errorMessage === "object") {
                setValidateError(error.errorMessage);
                toast.warn("Kiểm tra lại việc nhập!");
            } else {
                toast.error("Thao tác thất bại!");
            }
        }
    };

    const handleOneImageUrlChange = async (uploadedImageUrl) => {
        setCoverImageUrl(uploadedImageUrl);
    }

    const handleRemoveImg = () => {
        setCoverImageUrl(null);
    }

    return (
        <Container>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Flex justifyContent='between' alignItems="center" gd={{ marginBottom: "2rem" }}>
                    <Typography tag="h1" gd={{ fontSize: "2rem", fontWeight: "bold" }}>
                        Chỉnh sửa Playlist của bạn
                    </Typography>
                    <Button 
                        text='Quay lại' 
                        icon={<IoArrowBackSharp />} 
                        gap={1} 
                        onClick={() => navigate("/playlists")}
                    />
                </Flex>

                <Group className='overflow-hidden'>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Grid md={2} gap={4}>
                            <Label>
                                <Typography gd={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Tên playlist</Typography>
                                <Input 
                                    size={4} 
                                    placeholder="Nhập tên playlist mới"
                                    {...register("playlistName", {
                                        required: "Tên playlist không được để trống!",
                                        maxLength: {
                                            value: 100,
                                            message: "Tên playlist không được vượt quá 100 ký tự!"
                                        }
                                    })}
                                    gd={{
                                        borderRadius: "8px",
                                        border: "2px solid #1DB954",
                                        padding: "0.8rem"
                                    }}
                                />
                                <ErrorMessage condition={errors?.playlistName} message={errors.playlistName?.message} />
                                <ErrorMessage condition={validateError?.playlistName} message={validateError.playlistName} />
                            </Label>

                            <Label>
                                <Typography gd={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Chú thích</Typography>
                                <Input 
                                    size={4} 
                                    placeholder="Nhập chú thích cho playlist"
                                    {...register("description", {
                                        maxLength: {
                                            value: 1000,
                                            message: "Mô tả không được vượt quá 1000 ký tự!"
                                        }
                                    })}
                                    gd={{
                                        borderRadius: "8px",
                                        border: "2px solid #1DB954",
                                        padding: "0.8rem"
                                    }}
                                />
                                <ErrorMessage condition={errors?.description} message={errors.description?.message} />
                                <ErrorMessage condition={validateError?.description} message={validateError.description} />
                            </Label>

                            <Label>
                                <Typography>Danh sách bài hát</Typography>
                                <ErrorMessage condition={validateError} message={validateError?.songs}/>
                                <div>
                                    {addSongs && addSongs.map((song, index) => (
                                        <>
                                            <Typography>{song.title}</Typography>
                                            <Flex justifyContent="start" alignItems="center" key={song.songId}
                                                  gd={{
                                                      position: "relative",
                                                      width: 300,
                                                      height: 40,
                                                      borderRadius: 10,
                                                      padding: 5,
                                                      marginTop: 10
                                                  }}>
                                                <audio src={song.songUrl} autoPlay={false} controls={true}/>
                                                <Button className="pop-artist" size={1} gd={
                                                    {
                                                        position: 'absolute',
                                                        right: -10,
                                                        top: -10,
                                                        backgroundColor: "#2f2739",
                                                        borderRadius: "50%",
                                                        color: "red"
                                                    }}
                                                        onClick={() => handlePopSong(JSON.stringify(song))}
                                                        text={"X"}>X</Button>
                                            </Flex>
                                        </>
                                    ))}
                                </div>
                            </Label>

                            <Label>
                                <Typography gd={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Hình ảnh bìa</Typography>
                                <Flex direction="column" gap={2}>
                                    <UploadOneImage
                                        className='form-label-child'
                                        onImageUrlChange={(url) => handleOneImageUrlChange(url)}
                                    />
                                    {!coverImageUrl && (
                                        <Typography color="red">Ảnh bìa không được để trống!</Typography>
                                    )}
                                </Flex>
                                {coverImageUrl && (
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Flex justifyContent="start" alignItems="center"
                                              gd={{
                                                  position: "relative",
                                                  width: 200,
                                                  height: 200,
                                                  borderRadius: "15px",
                                                  overflow: "hidden",
                                                  marginTop: "1rem",
                                                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                                              }}>
                                            <Avatar
                                                shape={'square'}
                                                size={200}
                                                src={coverImageUrl}
                                                alt="Playlist cover"
                                                gd={{ borderRadius: "15px" }}
                                            />
                                            <Button
                                                className="pop-artist"
                                                size={1}
                                                gd={{
                                                    position: 'absolute',
                                                    right: 10,
                                                    top: 10,
                                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                                    borderRadius: "50%",
                                                    color: "white",
                                                    padding: "0.5rem",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(0, 0, 0, 0.9)"
                                                    }
                                                }}
                                                onClick={handleRemoveImg}
                                                text={"X"}
                                            />
                                        </Flex>
                                    </motion.div>
                                )}
                            </Label>



                        </Grid>

                        <Flex justifyContent="center" gd={{ marginTop: "2rem" }}>
                            <Button 
                                type="submit" 
                                text="Cập nhật playlist" 
                                size={4} 
                                icon={<GrUpdate />} 
                                gap={1}
                                gd={{
                                    color: "white",
                                    padding: "1rem 2rem",
                                    borderRadius: "25px",
                                    fontSize: "1.1rem",
                                    "&:hover": {
                                        transform: "scale(1.05)"
                                    }
                                }}
                            />
                        </Flex>
                    </Form>
                </Group>
            </motion.div>
        </Container>
    );
}
