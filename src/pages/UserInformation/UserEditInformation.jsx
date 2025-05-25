import {Avatar, Button, Container, ErrorMessage, Flex, Form, Grid, Group, Input, Label, Typography} from "lvq";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
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
    const [validateError, setValidateError] = useState([]);
    const {register, handleSubmit, formState: {errors}, setValue} = useForm();
    const userLocal = JSON.parse(localStorage.getItem("user") || '{}');
    const id = userLocal.userId;
    useEffect(() => {
        if (id !== undefined) {
            const fetchData = async () => {
                await getUserById(id);
            }
            fetchData();
        }
    }, [id]);

    const getUserById = async (id) => {
        const temp = await userService.getUserById(id);
        console.log(temp);
        if (temp) {
            setUser(temp);
            setValue("userId", temp.userId);
            setValue("userCode", temp.userCode);
            setValue("email", temp.email);
            setValue("fullName", temp.fullName);
            setValue("phoneNumber", temp.phoneNumber);
            setValue("avatar", temp.avatar);
            setAvatar(temp.avatar);
        }
    };

    const handleOneImageUrlChange = async (uploadedImageUrl) => {
        setAvatar(uploadedImageUrl);
    }

    const handleRemoveImg = () => {
        setAvatar(null);
    }

    const onSubmit = async (data) => {
        data.avatar = avatar;

        let flag = false;
        if (!data.fullName) {
            flag = true;
            setValidateError({fullName: "Họ và tên không được để trống!"});
        }
        if (!data.email) {
            flag = true;
            setValidateError({email: "Email không được để trống!"});
        }
        if (!data.userCode) {
            flag = true;
            setValidateError({userCode: "Mã người dùng không được để trống!"});
        }
        if (!avatar) {
            flag = true;
            setValidateError({avatar: "Ảnh đại diện không được để trống!"});
        }
        if (flag) return;

        try {
            if (id !== undefined) {
                await userService.updateUser(id, data);
                toast.success("Cập nhật người dùng thành công!");
            } else {
                await userService.saveUser(data);
                toast.success("Thêm mới người dùng thành công!");
            }
            navigate("/dashboard/users");
        } catch (e) {
            setValidateError(e.errorMessage);
            if (validateError) return toast.warn("Kiểm tra lại việc nhập!");
            toast.error("Thao tác thất bại!");
        }
    }

    return (
        <Container>
            <Flex justifyContent='between'>
                <Typography tag="h1">{id ? "Cập nhật cộng tác viên" : "Thêm mới cộng tác viên"}</Typography>
                <Button text='Về Trang Chủ' icon={<IoArrowBackSharp />} gap={1} onClick={() => navigate("/")} />
            </Flex>
            <Group className='overflow-hidden'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Grid md={2} gap={4}>
                        <Label>
                            <Typography>Họ và tên</Typography>
                            <Input size={4} placeholder="Họ và tên"
                                   {...register("fullName", {
                                       required: "Không được để trống!"
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.fullName?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.fullName}/>
                        </Label>
                        <Label>
                            <Typography>Email</Typography>
                            <Input size={4} placeholder="Email"
                                   {...register("email", {
                                       required: "Không được để trống!"
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.email?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.email}/>
                        </Label>
                        <Label>
                            <Typography>Mã người dùng</Typography>
                            <Input size={4} placeholder="Mã người dùng"
                                   {...register("userCode", {
                                       required: "Không được để trống!"
                                   })}
                            />
                            <ErrorMessage condition={errors} message={errors?.userCode?.message} />
                            <ErrorMessage condition={validateError} message={validateError?.userCode}/>
                        </Label>
                        <Label>
                            <Typography>Số điện thoại</Typography>
                            <Input size={4} placeholder="Số điện thoại"
                                   {...register("phoneNumber")}
                            />
                        </Label>
                        <Label>
                            <Typography>Ảnh đại diện</Typography>
                            <Flex>
                                <UploadOneImage className='form-label-child'
                                                onImageUrlChange={(url) => handleOneImageUrlChange(url)}/>
                            </Flex>
                            <ErrorMessage condition={validateError} message={validateError?.avatar}/>
                            <Flex justifyContent={'space-between'} alignItems="center" gd={{width: '100%', flexWrap: 'wrap'}}>
                                {avatar &&
                                    <Flex justifyContent="start" alignItems="center"
                                          gd={{
                                              position: "relative",
                                              width: 150,
                                              height: 150,
                                              borderRadius: 10,
                                              padding: 5,
                                              marginTop: 10
                                          }}>
                                        <Avatar shape={'square'} size={150} src={avatar} alt={avatar}
                                                gd={{borderRadius: 10}}/>
                                        <Button className="pop-artist" size={1} gd={{
                                            position: 'absolute',
                                            right: -10,
                                            top: -10,
                                            backgroundColor: "#2f2739",
                                            borderRadius: "50%",
                                            color: "red"
                                        }}
                                                onClick={handleRemoveImg}
                                                text={"X"}>
                                        </Button>
                                    </Flex>
                                }
                            </Flex>
                        </Label>
                    </Grid>
                    <Flex className="form-btn-mt">
                        <Button type="submit" text={id ? "Cập nhật" : "Thêm mới"} size={4} icon={<IoMdAdd />} gap={1}/>
                    </Flex>
                </Form>
            </Group>
        </Container>
    );
}

export default UserEditInformation;