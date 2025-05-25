import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as PlaylistService from "../../../core/services/PlayListService";
import {toast} from "react-toastify";
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
    Label,
    Option,
    Select,
    Typography
} from "lvq";
import {IoArrowBackSharp} from "react-icons/io5";
import {UploadOneImage} from "../../../firebase/UploadImage";
import * as songService from "../../../core/services/SongService";
import {GrUpdate} from "react-icons/gr";


export function PlaylistUpdate() {
    const {id} = useParams();
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [playlist, setPlaylist] = useState({});
    const {register, handleSubmit, formState: {errors}, setValue, control} = useForm({});
    const navigate = useNavigate();
    const [songs, setSongs] = useState([]);
    const [addSongs, setAddSongs] = useState([]);

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

    const getAllSongs = async () => {
        const temp = await songService.getAllSongs();
        setSongs(temp)
    }

    const handleAddSongs = async (event) => {
        if (!event.target.value) return;

        const song = JSON.parse(event.target.value);
        if (addSongs.some(s => s.songId === song.songId)) {
            toast.info(`Bài hát "${song.title}" đã có trong playlist!`);
            return;
        }

        try {
            await PlaylistService.addSongToPlaylist(id, song.songId); // Gọi API BE
            setAddSongs(prev => [...prev, song]); // Cập nhật UI
            toast.success(`Đã thêm "${song.title}" vào playlist.`);
        } catch (e) {
            toast.error("Thêm bài hát thất bại.");
        }
    };



    const handlePopSong = (song) => {
        const parsedSong = JSON.parse(song);
        setAddSongs(prevSongs => prevSongs.filter(s => s.title !== parsedSong.title));
    }

    const onSubmit = async (data) => {
        try {
            data.coverImageUrl = coverImageUrl;
            const updateData = {
                playlistId: data.playlistId,
                playlistName: data.playlistName,
                description: data.description,
                coverImageUrl: data.coverImageUrl,
            };
            await PlaylistService.updatePlaylist(updateData);
            toast.success("Cập nhật playlist thành công!");
        } catch (error) {
            toast.error("Cập nhật thất bại!");
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
                <Typography tag="h1">Cập nhật playlist</Typography>
                <Button text='Về danh sách' icon={<IoArrowBackSharp />} gap={1} onClick={() => navigate("/dashboard/playlists")} />
            </Flex>
            <Group className='overflow-hidden'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid md={2} gap={4}>
                        <Label>
                            <Typography>Tên album</Typography>
                            <Input size={4} placeholder="Tên playlist"
                                   {...register("playlistName", {
                                       required: "Không được để trống!"
                                   })}
                            />
                            <ErrorMessage />
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
                                                onImageUrlChange={(url) => handleOneImageUrlChange(url)}/>
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
                                       required: "Không được để trống!"
                                   })}
                            />
                            <ErrorMessage />
                        </Label>
                    </Grid>
                    <Flex className="form-btn-mt">
                        <Button type="submit"  text="Cập nhật" size={4} icon={<GrUpdate />} gap={1}/>
                    </Flex>
                </Form>
            </Group>
        </Container>
    );
}