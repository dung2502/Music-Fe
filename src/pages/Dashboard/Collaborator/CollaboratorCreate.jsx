import React, { useEffect, useState } from "react";
import {
    Avatar,
    Button,
    Container,
    ErrorMessage,
    Flex,
    Form,
    Grid,
    Group,
    Input,
    Label,
    Typography
} from "lvq";
import { IoArrowBackSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as userService from "../../../core/services/UserService";
import { UploadOneImage } from "../../../firebase/UploadImage";

export function CollaboratorCreate() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [avatar, setAvatar] = useState(null);
    const [validateError, setValidateError] = useState({}); // object thay vì array

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        reset
    } = useForm();

    useEffect(() => {
        if (id !== undefined) {
            (async () => {
                const temp = await userService.getUserById(id);
                if (temp) {
                    reset({
                        ...temp,
                        gender: temp.gender !== null ? String(temp.gender) : "",
                        dateOfBirth: temp.dateOfBirth ? temp.dateOfBirth : ""
                    });
                    setAvatar(temp.avatar);
                }
            })();
        }
    }, [id, reset]);

    const handleOneImageUrlChange = (uploadedImageUrl) => {
        setAvatar(uploadedImageUrl);
    };

    const handleRemoveImg = () => {
        setAvatar(null);
    };

    const onSubmit = async (data) => {
        data.gender = data.gender === "" ? null : Number(data.gender);
        data.avatar = avatar;

        let newErrors = {};

        if (!data.fullName || data.fullName.trim() === "") {
            newErrors.fullName = "Họ và tên không được để trống!";
        }
        if (!data.email || data.email.trim() === "") {
            newErrors.email = "Email không được để trống!";
        }
        if (!data.userCode || data.userCode.trim() === "") {
            newErrors.userCode = "Mã người dùng không được để trống!";
        }
        // Nếu cần bắt avatar bắt buộc uncomment
        // if (!avatar) {
        //     newErrors.avatar = "Ảnh đại diện không được để trống!";
        // }

        if (Object.keys(newErrors).length > 0) {
            setValidateError(newErrors);
            return;
        } else {
            setValidateError({});
        }

        try {
            if (id !== undefined) {
                console.log(data);
                await userService.updateUser(data);
                toast.success("Cập nhật người dùng thành công!");
            } else {
                await userService.saveUser(data);
                toast.success("Thêm mới người dùng thành công!");
            }
            navigate("/dashboard/users");
        } catch (e) {
            if (e.errorMessage && typeof e.errorMessage === "object") {
                setValidateError(e.errorMessage);
                toast.warn("Kiểm tra lại việc nhập!");
            } else {
                toast.error("Thao tác thất bại!");
            }
        }
    };

    return (
        <Container>
            <Flex justifyContent="between">
                <Typography tag="h1">{id ? "Cập nhật cộng tác viên" : "Thêm mới cộng tác viên"}</Typography>
                <Button
                    text="Về danh sách"
                    icon={<IoArrowBackSharp />}
                    gap={1}
                    onClick={() => navigate("/dashboard/collaborators")}
                />
            </Flex>
            <Group className="overflow-hidden">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid md={2} gap={4}>

                        <Label>
                            <Typography>Họ và tên</Typography>
                            <Input
                                size={4}
                                placeholder="Họ và tên"
                                {...register("fullName", {
                                    required: "Không được để trống!"
                                })}
                            />
                            <ErrorMessage condition={errors?.fullName} message={errors.fullName?.message} />
                            <ErrorMessage condition={validateError?.fullName} message={validateError.fullName} />
                        </Label>

                        <Label>
                            <Typography>Email</Typography>
                            <Input
                                size={4}
                                placeholder="Email"
                                {...register("email", {
                                    required: "Không được để trống!"
                                })}
                            />
                            <ErrorMessage condition={errors?.email} message={errors.email?.message} />
                            <ErrorMessage condition={validateError?.email} message={validateError.email} />
                        </Label>

                        <Label>
                            <Typography>Mã người dùng</Typography>
                            <Input
                                size={4}
                                placeholder="Mã người dùng"
                                {...register("userCode", {
                                    required: "Không được để trống!"
                                })}
                            />
                            <ErrorMessage condition={errors?.userCode} message={errors.userCode?.message} />
                            <ErrorMessage condition={validateError?.userCode} message={validateError.userCode} />
                        </Label>

                        <Label>
                            <Typography>Số điện thoại</Typography>
                            <Input size={4} placeholder="Số điện thoại" {...register("phoneNumber")} />
                        </Label>

                        <Label>
                            <Typography>Giới tính</Typography>
                            <select {...register("gender")} defaultValue="">
                                <option value="">-- Chọn giới tính --</option>
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                            </select>
                            <ErrorMessage condition={validateError?.gender} message={validateError.gender} />
                        </Label>

                        <Label>
                            <Typography>Ngày sinh</Typography>
                            <Input size={4} type="date" {...register("dateOfBirth")} />
                        </Label>

                        <Label>
                            <Typography>Địa chỉ</Typography>
                            <Input size={4} placeholder="Địa chỉ" {...register("address")} />
                        </Label>

                        <Label>
                            <Typography>Ảnh đại diện</Typography>
                            <Flex>
                                <UploadOneImage
                                    className="form-label-child"
                                    onImageUrlChange={handleOneImageUrlChange}
                                />
                            </Flex>
                            <ErrorMessage condition={validateError?.avatar} message={validateError.avatar} />
                            <Flex justifyContent="space-between" alignItems="center" gd={{ width: "100%", flexWrap: "wrap" }}>
                                {avatar && (
                                    <Flex
                                        justifyContent="start"
                                        alignItems="center"
                                        gd={{
                                            position: "relative",
                                            width: 150,
                                            height: 150,
                                            borderRadius: 10,
                                            padding: 5,
                                            marginTop: 10
                                        }}
                                    >
                                        <Avatar
                                            shape={"square"}
                                            size={150}
                                            src={avatar}
                                            alt={avatar}
                                            gd={{ borderRadius: 10 }}
                                        />
                                        <Button
                                            className="pop-artist"
                                            size={1}
                                            gd={{
                                                position: "absolute",
                                                right: -10,
                                                top: -10,
                                                backgroundColor: "#2f2739",
                                                borderRadius: "50%",
                                                color: "red"
                                            }}
                                            onClick={handleRemoveImg}
                                            text={"X"}
                                        ></Button>
                                    </Flex>
                                )}
                            </Flex>
                        </Label>
                    </Grid>

                    <Flex className="form-btn-mt">
                        <Button type="submit" text={id ? "Cập nhật" : "Thêm mới"} size={4} icon={<IoMdAdd />} gap={1} />
                    </Flex>
                </Form>
            </Group>
        </Container>
    );
}
