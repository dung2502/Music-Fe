import {
    Button,
    Container,
    Flex,
    Form,
    Group,
    Input,
    Pagination,
    Table,
    Typography
} from "lvq";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as userService from "../../../core/services/UserService";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function CollaboratorList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [contentSearch, setContentSearch] = useState("");
    const {register, handleSubmit, formState: {errors}, setValue, control} = useForm({

    });

    useEffect(() => {
        const fetchData = async () => {
            await getAllUsers(contentSearch, currentPage);
        };
        fetchData();
    }, [contentSearch, currentPage]);

    const getAllUsers = async (fullName, currentPage) => {
        const temp = await userService.getAllCustomer(fullName, currentPage);
        setUsers(temp.content);
        setTotalPages(temp.totalPages);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const onSubmit = (data) => {
        setContentSearch(data.contentSearch);
        console.log(data.contentSearch);
    };

    const columns = [
        {
            key: 'userCode',
            header: 'Mã người dùng',
            render: (row) => row.userCode,
        },
        {
            key: 'fullName',
            header: 'Họ tên',
            render: (row) => row.fullName,
        },
        {
            key: 'email',
            header: 'Email',
            render: (row) => row.email,
        },
        {
            key: 'dateCreate',
            header: 'Ngày tạo',
            render: (row) => new Date(row.dateCreate).toLocaleDateString("vi-VN"),
        },
        {
            key: 'action',
            header: '',
            render: (row) => (
                <Flex justifyContent="center">
                    <Button theme="reset" text="" onClick={() => navigate(`/dashboard/collaborator-update/${row.userId}`)}
                            icon={<CiEdit size={22} color="#eab308" />}/>
                    <Button theme="reset" text="" icon={<MdDelete size={22} color="red" />}
                    />
                </Flex>
            ),
        },
    ];

    return (
        <Container>
            <Flex justifyContent="between">
                <Typography tag="h1">Danh sách người dùng</Typography>
                <Button text="Thêm mới" onClick={() => navigate("/dashboard/collaborator-create")} />
            </Flex>
            <Group>
                <Form className={'bg-transparent'} onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" gd={{ maxWidth: "400px" }}{...register("contentSearch")}
                           placeholder="Tìm kiếm người dùng..."/>
                    <Button type={"submit"} text='Tìm kiếm' gd={{display: "none"}}/>
                </Form>
                <Table border={false} columns={columns} data={users} rowKey="userId"/>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
            </Group>
        </Container>
    );
}

export default CollaboratorList;
