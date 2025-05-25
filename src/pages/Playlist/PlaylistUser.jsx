import {Button, Card, Container, Flex, Grid, Typography} from "lvq";
import {MdArrowForwardIos} from "react-icons/md";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import * as playlistsService from "../../core/services/PlayListService";

function PlaylistUser() {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            await getAllPlaylists();
        }
        fetchPlaylists().then().catch(console.error);
    }, [])

    const getAllPlaylists= async () => {
        const temp = await playlistsService.getAllPlaylistUser();
        setPlaylists(temp);
    }
    return (
        <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
            {playlists && playlists.map((playlist, index) => (
                <Card srcImg={playlist.coverImageUrl} title={playlist.playlistName} urlLink={`/playlist/${playlist.playlistId}`}
                              LinkComponent={Link} description={playlist.provide}>
                </Card>
            ))}
        </Grid>
    );
}

export default PlaylistUser;