import React, {useEffect, useState} from "react";
import {Button, Card, Flex, Group, Table, Typography, useTheme} from "lvq";
import {getAllUsers} from "../../core/services/UserService";
import {getAllSongs} from "../../core/services/SongService";
import {getAllArtist} from "../../core/services/ArtistService";
import {getAllAlbums} from "../../core/services/AlbumService";
import {getAllPlaylists} from "../../core/services/PlayListService";

const DetailedReportTable = () => {
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

    const reportData = [
        {
            category: "Cộng tác viên",
            total: dashboardStats.users,
            new: 2,
            percentageChange: "+3%",
            trend: "Tăng",
        },
        {
            category: "Bài hát",
            total: dashboardStats.songs,
            new: 30,
            percentageChange: "+12%",
            trend: "Tăng",
        },
        {
            category: "Nghệ sĩ",
            total: dashboardStats.artists,
            new: 3,
            percentageChange: "+4%",
            trend: "Tăng",
        },
        {
            category: "Album",
            total: dashboardStats.albums,
            new: 10,
            percentageChange: "+8%",
            trend: "Tăng",
        },
        {
            category: "Playlist",
            total: dashboardStats.playlists,
            new: 5,
            percentageChange: "+5%",
            trend: "Ổn định",
        },
    ];

    const columns = [
        {
            key: 'category',
            header: 'Loại nội dung',
            render: (row) => row.category,
        },
        {
            key: 'total',
            header: 'Tổng số',
            render: (row) => row.total
        },
        {
            key: 'new',
            header: 'Mới trong tháng',
            render: (row) => row.new
        },
        {
            key: 'percentageChange',
            header: 'Thay đổi (%)',
            render: (row) => row.percentageChange
        },
        {
            key: 'trend',
            header: 'Xu hướng',
            render: (row) => row.trend
        },
    ];

    return (
        <Group>
            <Typography tag="h2" className="text-2xl font-bold mb-6">
                Báo cáo & Phân tích chi tiết
            </Typography>
            <Group className="w-full">
                <Table border={false} columns={columns} data={reportData} rowKey={"id"} />
            </Group>
        </Group>
    );
};

export default DetailedReportTable;
