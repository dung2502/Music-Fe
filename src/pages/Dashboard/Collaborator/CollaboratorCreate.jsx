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
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const onSubmit = async (data) => {
        data.gender = data.gender === "" ? null : Number(data.gender);
        data.avatar = avatar;
        data.dateOfBirth = parseDate(data.dateOfBirth);
        try {
            if (id !== undefined) {
                console.log(data);
                await userService.updateUser(data);
                toast.success("Cập nhật người dùng thành công!");
            } else {
                await userService.saveUser(data);
                toast.success("Thêm mới người dùng thành công!");
            }
            navigate("/dashboard/collaborators");
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
                                    required: "Tên không được để trống!",
                                    maxLength: {
                                        value: 50,
                                        message: "Họ và tên không được quá 50 ký tự!"
                                    },
                                    pattern: {
                                        value: /^[A-Za-zÀ-ỹà-ỹĂăÂâÊêÔôƠơƯưĐđ\s]+$/,
                                        message: "Tên nhân viên không được chứa ký tự số hoặc đặc biệt!"
                                    }
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
                                    required: "Email không được để trống!",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Email không hợp lệ!"
                                    }
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
                                    required: "Mã người dùng không được để trống!",
                                    pattern: {
                                        value: /^(NV|CU)\d{4}$/,
                                        message: "Mã nhân viên phải bắt đầu bằng NV hoặc CU và kết thúc với 4 chữ số!"
                                    }
                                })}
                            />
                            <ErrorMessage condition={errors?.userCode} message={errors.userCode?.message} />
                            <ErrorMessage condition={validateError?.userCode} message={validateError.userCode} />
                        </Label>

                        <Label>
                            <Typography>Số điện thoại</Typography>
                            <Input
                                size={4}
                                placeholder="Số điện thoại"
                                {...register("phoneNumber", {
                                    required: "Số điện thoại không được bỏ trống!",
                                    pattern: {
                                        value: /^(?:\+84|0)\d{9}$/,
                                        message: "Số điện thoại phải bắt đầu bằng +84 hoặc 0 và kết thúc với 9 số!"
                                    }
                                })}
                            />
                        </Label>

                        <Label>
                            <Typography>Giới tính</Typography>
                            <select 
                                size={4} 
                                defaultValue=""
                                {...register("gender", {
                                    required: "Giới tính không được bỏ trống!"
                                })}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #2f2739',
                                    backgroundColor: 'rgb(99 102 241 / 0.3)',
                                    color:"white",
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <option value="">-- Chọn giới tính --</option>
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                            </select>
                            <ErrorMessage condition={errors} message={errors?.gender?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.gender} />
                        </Label>

                        <Label>
                            <Typography>Ngày sinh (dd/MM/yyyy)</Typography>
                            <Input size={4} placeholder="VD: 31/12/2000"
                                   {...register("dateOfBirth", {
                                       required: "Ngày sinh không được để trống!",
                                       pattern: {
                                           value: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                                           message: "Ngày sinh phải theo định dạng dd/MM/yyyy!"
                                       },
                                       validate: value => {
                                           const [day, month, year] = value.split("/");
                                           const dob = new Date(`${year}-${month}-${day}`);
                                           const now = new Date();
                                           const age = now.getFullYear() - dob.getFullYear();
                                           const monthDiff = now.getMonth() - dob.getMonth();
                                           const dayDiff = now.getDate() - dob.getDate();
                                           const is18 = age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
                                           return is18 || "Ngày sinh phải lớn hơn ngày hiện tại 18 năm!";
                                       }
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.dateOfBirth?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.dateOfBirth} />
                        </Label>

                        <Label>
                            <Typography>Địa chỉ</Typography>
                            <Input
                                size={4}
                                placeholder="Địa chỉ"
                                {...register("address", {
                                    required: "Địa chỉ không được để trống!",
                                    maxLength: {
                                        value: 255,
                                        message: "Địa chỉ không thể vượt quá 255 ký tự!"
                                    }
                                })}
                            />
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
