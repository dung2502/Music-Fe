import React, { useEffect, useState } from 'react';
import { Container, Table, Typography, Flex, Group, Form, Input, Button, Pagination } from 'lvq';
import { useForm } from 'react-hook-form';
import './Vip.scss';
import * as paymentService from '../../core/services/PaymentService';
import Moment from 'moment';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [contentSearch, setContentSearch] = useState("");
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        getAllPaymentsUser(currentPage);
    }, [currentPage]);


    const getAllPaymentsUser = async (page) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const temp = await paymentService.getAllPaymentsUser(user.userId, page - 1);
        setPayments(temp.content);
        setTotalPages(temp.totalPages);
    };



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const columns = [
        {
            key: 'transactionCode',
            header: 'Mã giao dịch',
            render: (row) => row.transactionCode,
        },
        {
            key: 'vipPackage',
            header: 'Gói VIP',
            render: (row) => row.vipPackage.name,
        },
        {
            key: 'amount',
            header: 'Số tiền',
            render: (row) => formatCurrency(row.amount),
        },
        {
            key: 'paymentMethod',
            header: 'Phương thức',
            render: (row) => row.paymentMethod,
        },
        {
            key: 'paymentTime',
            header: 'Thời gian',
            render: (row) => Moment(row.paymentTime).format("DD/MM/yyyy HH:mm"),
        },
        {
            key: 'status',
            header: 'Trạng thái',
            render: (row) => (
                <span className={`status-badge ${row.paymentStatus.toLowerCase()}`}>
                    {row.description}
                </span>
            ),
        },
    ];

    const onSubmit = (data) => {
        setContentSearch(data.contentSearch);
    };

    return (
        <Container>
            <Flex justifyContent='between'>
                <Typography tag="h1">Lịch sử thanh toán</Typography>
            </Flex>
            <Group>
                <Form className={'bg-transparent'} onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="text"
                        gd={{ maxWidth: "400px" }}
                        {...register("contentSearch")}
                        placeholder='Tìm kiếm giao dịch...'
                    />
                    <Button type={"submit"} text='Tìm kiếm' gd={{display: "none"}}/>
                </Form>
                <Table
                    border={false}
                    columns={columns}
                    data={payments}
                    rowKey={"paymentId"}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </Group>
        </Container>
    );
};

export default Payments;
