import {
    Avatar, Button, Container, ErrorMessage, Flex, Form, Grid, Group, Input, Label, Typography, Select
} from "lvq";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as authenticationService from "../../core/services/AuthenticationService";
import {toast} from "react-toastify";
import {IoArrowBackSharp} from "react-icons/io5";
import {IoMdAdd} from "react-icons/io";
import {motion} from "framer-motion";

function ChangePassword() {
    const navigate = useNavigate();
    const [validateError, setValidateError] = useState({});
    const {register, handleSubmit, formState: {errors}, watch} = useForm();
    const userLocal = JSON.parse(localStorage.getItem("user") || '{}');
    const id = userLocal.userId;

    const containerVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: {opacity: 0, x: -20},
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const onSubmit = async (data) => {
        const cleanData = {
            email: data.email,
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
        };

        try {
            await authenticationService.updatePasswordUser(cleanData, id);
            toast.success("Cập nhật mật khẩu thành công!");
            await authenticationService.logout();
        } catch (e) {
            toast.error("Thao tác thất bại!");
        }
    };

    const newPassword = watch("newPassword");

    return (
        <Container className="py-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Flex justifyContent='between' className="mb-4">
                    <motion.div variants={itemVariants}>
                        <Typography tag="h1" className="text-xl">Thay đổi mật khẩu</Typography>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Button
                            text='Về Trang Chủ'
                            icon={<IoArrowBackSharp/>}
                            gap={1}
                            onClick={() => navigate("/")}
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        />
                    </motion.div>
                </Flex>
                <Group>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Grid md={2} gap={4}>
                            {/* Email */}
                            <motion.div variants={itemVariants}>
                                <Label className="relative mb-10 block">
                                    <Typography className="mb-1">Email</Typography>
                                    <Input
                                        size={4}
                                        placeholder="Email"
                                        type="email"
                                        {...register("email", {
                                            required: "* Bắt buộc nhập trường này",
                                        })}
                                        className={`transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                    {errors.email && (
                                        <div className="absolute left-0 mt-1 text-red-500 text-sm">
                                            {errors.email.message}
                                        </div>
                                    )}
                                </Label>
                            </motion.div>

                            {/* Mật khẩu cũ */}
                            <motion.div variants={itemVariants}>
                                <Label className="relative mb-10 block">
                                    <Typography className="mb-1">Mật khẩu cũ</Typography>
                                    <Input
                                        size={4}
                                        type="password"
                                        placeholder="Nhập mật khẩu cũ"
                                        {...register("oldPassword", {
                                            required: "* Bắt buộc nhập trường này",
                                        })}
                                        className={`transition-all duration-300 ${errors.oldPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errors.oldPassword && (
                                        <div className="absolute left-0 mt-1 text-red-500 text-sm">
                                            {errors.oldPassword.message}
                                        </div>
                                    )}
                                </Label>
                            </motion.div>

                            {/* Mật khẩu mới */}
                            <motion.div variants={itemVariants}>
                                <Label className="relative mb-10 block">
                                    <Typography className="mb-1">Mật khẩu mới</Typography>
                                    <Input
                                        size={4}
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        {...register("newPassword", {
                                            required: "Mật khẩu không được để trống!",
                                            minLength: {
                                                value: 8,
                                                message: "Mật khẩu phải từ 8 đến 50 chữ!"
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: "Mật khẩu phải từ 8 đến 50 chữ!"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%/*?&_])[A-Z][A-Za-z\d@$!%*?/&]{7,49}$/,
                                                message: "Mật khẩu phải bắt đầu bằng một chữ hoa, chứa ít nhất một chữ thường, một chữ số, ký tự đặc biệt (@$!%*?&/_), và phải dài từ 8 đến 50 ký tự!"
                                            }
                                        })}
                                        className={`transition-all duration-300 ${errors.newPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errors.newPassword && (
                                        <div className="absolute left-0 mt-1 text-red-500 text-sm">
                                            {errors.newPassword.message}
                                        </div>
                                    )}
                                </Label>
                            </motion.div>

                            {/* Xác nhận mật khẩu */}
                            <motion.div variants={itemVariants}>
                                <Label className="relative mb-10 block">
                                    <Typography className="mb-1">Xác nhận mật khẩu</Typography>
                                    <Input
                                        size={4}
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                        {...register("confirmPassword", {
                                            required: "* Bắt buộc nhập trường này",
                                            validate: value =>
                                                value === newPassword || "Mật khẩu xác nhận phải giống mật khẩu mới!"
                                        })}
                                        className={`transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    />
                                    {errors.confirmPassword && (
                                        <div className="absolute left-0 mt-1 text-red-500 text-sm">
                                            {errors.confirmPassword.message}
                                        </div>
                                    )}
                                </Label>
                            </motion.div>
                        </Grid>

                        <Flex
                            className="button-mt"
                            gd={{
                                marginTop: "40px",
                                justifyContent: "center",
                            }}
                        >
                            <motion.div
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Button
                                    type="submit"
                                    text="Cập nhật"
                                    size={4}
                                    icon={<IoMdAdd/>}
                                    gap={1}
                                    className=""
                                />
                            </motion.div>
                        </Flex>
                    </Form>
                </Group>
            </motion.div>
        </Container>
    );
}

export default ChangePassword;
