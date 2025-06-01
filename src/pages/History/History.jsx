import React, { useEffect, useState } from "react";
import * as songService from "../../core/services/SongService";
import { Card, Grid, Group, Typography } from "lvq";
import { Link } from "react-router-dom";
import { AiFillPlayCircle } from "react-icons/ai";

function History() {
    const [recentListens, setRecentListens] = useState([]);

    useEffect(() => {
        const fetchRecentListens = async () => {
            const data = await songService.getRecentUserListens();
            setRecentListens(data);
        };

        fetchRecentListens().catch(console.error);
    }, []);

    const groupByDate = (listens) => {
        return listens.reduce((acc, listen) => {
            const date = listen.listenedAt?.split("T")[0];
            if (!date) return acc;
            if (!acc[date]) acc[date] = [];
            acc[date].push(listen);
            return acc;
        }, {});
    };

    const groupedListens = groupByDate(recentListens);
    const sortedDates = Object.keys(groupedListens).sort((a, b) => new Date(b) - new Date(a)); // mới -> cũ

    return (
        <Group>
            <Typography tag="h1" gd={{ fontSize: "40px", marginBottom: "16px", color: "white" }}>
                NGHE GẦN ĐÂY <AiFillPlayCircle style={{ paddingTop: "10px" }} />
            </Typography>

            {sortedDates.map((date) => (
                <Group key={date}>
                    <Typography tag="h2" gd={{ fontSize: "28px", marginTop: "24px", color: "white" }}>
                       Ngày: {date}
                    </Typography>
                    <Grid columns={2} sm={2} md={3} xl={6} gap={6}>
                        {groupedListens[date].map((listen, index) => (
                            <Card
                                key={index}
                                srcImg={listen.song.coverImageUrl}
                                title={listen.song.title}
                                urlLink={`/song/${listen.song.songId}`}
                                LinkComponent={Link}
                                description={listen.song.artists.map(artist => artist.artistName).join(", ")}
                            />
                        ))}
                    </Grid>
                </Group>
            ))}
        </Group>
    );
}

export default History;
