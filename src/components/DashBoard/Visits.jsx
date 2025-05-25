import React, {useEffect, useState} from "react";
import {Button, Card, Flex, Group, Table, Typography, useTheme} from "lvq";
import {Bar, Line} from "react-chartjs-2";
import {dataBar, optionsBar, optionsLine} from "../../assets/chartData";

const Visits = () => {
    return (
        <Group className="p-4">
            <Bar data={dataBar} options={optionsBar} />
        </Group>
    );
};

export default Visits;
