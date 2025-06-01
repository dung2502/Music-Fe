import {
    Avatar, Button, Container, ErrorMessage, Flex, Form, Grid, Group, Input, Label, Typography, Select
} from "lvq";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import * as userService from "../../core/services/UserService";
import {toast} from "react-toastify";
import {IoArrowBackSharp} from "react-icons/io5";
import {UploadOneImage} from "../../firebase/UploadImage";
import {IoMdAdd} from "react-icons/io";

function UserEditInformation() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [validateError, setValidateError] = useState({});
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const userLocal = JSON.parse(localStorage.getItem("user") || '{}');
    const id = userLocal.userId;

    useEffect(() => {
        if (id !== undefined) {
            const fetchData = async () => {
                await getUserById(id);
            };
            fetchData();
        }
    }, [id]);

    const getUserById = async (id) => {
        const temp = await userService.getUserById(id);
        if (temp) {
            setUser(temp);
            setValue("dateOfBirth", formatDateToDDMMYYYY(temp.dateOfBirth));
            Object.keys(temp).forEach(key => {
                if (key !== "dateOfBirth" && temp[key] !== undefined) {
                    setValue(key, temp[key]);
                }
            });
            setAvatar(temp.avatar);
        }
    };

    const handleOneImageUrlChange = async (uploadedImageUrl) => {
        setAvatar(uploadedImageUrl);
    };

    const handleRemoveImg = () => {
        setAvatar(null);
    };
    const formatDateToDDMMYYYY = (isoDateStr) => {
        const date = new Date(isoDateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };



    const onSubmit = async (data) => {
        const userAvatar = data.avatar || avatar;

        const cleanData = {
            fullName: data.fullName,
            email: data.email,
            userCode: data.userCode,
            phoneNumber: data.phoneNumber,
            gender: parseInt(data.gender),
            dateOfBirth: parseDate(data.dateOfBirth),
            address: data.address,
            avatar: userAvatar,
            userId: data.userId,
        };


        console.log("Data gửi đi:", cleanData);

        try {
            await userService.updateUser(cleanData);
            toast.success("Cập nhật người dùng thành công!");
            navigate("/edit-user-information");
        } catch (e) {
            toast.error("Thao tác thất bại!");
            setValidateError(e.errorMessage || {});
        }
    };

    return (
        <Container>
            <Flex justifyContent='between'>
                <Typography tag="h1">Cập nhật cộng tác viên</Typography>
                <Button text='Về Trang Chủ' icon={<IoArrowBackSharp />} gap={1} onClick={() => navigate("/")} />
            </Flex>
            <Group className='overflow-hidden'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid md={2} gap={4}>

                        <Label>
                            <Typography>Họ và tên</Typography>
                            <Input size={4} placeholder="Họ và tên"
                                   {...register("fullName", {
                                       required: "Tên không được để trống!",
                                       maxLength: { value: 50, message: "Họ và tên không được quá 50 ký tự!" },
                                       pattern: {
                                           value: /^[A-Za-zÀ-ỹà-ỹĂăÂâÊêÔôƠơƯưĐđ\s]+$/,
                                           message: "Tên nhân viên không được chứa số hoặc ký tự đặc biệt!"
                                       }
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.fullName?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.fullName} />
                        </Label>

                        <Label>
                            <Typography>Email</Typography>
                            <Input size={4} placeholder="Email"
                                   {...register("email", {required: "Không được để trống!"})} />
                            <ErrorMessage condition={errors} message={errors?.email?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.email} />
                        </Label>

                        <Label>
                            <Typography>Mã người dùng</Typography>
                            <Input size={4} placeholder="Mã người dùng" disabled
                                   {...register("userCode", {
                                       pattern: {
                                           value: /^(NV|CU)\d{4}$/,
                                           message: "Mã nhân viên phải bắt đầu bằng NV hoặc CU và kết thúc bằng 4 chữ số!"
                                       }
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.userCode?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.userCode} />
                        </Label>

                        <Label>
                            <Typography>Số điện thoại</Typography>
                            <Input size={4} placeholder="Số điện thoại"
                                   {...register("phoneNumber", {
                                       required: "Số điện thoại không được bỏ trống!",
                                       pattern: {
                                           value: /^(?:\+84|0)\d{9}$/,
                                           message: "Số điện thoại phải bắt đầu bằng +84 hoặc 0 và có 9 chữ số!"
                                       }
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.phoneNumber?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.phoneNumber} />
                        </Label>

                        <Label>
                            <Typography>Giới tính</Typography>
                            <Select size={4} defaultValue=""
                                    {...register("gender", {
                                        required: "Giới tính không được bỏ trống!"
                                    })}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="0">Nam</option>
                                <option value="1">Nữ</option>
                            </Select>
                            <ErrorMessage condition={errors} message={errors?.gender?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.gender} />
                        </Label>

                        <Label>
                            <Typography>Ngày tạo</Typography>
                            <Input size={4} disabled value={formatDateToDDMMYYYY(user.dateCreate || '')} />
                        </Label>

                        <Label>
                            <Typography>Ngày hết hạn VIP </Typography>
                            <Input size={4} disabled value={formatDateToDDMMYYYY(user.vipExpiredDate)} />
                        </Label>

                        <Label className="flex items-center h-[100px]">
                            <Typography className="ml-2 text-yellow-500 font-bold text-2xl flex">
                                VIP
                            </Typography>
                        </Label>

                        <Label>
                            <Typography>Địa chỉ</Typography>
                            <Input size={4} placeholder="Địa chỉ"
                                   {...register("address", {
                                       required: "Địa chỉ không được để trống!",
                                       maxLength: {
                                           value: 255,
                                           message: "Địa chỉ không thể vượt quá tối đa 255 ký tự!"
                                       }
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.gender?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.gender} />
                        </Label>

                        <Label>
                            <Typography>Ngày sinh (dd/MM/yyyy)</Typography>
                            <Input size={4} placeholder="VD: 30/10/2003"
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
                            <Typography>Ảnh đại diện</Typography>
                            <Flex>
                                <UploadOneImage className='form-label-child'
                                                onImageUrlChange={handleOneImageUrlChange}/>
                            </Flex>
                            <ErrorMessage condition={validateError} message={validateError?.avatar}/>
                            <Flex justifyContent="start" alignItems="center" style={{flexWrap: 'wrap'}}>
                                {avatar &&
                                    <Flex justifyContent="start" alignItems="center"
                                          style={{
                                              position: "relative",
                                              width: 150,
                                              height: 150,
                                              borderRadius: 10,
                                              padding: 5,
                                              marginTop: 10
                                          }}>
                                        <Avatar shape='square' size={150} src={avatar} alt={avatar}
                                                style={{borderRadius: 10}}/>
                                        <Button className="pop-artist" size={1} style={{
                                            position: 'absolute',
                                            right: -10,
                                            top: -10,
                                            backgroundColor: "#2f2739",
                                            borderRadius: "50%",
                                            color: "red"
                                        }} onClick={handleRemoveImg} text="X"/>
                                    </Flex>
                                }
                            </Flex>
                        </Label>
                    </Grid>
                    <Flex className="form-btn-mt">
                        <Button type="submit" text="Cập nhật" size={4} icon={<IoMdAdd />} gap={1}/>
                    </Flex>
                </Form>
            </Group>
        </Container>
    );
}

export default UserEditInformation;
