import {Link, Outlet, useNavigate} from "react-router-dom";
import {
    Button,
    Flex,
    Group,
    Layout,
    Header,
    Sidebar,
    Nav,
    RenderIf,
    useResponsive,
    useElementPosition,
    Input,
    Avatar,
    Main,
    ThemeSwitcher,
    SettingThemesButton,
    Typography
} from "lvq";
import Logo from '../assets/images/logo-music.png'

import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";
import {navigationDashboardItems1, navigationDashboardItems2 } from "../data";
import { SidebarDashboardMobile } from "../components/SideBar/SidebarDashboardMobile";
import {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {NotificationBox} from "../components/NotificationBox/NotificationBox";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import React from 'react';
import {ModalMenuHeader} from "../components/Modal/ModalMenu/ModalMenuHeader";
import shirt from "../assets/icons/shirt.svg";
import {ModalSelectTheme} from "../components/Modal/ModalMenu/ModalSelectTheme";
import {BiMessageRoundedDetail} from "react-icons/bi";
import {ChatBox} from "../components/ChatBox/ChatBox";
import * as notificationService from "../core/services/NotificationService";
import {getRoles} from "../core/services/AuthenticationService";

var stompClient = null;  // Biến toàn cục cho client STOMP

function LayoutDashboard() {
    const {position: positionHeader, elementRef: elementRefHeader} = useElementPosition();
    const {position: positionSidebar, elementRef: elementRefSideBar} = useElementPosition();
    const [openModalMenuDashboard, setOpenModalMenuDashboard] = useState(false)
    const navigate = useNavigate();
    const [openModalSelectTheme, setOpenModalSelectTheme] = useState(false)
    const [openChatModal, setOpenChatModal] = useState(false);
    const [notifications, setNotifications] = useState([])
    const [openNotification, setOpenNotification] = useState(false)
    const [numberNotification, setNumberNotification] = useState(0)
    const [avatar, setAvatar] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const BASE_URL = process.env.REACT_APP_API_URL;


    useEffect(() => {
        if (user&&user.avatar) {
            setAvatar(user.avatar);
        } else{
            setAvatar('https://img.icons8.com/nolan/64/1A6DFF/C822FF/user-default.png');
        }
    }, []);


    const connect = () => {
        let Sock = new SockJS(`${BASE_URL}/ws`);
        stompClient = Stomp.over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe('/topic/noti-album', onMessageAlbum);
        stompClient.subscribe('/topic/noti-song', onMessageSong);
    }
    const onMessageAlbum =(message)=>{
        toast.dark("Vừa có album mới!", {autoClose: 500})
        console.log(JSON.parse(message.body))
        getAllNotifications(3)
    }
    const onMessageSong =(message)=>{
        toast.dark("Vừa có song mới!", {autoClose: 500})
        console.log(JSON.parse(message.body))
        getAllNotifications(3)

    }
    const onError=(error)=>{
        console.log(error)
    }

    useEffect(() => {
        console.log(localStorage.getItem('user'));
        connect();
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        getRoles().then((roles) => {
            const role = roles.find(r => r.roleName === 'ROLE_ADMIN') || roles[0];
            if (role) {
                getAllNotifications(role.roleId);
            }
        });

        if (openNotification === true) {
            updateMarkAllRead();
        }
    }, [openNotification]);
    const updateMarkAllRead =()=>{
        notificationService.updateMarkAllRead().then(res => console.log(res)).catch()
    }

    const breakpoints = useResponsive([480, 640, 768, 1024, 1280, 1536])

    const home = () => {
        navigate('/');
    }
    const [openModalAvatar, setOpenModalAvatar] = useState(false);

    const handleOpenSelectThemeModal = () => {
        setOpenModalSelectTheme(true);
    }

    const handleCloseSelectThemeModal = () => {
        setOpenModalSelectTheme(false);
    }
    const handleCloseChat = () => {
        setOpenChatModal(!openChatModal);
    }
    const handleCloseNotification = () => {
        setOpenNotification(!openNotification);
    }
    const getAllNotifications =(roleId)=>{
        console.log("Hello");
        notificationService.getAllNotifications(roleId).then(res => {
            setNotifications(res);
            console.log(res)
            const count = res.reduce((acc, notification) =>
                !notification.statusRead ? acc + 1 : acc, 0
            );
            setNumberNotification(count)
        }).catch(err=>console.log(err))
    }
    return (
        <Layout className={'layout-home'}>
            <Group className="flex h-full max-h-svh overlay">
                <RenderIf isTrue={true}>
                    <Sidebar ref={elementRefSideBar}
                             className="overflow-auto border-0 border-r border-dashed border-r-gray-400 hidden md:!flex ">
                        <Button text="" className="logo-app" theme="logo" size={1}
                                icon={<img src={Logo} height="60px" width="100%" onClick={() => home()}/>}/>
                        <Nav listNav={navigationDashboardItems1} LinkComponent={Link} activeClass="active-class"
                             overflow={false}/>
                    </Sidebar>
                </RenderIf>
                <Group>
                    <Header ref={elementRefHeader} fixed className="backdrop-blur bg-opacity-80 md:px-4"
                            gd={{left: positionSidebar.right}}>
                        <Flex gap={3} justifyContent="between">
                            <Flex gap={3} className="flex-1">
                                <RenderIf isTrue={[0, 1, 2].includes(breakpoints)}>
                                    <Button text="" theme="reset" icon={<MdMenuOpen size={24} color="gray"
                                                                                    onClick={() => setOpenModalMenuDashboard(!openModalMenuDashboard)}/>}/>
                                </RenderIf>
                                {/*Bổ sung thêm nút tiến lùi trang (Lưu ý !!!!)*/}
                                <RenderIf isTrue={[3, 4, 5, 6].includes(breakpoints)}>
                                    <Button text="" theme="transparent"
                                            className="btn-nav"
                                            icon={<FaArrowLeftLong className="nav-icon" />}
                                            onClick={() => navigate(-1)}
                                    />
                                    <Button text="" theme="transparent"
                                            className="btn-nav"
                                            icon={<FaArrowRightLong className="nav-icon" />}
                                            onClick={() => navigate(1)}
                                    />
                                </RenderIf>
                                <Input theme="search_2" className="search-home" placeholder="Tìm kiếm..."
                                       gd={{maxWidth: "500px"}}/>
                            </Flex>
                            <Flex gap={3}>
                                <RenderIf isTrue={[4, 5, 6].includes(breakpoints)}>
                                    <Flex className=" items-center">
                                        {/*<SettingThemesButton />*/}
                                        <Button text="" className="setting-home"
                                                theme="setting"
                                                icon={<img src={shirt} alt={"shirt"} style={{width: "1.5rem", height: '1.5rem'}}/> }
                                                rounded="rounded-full"
                                                onClick={handleOpenSelectThemeModal}
                                        />
                                    </Flex>
                                </RenderIf>

                                <Button text="" theme="reset" className="" size={1} icon={<><IoIosNotificationsOutline size={24} /><Typography tag="span" className="m-0 !-ml-3 bg-red-600 h-fit rounded-full text-white px-1 text-[12px]">{numberNotification}</Typography></>} rounded="rounded-full" onClick={()=>setOpenNotification(!openNotification)} />

                                {/*<Button text="" className="setting-home" theme="setting" icon={<CiSettings size={24}/>} rounded="rounded-full"/>*/}
                                <Button text="" className="setting-home" theme="setting" icon={<BiMessageRoundedDetail size={24} />} rounded="rounded-full"
                                        onClick={()=>setOpenChatModal(!openChatModal)}/>

                                <Avatar src={avatar} size={40} onClick={() => setOpenModalAvatar(!openModalAvatar)}  />

                            </Flex>
                        </Flex>
                    </Header>


                    <Main withShadow={false} className="p-0 md:p-4" gd={{marginTop: positionHeader.bottom}}>
                        <ModalMenuHeader isOpen={openModalAvatar} onClose={() => setOpenModalAvatar(!openModalAvatar)} avatar={avatar} fullName={user.fullName||''}/>
                        <Outlet/>
                    </Main>
                </Group>
            </Group>
            <RenderIf isTrue={[0, 1, 2].includes(breakpoints)}>
                <SidebarDashboardMobile isOpen={openModalMenuDashboard}
                                        onClose={() => setOpenModalMenuDashboard(!openModalMenuDashboard)}/>
            </RenderIf>
            <NotificationBox openNotification={openNotification} callOpenNotification={handleCloseNotification} notifications={notifications}></NotificationBox>
            <ChatBox openChat={openChatModal} callCloseChat={handleCloseChat} />

            <ModalSelectTheme
                isOpen={openModalSelectTheme}
                onClose={handleCloseSelectThemeModal}
            />
        </Layout>
    );
}

export default LayoutDashboard;