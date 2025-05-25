import React, {useEffect, useState} from "react";
import {Button, Card, Flex, Group, Table, Typography, useTheme} from "lvq";
import {getAllUsers} from "../../core/services/UserService";
import {getAllSongListens, getAllSongs} from "../../core/services/SongService";
import {Line} from "react-chartjs-2";
import {optionsLine} from "../../assets/chartData";

const SongListen = () => {
    const [dataLine, setDataLine] = useState({ labels: [], datasets: [] });
    const [mode, setMode] = useState('month');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSongListens();
                if (!Array.isArray(data)) {
                    console.error("Expected array from getAllSongListens");
                    return;
                }

                const currentYear = new Date().getFullYear();
                const monthlyTotals = Array(12).fill(0);

                data.forEach(item => {
                    if (item && item.dateCreate) {
                        const date = new Date(item.dateCreate);
                        if (date.getFullYear() === currentYear) {
                            monthlyTotals[date.getMonth()] += item.total || 0;
                        }
                    }
                });

                const monthLabels = [
                    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
                    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
                    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
                ];

                const yearRange = [currentYear - 1, currentYear, currentYear + 1];
                const yearlyTotals = [0, 0, 0];

                data.forEach(item => {
                    if (item && item.dateCreate) {
                        const year = new Date(item.dateCreate).getFullYear();
                        const idx = yearRange.indexOf(year);
                        if (idx !== -1) {
                            yearlyTotals[idx] += item.total || 0;
                        }
                    }
                });

                if (mode === 'month') {
                    setDataLine({
                        labels: monthLabels,
                        datasets: [
                            {
                                label: 'Lượt nghe theo tháng',
                                data: monthlyTotals,
                                fill: false,
                                backgroundColor: 'rgba(75,192,192,0.4)',
                                borderColor: 'rgba(75,192,192,1)',
                            }
                        ]
                    });
                } else {
                    setDataLine({
                        labels: yearRange.map(y => `Năm ${y}`),
                        datasets: [
                            {
                                label: 'Lượt nghe theo năm',
                                data: yearlyTotals,
                                fill: false,
                                backgroundColor: 'rgba(153,102,255,0.4)',
                                borderColor: 'rgba(153,102,255,1)',
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error("Error fetching song listens data:", error);
            }
        };

        fetchData();
    }, [mode]);

    return (
        <Group className="px-4">
            <Group className="flex gap-4 mb-4">
                <button   onClick={() => setMode('month')} className={`btn-global ${mode === 'month' ? 'active' : ''}`}
                >
                    Theo tháng
                </button>
                <button  onClick={() => setMode('year')} className={`btn-global ${mode === 'year' ? 'active' : ''}`}
                >
                    Theo năm
                </button>
            </Group>
            <Line data={dataLine} options={optionsLine}/>
        </Group>

    );
};

export default SongListen;
