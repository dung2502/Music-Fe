import React, {useEffect, useState} from "react";
import {Button, Card, Flex, Group, Table, Typography, useTheme} from "lvq";
import {getAllUsers} from "../../core/services/UserService";
import {getAllSongs} from "../../core/services/SongService";
import {getAllArtist} from "../../core/services/ArtistService";
import {getAllAlbums} from "../../core/services/AlbumService";
import {getAllPlaylists} from "../../core/services/PlayListService";
import CardDb from "./Card";
import {FaPeopleGroup} from "react-icons/fa6";
import {IoMusicalNotes} from "react-icons/io5";
import {GiMicrophone} from "react-icons/gi";
import {BiSolidAlbum} from "react-icons/bi";
import {RiPlayList2Line} from "react-icons/ri";

const DashboardStatus = () => {
    const [dashboardStats, setDashboardStats] = useState({
        users: 0,
        songs: 0,
        artists: 0,
        albums: 0,
        playlists: 0
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, songs, artists, albums, playlists] = await Promise.all([
                    getAllUsers(),
                    getAllSongs(),
                    getAllArtist(),
                    getAllAlbums(),
                    getAllPlaylists()
                ]);

                setDashboardStats({
                    users: Array.isArray(users) ? users.length : 0,
                    songs: Array.isArray(songs) ? songs.length : 0,
                    artists: Array.isArray(artists) ? artists.length : 0,
                    albums: Array.isArray(albums) ? albums.length : 0,
                    playlists: Array.isArray(playlists) ? playlists.length : 0
                });
            } catch (e) {
                console.error("Lỗi khi tải dữ liệu dashboard:", e);
            }
        };
        fetchData();
    }, []);

    return (
        <Group className='card-grid mb-6'>
            <CardDb icon={<FaPeopleGroup />} title="Cộng Tác Viên" value={dashboardStats.users} />
            <CardDb icon={<IoMusicalNotes />} title="Bài Hát" value={dashboardStats.songs} />
            <CardDb icon={<GiMicrophone />} title="Nghệ Sĩ" value={dashboardStats.artists} />
            <CardDb icon={<BiSolidAlbum />} title="Albums" value={dashboardStats.albums} />
            <CardDb icon={<RiPlayList2Line />} title="Danh Sách Phát" value={dashboardStats.playlists} />
        </Group>

    );
};

export default DashboardStatus;
