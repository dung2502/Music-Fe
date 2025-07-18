import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import * as artistService from "../../core/services/ArtistService";
import {Avatar, Button, Card, Container, Flex, Grid, Group, Typography} from "lvq";
import {FaPlay, FaPlayCircle, FaUserPlus} from "react-icons/fa";
import {FiUserPlus} from "react-icons/fi";
import {MdArrowForwardIos} from "react-icons/md";
import {LiaMicrophoneAltSolid} from "react-icons/lia";
import {IoIosHeart} from "react-icons/io";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import "./Artist.scss";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import wave from "../../assets/gif/icon-playing.gif";
import ModalSongMenu from "../../components/Modal/ModalMenu/ModalSongMenu";
import {getArtistById} from "../../core/services/ArtistService";
import * as favoriteService from "../../core/services/FavoriteService";
import {toast} from "react-toastify";
import * as authenticationService from "../../core/services/AuthenticationService";

export function Artist() {
    const {
        playSongList,
        songIndexList,
        addSongList,
        changeSongIndex,
        toggleIsPlayingSong,
        isPlayingSong,
    } = usePlayMusic();
    const { id } = useParams();
    const [artist, setArtist] = useState({});
    const [modalSongIndex, setModalSongIndex] = useState(0);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);
    const [favoriteArtists, setFavoriteArtists] = useState([]);
    const [isFavorited, setIsFavorited] = useState(false);
    const isAuthenticated = authenticationService.isAuthenticated();



    useEffect(() => {
        const fetchData = async () => {
            await getArtistById(id);
        }
        fetchData();
    }, [id]);

    const getArtistById = async (id) => {
        const temp = await artistService.getArtistById(id);
        setArtist(temp);
    }

    const handlePlaySong = (index) => {
        if (playSongList !== artist.songs) {
            addSongList(artist.songs);
        }
        changeSongIndex(index);
    };

    const handlePlayAndPauseSong = () => {
        isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
    }

    const openSongMenu = (songId) => {
        setModalSongIndex(songId);
        setIsOpenSongMenu(true);
    }

    const handleCloseSongMenu = () => {
        setModalSongIndex(0);
        setIsOpenSongMenu(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            await getFavoriteArtists('','DESC',0,100)
        }
        fetchData().then().catch(console.error);
    }, []);


    const getFavoriteArtists = async (sort, direction,page,size) => {
        const temp = await artistService.getAllFavoriteArtists(sort, direction,page,size);
        setFavoriteArtists(temp.content);
    }

    useEffect(() => {
        if (favoriteArtists && artist.artistId) {
            const isFav = favoriteArtists.some(favArtist => favArtist.artistId === artist.artistId);
            setIsFavorited(isFav);
        }
    }, [favoriteArtists, artist]);

    const addNewFavoriteArtist = async (artist) => {
        try {
            const response = await favoriteService.addFavoriteArtist(artist);
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
    }

    const deleteFavArtist = async (artist) => {
        try {
            const response = await favoriteService.deleteFavoriteArtist(artist);
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

    return (
        <Container withShadow={false}>
            <Group className={'artist-header'}>
                <Card shape={'circle'}
                      long
                      srcImg={artist.avatar}
                      sizeImg={200}
                      title={
                        <Flex justifyContent={'start'} alignItems={'center'} gd={{padding: '10px 0'}}>
                            <Typography tag={'h1'} gd={{fontSize: '2.5rem'}}>{artist.artistName}</Typography>
                            <Button theme={'reset'} icon={<FaPlayCircle size={50} color={'#a317e6'}/>}></Button>
                        </Flex>
                      }
                      description={
                          <Flex justifyContent={'start'} alignItems={'center'}>
                              <Button 
                                  className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                                  icon={<FiUserPlus size={18}/>} 
                                  text={isFavorited ? 'Đã quan tâm' : 'Quan tâm'}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      if (isFavorited) {
                                          deleteFavArtist(artist);
                                      } else {
                                          addNewFavoriteArtist(artist);
                                      }
                                  }}>
                              </Button>
                          </Flex>
                      }
                      gd={{ maxWidth: '100%', padding: 20}}
                ></Card>
            </Group>
            <Group className={'artist-content'} gd={{backgroundColor: 'var(--bg-content)', padding: 10}}>
                <Group className={'top-song-artist'}>
                    <Flex alignItems="center" justifyContent="between">
                        <Typography tag="h2">Bài hát nổi bật</Typography>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos />} iconPosition="right" gap={1} />
                    </Flex>
                    <Grid columns={1} md={2}>
                        {artist.songs && artist.songs.map((song, index) => (
                            <Flex className={`audio-card ${playSongList[songIndexList]?.songId === song.songId && isPlayingSong ? "active" : ""}`}>
                                <Card sizeImg={60}
                                      className={`song-card ${playSongList[songIndexList]?.songId === song.songId ? "active": ""}`}
                                      key={index}
                                      srcImg={song.coverImageUrl}
                                      title={song.title} long
                                      description={song.artists.map((artist, index) => (
                                          <Typography tag={'span'}>
                                              {artist.artistName}
                                              {index !== song.artists.length - 1 && <Typography tag={'span'}>, </Typography>}
                                          </Typography>
                                      ))}
                                      children={
                                          <Flex justifyContent={'end'} alignItems={'center'}>
                                              <Button className={'card-icon kara'} theme={'reset'} icon={<LiaMicrophoneAltSolid size={18}/>}></Button>
                                              <Button className={'card-icon heart'} theme={'reset'} icon={<IoIosHeart size={18}/>}></Button>
                                              <Button className={'card-icon menu'} theme={'reset'} id={`active-song-menu-${song.songId}`}
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          openSongMenu(song.songId)
                                                      }}
                                                      icon={<HiOutlineDotsHorizontal size={18}/>}></Button>
                                              <Typography className={'duration'} right tag="small">{((song.duration)/60).toFixed(2).replace('.', ':')}</Typography>
                                              {song.songId === modalSongIndex &&
                                                  <ModalSongMenu
                                                      isOpen={isOpenSongMenu}
                                                      onClose={handleCloseSongMenu}
                                                      song={song}
                                                  ></ModalSongMenu>
                                              }
                                          </Flex>
                                      }
                                      gd={{ maxWidth: '100%'}}
                                      onClick={()=>handlePlaySong(index)}
                                >
                                </Card>
                                <Flex justifyContent={"center"} alignItems={'center'}
                                      className={'audio-play'}
                                      gd={{width: 60, height: 60, margin: 10}}
                                >
                                    {
                                        playSongList[songIndexList]?.songId === song.songId ?
                                            <Button theme={'reset'}
                                                    onClick={handlePlayAndPauseSong}
                                                    icon={
                                                        isPlayingSong ? <img src={wave} height={20} alt="wave"/>
                                                            : <FaPlay size={20} style={{paddingLeft: 5}} color={"white"}/>
                                                    }
                                                    gd={{border: 'none'}}
                                            >
                                            </Button>
                                            :
                                            <Button theme={'reset'}
                                                    onClick={() => handlePlaySong(index)}
                                                    icon={<FaPlay size={20} style={{paddingLeft: 5}} color={"white"}/>}
                                                    gd={{border: 'none'}}
                                            >
                                            </Button>
                                    }
                                </Flex>
                            </Flex>
                        ))}
                    </Grid>
                </Group>
                <Group className={'single'}>
                    <Flex alignItems="center" justifyContent="between">
                        <Typography tag="h2">Single & EP</Typography>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos />} iconPosition="right" gap={1} />
                    </Flex>
                    <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                        {artist.albums && artist.albums.map((album, index) => (
                            <Card srcImg={album.coverImageUrl} title={album.title} urlLink={`/albums/${album.albumId}`}
                                  LinkComponent={Link} description={album.provide}>
                            </Card>
                        ))}
                    </Grid>
                </Group>
                <Group className={'album'}>
                    <Flex alignItems="center" justifyContent="between">
                        <Typography tag="h2">Albums</Typography>
                        <Button text="Tất cả" theme="transparent" size={1} icon={<MdArrowForwardIos />} iconPosition="right" gap={1} />
                    </Flex>

                    {/*Test Album*/}
                    <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                        {artist.albums && artist.albums.map((album, index) => (
                            <Card srcImg={album.coverImageUrl} title={album.title} urlLink={`/albums/${album.albumId}`}
                                  LinkComponent={Link} description={album.provide}>
                            </Card>
                        ))}
                    </Grid>
                </Group>
                <Group className={'biography'}>
                    <Typography tag="h2">Về {artist.artistName}</Typography>
                    <Flex justifyContent={'start'} alignItems={'start'} flexWrap={'wrap'}>
                        <Avatar src={artist.avatar} size={350} shape={'square'} alt={artist.artistName}></Avatar>
                        <Group className={'biography'} gd={{ width: '50%'}}>
                            <p dangerouslySetInnerHTML={{__html: artist.biography}}></p>
                            <Flex className={'follow-award'} justifyContent={'start'}>
                                <svg width="50" height="50" viewBox="0 0 56 40" className="zing-choice-award">
                                    <path fill="currentColor"
                                          d="M21.343 33.177c.678 0 1.253.152 1.725.454.472.303.813.72 1.023 1.253l-1.186.484c-.29-.661-.82-.992-1.586-.992-.339 0-.652.087-.938.26-.287.174-.513.418-.678.732-.166.315-.248.678-.248 1.09 0 .412.082.775.248 1.09.165.314.391.559.678.732.286.174.599.26.938.26.387 0 .72-.086.999-.26.278-.173.494-.426.647-.757l1.175.509c-.242.525-.602.94-1.078 1.247-.476.307-1.049.46-1.719.46-.613 0-1.162-.141-1.646-.424-.485-.282-.862-.672-1.132-1.168-.27-.496-.406-1.06-.406-1.689 0-.63.135-1.192.406-1.689.27-.496.647-.886 1.132-1.168.484-.283 1.033-.424 1.646-.424zm13.874 0c.613 0 1.166.146 1.659.436.492.29.875.686 1.15 1.186.274.5.411 1.054.411 1.66 0 .612-.137 1.17-.411 1.67-.275.5-.656.894-1.144 1.18-.489.287-1.043.43-1.665.43-.621 0-1.178-.143-1.67-.43-.493-.286-.876-.68-1.15-1.18-.275-.5-.412-1.058-.412-1.67 0-.614.137-1.171.411-1.672.275-.5.658-.893 1.15-1.18.493-.287 1.05-.43 1.671-.43zm10.303 0c.678 0 1.253.152 1.725.454.472.303.813.72 1.023 1.253l-1.187.484c-.29-.661-.819-.992-1.586-.992-.339 0-.651.087-.938.26-.286.174-.512.418-.678.732-.165.315-.248.678-.248 1.09 0 .412.083.775.248 1.09.166.314.392.559.678.732.287.174.6.26.938.26.388 0 .72-.086 1-.26.278-.173.494-.426.647-.757l1.174.509c-.242.525-.601.94-1.077 1.247-.476.307-1.05.46-1.72.46-.613 0-1.162-.141-1.646-.424-.484-.282-.861-.672-1.132-1.168-.27-.496-.405-1.06-.405-1.689 0-.63.135-1.192.405-1.689.27-.496.648-.886 1.132-1.168.484-.283 1.033-.424 1.647-.424zm6.658 0c.622 0 1.158.135 1.61.406.452.27.797.643 1.035 1.12.239.476.358 1.017.358 1.622 0 .161-.009.299-.025.412h-4.77c.057.589.267 1.043.63 1.361.363.32.787.479 1.271.479.396 0 .735-.091 1.017-.273.283-.181.509-.421.678-.72l1.077.52c-.282.509-.657.909-1.125 1.2-.469.29-1.03.435-1.683.435-.597 0-1.136-.141-1.616-.424-.48-.282-.856-.672-1.126-1.168-.27-.496-.406-1.055-.406-1.677 0-.589.131-1.136.394-1.64.262-.505.627-.906 1.095-1.205.468-.298.997-.448 1.586-.448zm-25.617-2.3v2.373l-.073.968h.073c.178-.306.442-.557.793-.75.351-.194.736-.29 1.156-.29.75 0 1.324.223 1.72.671.395.448.592 1.047.592 1.798v3.898h-1.295v-3.729c0-.476-.127-.835-.381-1.077-.255-.242-.58-.363-.975-.363-.298 0-.57.087-.817.26-.246.174-.44.406-.581.696-.141.29-.212.597-.212.92v3.293h-1.307v-8.668h1.307zm14.48 2.494v6.174h-1.308v-6.174h1.307zM21.491 0l5.573 14.824h15.471l-5.16 4.052h-10.31L22.891 8.805l-3.874 10.071H8.27l8.155 7.153-2.948 9.854-5.207 3.654 4.073-15.08L0 14.824h16.426L21.492 0zm13.725 34.376c-.347 0-.668.085-.962.254-.295.17-.531.412-.709.726-.177.315-.266.682-.266 1.102 0 .42.089.787.266 1.102.178.315.414.557.709.726.294.17.615.254.962.254s.666-.084.956-.254c.291-.17.525-.411.703-.726.177-.315.266-.682.266-1.102 0-.42-.089-.787-.266-1.102-.178-.314-.412-.557-.703-.726-.29-.17-.609-.254-.956-.254zm16.973-.085c-.436 0-.805.133-1.107.4-.303.266-.511.621-.624 1.065h3.426c-.016-.226-.089-.452-.218-.678-.129-.226-.317-.414-.563-.563-.246-.15-.55-.224-.914-.224zm-11.803-3.583c.242 0 .45.084.623.254.174.17.26.375.26.617s-.086.45-.26.624c-.174.173-.381.26-.623.26-.243 0-.45-.087-.624-.26-.173-.174-.26-.382-.26-.624s.087-.448.26-.617c.174-.17.381-.254.624-.254zm1.634-9.295c.662 0 1.271.117 1.828.35.557.235 1.029.562 1.416.981l-.92.92c-.589-.661-1.364-.992-2.324-.992-.565 0-1.094.135-1.586.405s-.884.656-1.174 1.156c-.29.5-.436 1.07-.436 1.707 0 .646.147 1.217.442 1.713.294.497.686.88 1.174 1.15.488.271 1.019.406 1.592.406.912 0 1.655-.286 2.228-.86.185-.177.34-.403.466-.677.125-.275.212-.577.26-.908h-2.978v-1.175h4.213c.048.275.072.509.072.703 0 .548-.086 1.07-.26 1.567-.173.497-.442.935-.805 1.314-.387.42-.851.74-1.392.962-.54.222-1.146.333-1.816.333-.823 0-1.582-.198-2.276-.593-.694-.395-1.245-.938-1.653-1.628-.407-.69-.611-1.46-.611-2.307s.204-1.616.611-2.306c.408-.69.959-1.233 1.653-1.628.694-.396 1.453-.593 2.276-.593zm-17.76.193v1.356l-4.504 6.053h4.552v1.26h-6.126v-1.356l4.54-6.054h-4.346v-1.259h5.884zm2.93 0v8.669h-1.332v-8.669h1.332zm3.523 0l3.922 6.368h.073l-.073-1.67v-4.698h1.32v8.669h-1.38l-4.117-6.695h-.072l.072 1.67v5.025h-1.32v-8.669h1.575z">

                                    </path>
                                </svg>
                            </Flex>
                        </Group>
                    </Flex>
                </Group>
            </Group>
        </Container>
    );
}