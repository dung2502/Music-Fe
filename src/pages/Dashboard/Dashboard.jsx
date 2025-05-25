import React, {useEffect, useState} from 'react'
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js'
import DetailedReportTable from "../../components/DashBoard/DetailedReportTable"
import PieChartStatistics from "../../components/DashBoard/PieChartStatistics"
import "./DashBoard.css"
import {Card, Container, Group, Sidebar, Typography, useTheme} from "lvq"
import DashboardStatus from "../../components/DashBoard/DashboardStatus";
import SongListen from "../../components/DashBoard/SongListen";
import Visits from "../../components/DashBoard/Visits";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement)

function Dashboard() {
    return (
        <Container className={`dashboard-container py-8`}>
            <Group className='p-4 md:p-8'>
                <Typography tag={"h2"} className='text-2xl mb-4 dashboard-title'>Dashboard</Typography>
                <DashboardStatus/>
                <Group className='charts-grid'>
                    <Sidebar>
                        <Typography tag={"h3"} className='content-title text-lg mb-4 p-4'>Luợt Nghe</Typography>
                       <SongListen/>
                    </Sidebar>
                    <Sidebar>
                        <Typography tag={"h3"} className='content-title text-lg mb-4 p-4'>Lượt Truy Cập</Typography>
                        <Visits/>
                    </Sidebar>
                </Group>
            </Group>

            <Sidebar className="detailed-report-section flex" gd={{display: "flex", flexDirection: "row"}}>
                <Group gd={{width: "70%"}}>
                    <DetailedReportTable />
                </Group>
                <Group gd={{width: "30%"}}>
                    <PieChartStatistics />
                </Group>
            </Sidebar>
        </Container>
    )
}
export default Dashboard
