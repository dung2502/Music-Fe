import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as PlaylistService from "../../../core/services/PlayListService";
import {toast} from "react-toastify";
import {
    Avatar,
    Button, Container,
    Editor,
    ErrorMessage,
    Flex,
    Form,
    Grid,
    Group,
    Input,
    Label,
    Option,
    Select,
    Typography
} from "lvq";
import {IoArrowBackSharp} from "react-icons/io5";
import {UploadOneImage} from "../../../firebase/UploadImage";
import {IoMdAdd} from "react-icons/io";
import * as songService from "../../../core/services/SongService";


export function PlaylistCreate() {
    const {id} = useParams();
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [playlist, setPlaylist] = useState({});
    const {register, handleSubmit, formState: {errors}, setValue, control} = useForm({});
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [addSongs, setAddSongs] = useState([]);
    const [validateError, setValidateError] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            await getAllSongs();
        }
        fetchData();
    }, []);

    useEffect(()=> {
        const fetchData = async () => {
            if (id !== undefined) {
                await getPlaylistById(id);
            }
        }
        fetchData();
    }, [id])

    const getPlaylistById = async (playlistId) => {
        const temp = await PlaylistService.getPlaylistById(playlistId);
        console.log(temp);
        if (temp) {
            setPlaylist(temp);
            setValue("playlistId", temp.playlistId);
            setValue("playlistName", temp.playlistName);
            setValue("playlistCode", temp.playlistCode);
            setValue("coverImageUrl", temp.coverImageUrl);
            setValue("description", temp.description);
            setValue("dateCreate", temp.dateCreate);
            setValue("playListSongs", temp.playListSongs);
            setValue("appUser", temp.appUser);
            let extractedSongs = temp.songOfPlaylist?.map(playlistSong => playlistSong.songs);
            setAddSongs(extractedSongs);
            setCoverImageUrl(temp.coverImageUrl);
        }
    }

    const getAllSongs = async () => {
        const temp = await songService.getAllSongs();
        setSongs(temp)
    }

    const handleAddSongs = (event) => {
        console.log(addSongs);
        if (event.target.value === "") {
            return;
        }
        const song = JSON.parse(event.target.value);
        if (!addSongs.some(s => s.title === song.title)) {
            setAddSongs(prevSongs => [...prevSongs, song]);
        }
    }

    const handlePopSong = (song) => {
        const parsedSong = JSON.parse(song);
        setAddSongs(prevSongs => prevSongs.filter(s => s.title !== parsedSong.title));
    }

    const onSubmit = async (data) => {
        try {
            data.coverImageUrl = coverImageUrl;
            console.log(addSongs);
            data.playListSongs = addSongs.map((song) => ({ song: song }));
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.userId;
            if (userId) {
                data.userId = userId;
            }
            await PlaylistService.savePlaylistAuth(data);
            console.log(data);
            toast.success("Tạo mới playlist thành công!");
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
            <Flex justifyContent='between'>
                <Typography tag="h1">Thêm mới playlist</Typography>
                <Button text='Về danh sách' icon={<IoArrowBackSharp />} gap={1} onClick={() => navigate("/dashboard/playlists")} />
            </Flex>
            <Group className='overflow-hidden'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid md={2} gap={4}>

                        <Label>
                            <Typography>Tên album</Typography>
                            <Input size={4} placeholder="Tên playlist"
                                   {...register("playlistName", {
                                       required: "Tên playlist không được để trống!",
                                       maxLength: {
                                           value: 100,
                                           message: "Tên playlist không được vượt quá 100 ký tự!"
                                       }
                                   })}
                            />

                            <ErrorMessage condition={errors?.playlistName} message={errors.playlistName?.message} />
                            <ErrorMessage condition={validateError?.playlistName} message={validateError.playlistName} />
                        </Label>

                        <Label>
                            <Typography>Danh sách bài hát</Typography>
                            <Flex>
                                <Select size={4} onChange={(e) => handleAddSongs(e)}>
                                    <Option value="" text="-- Chọn bài hát --"></Option>
                                    {songs && songs.map((song) => (
                                        <Option key={song.songId} value={JSON.stringify(song)}
                                                text={song.title}></Option>
                                    ))}
                                </Select>
                                <ErrorMessage />
                            </Flex>
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
                            <Typography>Hình ảnh bìa</Typography>
                            <Flex>
                                <UploadOneImage className='form-label-child'
                                                onImageUrlChange={(url) => handleOneImageUrlChange(url)}
                                />
                                {!coverImageUrl && (
                                    <Typography color="red">Ảnh bìa không được để trống!</Typography>
                                )}

                                <ErrorMessage />
                            </Flex>
                            <Flex justifyContent={'space-between'} alignItems="center" gd={{width: '100%', flexWrap: 'wrap'}}>
                                {coverImageUrl &&
                                    <Flex justifyContent="start" alignItems="center"
                                          gd={{
                                              position: "relative",
                                              width: 150,
                                              height: 150,
                                              borderRadius: 10,
                                              padding: 5,
                                              marginTop: 10
                                          }}>
                                        <Avatar shape={'square'} size={150} src={coverImageUrl} alt={coverImageUrl}
                                                gd={{borderRadius: 10}}/>
                                        <Button className="pop-artist" size={1} gd={
                                            {
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                backgroundColor: "#2f2739",
                                                borderRadius: "50%",
                                                color: "red"
                                            }}
                                                onClick={handleRemoveImg}
                                                text={"X"}>
                                        </Button>
                                    </Flex>
                                }
                            </Flex>
                        </Label>

                        <Label>
                            <Typography>Chú Thích</Typography>
                            <Input size={4} placeholder="Chú thích"
                                   {...register("description", {
                                       maxLength: {
                                           value: 1000,
                                           message: "Mô tả không được vượt quá 1000 ký tự!"
                                       }
                                   })}
                            />

                            <ErrorMessage condition={errors?.description} message={errors.description?.message} />
                            <ErrorMessage condition={validateError?.description} message={validateError.description} />
                        </Label>

                    </Grid>
                    <Flex className="form-btn-mt">
                        <Button type="submit"  text="Thêm mới" size={4} icon={<IoMdAdd />} gap={1}/>
                    </Flex>
                </Form>
            </Group>
        </Container>
    );
}