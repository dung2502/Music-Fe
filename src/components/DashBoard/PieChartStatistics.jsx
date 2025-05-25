import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { Group, Typography, useTheme } from 'lvq'
import {getAllSongs} from "../../core/services/SongService";

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChartStatistics = () => {
    const { theme } = useTheme()
    const [chartData, setChartData] = useState({
        labels: ['Việt Nam', 'Âu Mỹ', 'Hàn Quốc'],
        datasets: [
            {
                label: 'Số bài nhạc',
                data: [0, 0, 0],
                backgroundColor: ['#34D399', '#60A5FA', '#F472B6'],
                borderWidth: 1
            }
        ]
    })

    useEffect(() => {
        async function fetchData() {
            const songs = await getAllSongs()

            const genreCount = {
                'Việt Nam': 0,
                'Âu Mỹ': 0,
                'Hàn Quốc': 0
            }

            songs.forEach(song => {
                song.genres?.forEach(genre => {
                    if (genre.genreName in genreCount) {
                        genreCount[genre.genreName] += 1
                    }
                })
            })

            setChartData({
                labels: Object.keys(genreCount),
                datasets: [
                    {
                        label: 'Số bài nhạc',
                        data: Object.values(genreCount),
                        backgroundColor: ['#34D399', '#60A5FA', '#F472B6'],
                        borderWidth: 1
                    }
                ]
            })
        }

        fetchData()
    }, [])

    const isDarkTheme = theme === 'theme_1' || theme === 'theme_3' || theme === 'theme_4'

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: isDarkTheme ? '#fff' : '#000',
                    padding: 15,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: isDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                titleColor: isDarkTheme ? '#fff' : '#000',
                bodyColor: isDarkTheme ? '#fff' : '#000',
                padding: 10,
                cornerRadius: 8,
                displayColors: true
            }
        }
    }

    return (
        <Group>
            <Typography gd={{ textAlign: 'center' }} tag="h3">
                Thống kê bài nhạc theo quốc gia
            </Typography>
            <Group className="w-full max-w-xs">
                <Pie gd={{ width: '100%' }} data={chartData} options={options} />
            </Group>
        </Group>
    )
}

export default PieChartStatistics
