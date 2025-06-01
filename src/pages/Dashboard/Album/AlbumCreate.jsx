import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as genreService from "../../../core/services/GenreService";
import * as artistService from "../../../core/services/ArtistService";
import * as albumService from "../../../core/services/AlbumService";
import * as songService from "../../../core/services/SongService";
import { stompClient } from "../../../utils/useNotificationSocket";
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
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
import {UploadMp3} from "../../../firebase/UploadMp3";
import {IoMdAdd} from "react-icons/io";
import {getAllAlbums} from "../../../core/services/AlbumService";


export function AlbumCreate() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [album, setAlbum] = useState({});
    const [addArtists, setAddArtists] = useState([]);
    const [artists, setArtists] = useState([]);
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [genres, setGenres] = useState([]);
    const [addGenres, setAddGenres] = useState([]);
    const [validateError, setValidateError] = useState([]);
    const {register, handleSubmit, formState: {errors}, setValue, control} = useForm({});

    const BASE_URL = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            await getAllArtists();
            await getAllGenres();
        }
        fetchData();
    }, []);

    useEffect(()=> {
        const fetchData = async () => {
            if (id !== undefined) {
                await getAlbumById(id);
            }
        }
        fetchData();
    }, [id])

    const getAlbumById = async (albumId) => {
        const temp = await albumService.getAlbumById(albumId);
        if (temp) {
            setAlbum(temp);
            setValue("albumId", temp.albumId);
            setValue("title", temp.title);
            setValue("coverImageUrl", temp.coverImageUrl);
            setValue("dateCreate", temp.dateCreate);
            setValue("songs", temp.songs);
            setValue("artists", temp.artists);
            setValue("genres", temp.genres);
            setValue("provide", temp.provide);
            setAddArtists(temp.artists);
            setAddGenres(temp.genres);
            setCoverImageUrl(temp.coverImageUrl);
        }
    }

    const getAllArtists = async () => {
        const temp = await artistService.getAllArtist();
        setArtists(temp);
    }

    const getAllGenres = async () => {
        const temp = await genreService.getAllGenre();
        setGenres(temp);
    }


    const onSubmit = async (data) => {
        if (!coverImageUrl) {
            toast.error("Ảnh bìa không được để trống!");
            return;
        }
        if (addArtists.length < 1) {
            toast.error("Phải chọn ít nhất một nghệ sĩ!");
            return;
        }
        if (addGenres.length < 1) {
            toast.error("Phải chọn ít nhất một thể loại!");
            return;
        }

        try {
            data.genres = addGenres;
            data.coverImageUrl = coverImageUrl;
            data.artists = addArtists;

            let savedAlbum;
            if (id !== undefined) {
                await albumService.updateAlbum(data);
            } else {
                savedAlbum = await albumService.saveAlbum(data);

                const notificationPayload = {
                    title: savedAlbum.title,
                    urlImage: savedAlbum.coverImageUrl,
                    content: `Album mới: ${user.username} - ${savedAlbum.title}`,
                    path: `albums/${savedAlbum.albumId}`
                };

                const socket = new SockJS(`${BASE_URL}/ws`);
                const stompClient = over(socket);
                stompClient.connect({}, () => {
                    stompClient.send("/app/sendNoti-album", {}, JSON.stringify(notificationPayload));
                });
            }

            toast.success("Thêm mới album thành công!");
        } catch (e) {
            setValidateError(e.errorMessage);
            toast.error("Thêm mới thất bại!");
        }
    }

    const handleOneImageUrlChange = async (uploadedImageUrl) => {
        setCoverImageUrl(uploadedImageUrl);
    }

    const handleRemoveImg = () => {
        setCoverImageUrl(null);
    }

    const handleAddArtists = (event) => {
        if (event.target.value === "") {
            return;
        }
        const artist = JSON.parse(event.target.value);
        if (!addArtists.some(a => a.artistName === artist.artistName)) {
            setAddArtists(prevArtists => [...prevArtists, artist]);
        }
    }

    const handleAddGenre = (event) => {
        if (event.target.value === "") {
            return;
        }
        const genre = JSON.parse(event.target.value);
        if (!addGenres.some(g => g.genreName === genre.genreName)) {
            setAddGenres(prevGenres => [...prevGenres, genre]);
        }
    }

    const handlePopArtist = (artist) => {
        const parsedArtist = JSON.parse(artist);
        setAddArtists(prevArtists => prevArtists.filter(a => a.artistName !== parsedArtist.artistName));
    }

    const handlePopGenre = (genre) => {
        const parsedGenre = JSON.parse(genre);
        setAddGenres(prevGenres => prevGenres.filter(g => g.genreName !== parsedGenre.genreName));
    }

    return (
        <Container>
            <Flex justifyContent='between'>
                <Typography tag="h1">Thêm mới album</Typography>
                <Button text='Về danh sách' icon={<IoArrowBackSharp />} gap={1} onClick={() => navigate("/dashboard/albums")} />
            </Flex>
            <Group className='overflow-hidden'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid md={2} gap={4}>
                        <Label>
                            <Typography>Tên album</Typography>
                            <Input size={4} placeholder="Tên album"
                                   {...register("title", {
                                       required: "Không được để trống!",
                                       maxLength: {
                                           value: 100,
                                           message: "Không được vượt quá 100 ký tự!"
                                       }
                                   })}
                            />

                            <ErrorMessage condition={errors} message={errors?.title?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.title}/>
                        </Label>
                        <Label>
                            <Typography>Thể loại</Typography>
                            <Flex>
                                <Select size={4} onChange={(e) => handleAddGenre(e)}>
                                    <Option value="" text="-- Thể loại --"></Option>
                                    {genres && genres.map((genre) => (
                                        <Option key={genre.genreId}
                                                value={JSON.stringify(genre)} text={genre.genreName}></Option>
                                    ))}
                                </Select>
                                <ErrorMessage />
                            </Flex>
                            <Flex justifyContent={'space-between'} alignItems="center" gd={{width: '100%', flexWrap: 'wrap'}}>
                                {addGenres && addGenres.map((genre, index) => (
                                    <Flex justifyContent="start" alignItems="center" key={genre.genreId}
                                          gd={{
                                              position: "relative",
                                              width: 150,
                                              height: 40,
                                              borderRadius: 10,
                                              border: "1px solid #9b4de0",
                                              padding: 5,
                                              marginTop: 10
                                          }}>
                                        <Typography>{genre.genreName}</Typography>
                                        <Button className="pop-artist" size={1} gd={
                                            {
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                backgroundColor: "#2f2739",
                                                borderRadius: "50%",
                                                color: "red"
                                            }}
                                                onClick={() => handlePopGenre(JSON.stringify(genre))}
                                                text={"X"}>

                                        </Button>
                                    </Flex>
                                ))}
                            </Flex>
                        </Label>
                        <Label>
                            <Typography>Nghệ sĩ thực hiện</Typography>
                            <Flex>
                                <Select size={4} onChange={(e) => handleAddArtists(e)}>
                                    <Option value="" text="-- Chọn nghệ sĩ --"></Option>
                                    {artists && artists.map((artist) => (
                                        <Option key={artist.artistId}
                                                value={JSON.stringify(artist)} text={artist.artistName}></Option>
                                    ))}
                                </Select>
                            </Flex>
                            <ErrorMessage condition={validateError} message={validateError?.artists}/>
                            <Flex justifyContent={'space-between'} alignItems="center" gd={{width: '100%', flexWrap: 'wrap'}}>
                                {addArtists && addArtists.map((artist, index) => (
                                    <Flex key={artist.artistId}
                                          gd={{
                                              position: "relative",
                                              width: 150,
                                              height: 40,
                                              borderRadius: 10,
                                              border: "1px solid #9b4de0",
                                              padding: 5,
                                              marginTop: 10
                                          }}>
                                        <Typography>{artist.artistName}</Typography>
                                        <Button className="pop-artist" size={1} gd={
                                            {
                                                position: 'absolute',
                                                right: -10,
                                                top: -10,
                                                backgroundColor: "#2f2739",
                                                borderRadius: "50%",
                                                color: "red"
                                            }}
                                                onClick={() => handlePopArtist(JSON.stringify(artist))}
                                                text={"X"}>
                                        </Button>
                                    </Flex>
                                ))}
                            </Flex>
                        </Label>
                        <Label>
                            <Typography>Hình ảnh bìa</Typography>
                            <Flex>
                                <UploadOneImage className='form-label-child'
                                                onImageUrlChange={(url) => handleOneImageUrlChange(url)}/>
                            </Flex>
                            <ErrorMessage condition={validateError} message={validateError?.coverImageUrl}/>
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
                            <Typography>Cung cấp bởi </Typography>
                            <Input size={4} placeholder="Bản quyền"
                                   {...register("provide", {
                                       required: "Không được để trống!",
                                       maxLength: {
                                           value: 100,
                                           message: "Không được vượt quá 100 ký tự!"
                                       }
                                   })}
                            />

                            <ErrorMessage condition={errors} message={errors?.title?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.provide}/>
                        </Label>
                    </Grid>
                    <Flex className="form-btn-mt">
                        <Button type="submit" text={id !== undefined ? "Sửa đổi" : "Thêm mới"} size={4} icon={<IoMdAdd />} gap={1}/>
                    </Flex>
                </Form>
            </Group>
        </Container>
    );
}