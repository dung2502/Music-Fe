import {Avatar, Button, Card, Container, Flex, Grid, Group, Table, Typography} from "lvq";
import {usePlayMusic} from "../../core/contexts/PlayMusicContext";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as albumService from "../../core/services/AlbumService";
import "./Album.css";

export function Album() {
    const {
        playSongList,
        songIndexList,
        addSongList,
        changeSongIndex,
        toggleIsPlayingSong,
        isPlayingSong,
    } = usePlayMusic();
    const {id} = useParams();
    const [album, setAlbum] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            await getAlbumById(id);
        };
        fetchData();
    }, [id]);

    const getAlbumById = async (id) => {
        const temp = await albumService.getAlbumById(id);
        setAlbum(temp);
    }

    const handlePlayAlbum = () => {
        if (playSongList !== album.songs) {
            addSongList(album.songs);
            changeSongIndex(0);
        } else {
            isPlayingSong ? toggleIsPlayingSong(false) : toggleIsPlayingSong(true);
        }
    };

    const handlePlaySong = (index) => {
        if (playSongList !== album.songs) {
            addSongList(album.songs);
        }
        changeSongIndex(index);
    };

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
            render: (row) => (<Card sizeImg={60} long={true} srcImg={row.coverImageUrl} title={row.title}
                                    description={row.artists?.map((artist, index) => (
                                        <Link key={artist.artistId}>
                                            {artist.artistName}
                                            {index !== row.artists.length - 1 && <span>, </span>}
                                        </Link>))}/>
            ),
        },
        {
            key: 'duration',
            header: '',
            render: (row) =>
                <Typography right tag="small"
                            gd={{display: "block"}}>{((row.duration) / 60).toFixed(2).replace('.', ':')}</Typography>,
        }
    ];

    return (
        <Container withShadow={false} gd={{overflow: "hidden"}}>

            <Flex justifyContent="space-between" alignItems="flex-start" flexWrap={'wrap'}>
                <Group className={'album-card'}
                       gd={{
                           backgroundColor: 'transparent',
                           textAlign: 'center',
                           minWidth: '25%',
                           maxWidth: '100%',
                           width: '25%'
                       }}>
                    <Card srcImg={album.coverImageUrl}
                          children={
                              <Group>
                                  <Typography tag={"h1"}>{album.title}</Typography>
                                  <Flex center>
                                      <Typography>Nghệ sĩ:</Typography>
                                      <Typography>
                                          {album.artists?.map((artist, index) => (
                                              <a key={artist.artistId}>{artist.artistName}
                                                  {index !== album.artists.length - 1 && <span>, </span>}
                                              </a>
                                          ))}
                                      </Typography>
                                  </Flex>
                                  <Typography>100 người yêu thích</Typography>
                                  <Flex center>
                                      <Button onClick={handlePlayAlbum} text={'Phát ngẫu nhiên'}></Button>
                                  </Flex>
                              </Group>
                          }
                    >
                    </Card>
                </Group>

                <Group className={'album-song-list'}
                       gd={{backgroundColor: 'transparent', minWidth: '74%', maxWidth: '100%', width: '74%'}}>
                    {album.songs && <Table border={false} columns={columns} data={album.songs} rowKey={"id"}
                                           className="custom-table" onClickRow={(index) => handlePlaySong(index)}
                    />}
                </Group>
            </Flex>

            <Group>
                <Typography tag={"h2"}>Nghệ sĩ tham gia</Typography>
                <Grid columns={2} xs={2} sm={3} md={3} lg={5}>
                    {album.artists && album.artists.map(artist => (
                        <Card key={artist} shape="circle" srcImg={artist.avatar}
                              urlLink={`/artists/${artist.artistId}`}
                              LinkComponent={Link}
                              alt={artist.artistName} title={artist.artistName}/>
                    ))}
                </Grid>
            </Group>
        </Container>
    );
}