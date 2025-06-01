import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Flex, Group, Layout, Header, Sidebar, Nav, RenderIf, useResponsive, useElementPosition, Input, Avatar, Main, Footer, Grid, Card, SettingThemesButton, Typography, AudioPlayer, cn } from "lvq";
import Logo from '../assets/images/logo-music.png'
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import {CiHome, CiSettings} from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";
import React, {useEffect, useState} from "react";
import {PlayMusicFooter} from "../components/Footer/PlayMusicFooter";
import {usePlayMusic} from "../core/contexts/PlayMusicContext";
import { ModalUserAccess } from "../components/Modal/ModalMenu/ModalUserAccess";
import { navigationHomeItems1, navigationHomeItems2, navigationHomeItems3 } from "../data";
import {LyricAndComment} from "../components/LyricAndComment/LyricAndComment";
import { SidebarHomeMobile } from "../components/SideBar/SidebarHomeMobile";
import { getRoles } from "../core/services/AuthenticationService";

import {toast} from "react-toastify";
import {NotificationBox} from "../components/NotificationBox/NotificationBox";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import * as notificationService from "../core/services/NotificationService";

import {PlayQueue} from "../components/Play-queue/PlayQueue";
import ModalSearch from "../components/Modal/ModalMenu/ModalSearch";
import InputSearchHome from "../components/InputSearch/InputSearchHome";
import ModalSongMenu from "../components/Modal/ModalMenu/ModalSongMenu";
import CreatePlaylistModal from "../components/Modal/ModalCreatePlaylist/CreatePlaylistModal";
import {ModalSelectTheme} from "../components/Modal/ModalMenu/ModalSelectTheme";
import {IoShirt} from "react-icons/io5";
import shirt from "../assets/icons/shirt.svg";
import {BiMessageRoundedDetail} from "react-icons/bi";
import {ChatBox} from "../components/ChatBox/ChatBox";
import ModalMenuSigUp from "../components/Modal/ModalMenuSign/ModalMenuSign";
import * as userService from "../core/services/UserService";

var stompClient = null;
const BASE_URL = process.env.REACT_APP_API_URL;

function LayoutHome() {
    const [isShowPlayLyrics, setShowPlayLyrics] = useState(false);
    const [isShowQueues, setIsShowQueues] = useState(false);
    const [isOpenSongMenu, setIsOpenSongMenu] = useState(false);
    const [isModalPlaylistOpen, setIsModalPlaylistOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isVip, setIsVip] = useState(false);
    const [userIf, setUserIf] = useState(null);

    const {
        playSongList,
        songIndexList,
        isPlayingSong,
    } = usePlayMusic();
    // const isAuthenticated = !!localStorage.getItem("isAuthenticated");
    const [avatar, setAvatar] = useState(null);
    const { position: positionHeader, elementRef: elementRefHeader } = useElementPosition();
    const { position: positionSidebar, elementRef: elementRefSideBar } = useElementPosition();
    const { position: positionFooter, elementRef: elementRefFooter } = useElementPosition();

    const [openModalSearch, setOpenModalSearch] = useState(false)
    const [openModalAvatar, setOpenModalAvatar] = useState(false)
    const [openModalMenuHome, setOpenModalMenuHome] = useState(false)
    const [openModalSelectTheme, setOpenModalSelectTheme] = useState(false)
    const [openNotification, setOpenNotification] = useState(false)
    const [numberNotification, setNumberNotification] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [openChatModal, setOpenChatModal] = useState(false);
    const isAuthenticated = !!localStorage.getItem('user');
    const [isOpenModalMenuLogin, setIsOpenModalMenuLogin] = useState(false);



    const [positionInputSearch, setPositionInputSearch] = useState({top: 0, left: 0, bottom: 0, right: 0});

    const navigate = useNavigate();

    const breakpoints = useResponsive([480, 640, 768, 1024, 1280, 1536])

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

    const getUser = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const temp = await userService.getUserById(user.userId);
        setUserIf(temp);
        setIsVip(temp.isVip);
    };

    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        if (user&&user.avatar) {
            setAvatar(user.avatar);
        } else{
            setAvatar('https://img.icons8.com/nolan/64/1A6DFF/C822FF/user-default.png');
        }
        if (isAuthenticated) {
            getUser();
        }
    }, []);

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
        getRoles().then((res) => {
            const rolesArray = Array.isArray(res) ? res : res.data || Object.values(res);
            if (!Array.isArray(rolesArray)) {
                console.error("roles is not a valid array:", res);
                return;
            }

            const role = rolesArray.find(r => r.roleName === 'ROLE_ADMIN') || rolesArray[0];
            if (role) {
                getAllNotifications(role.roleId);
            }
        }).catch(err => console.error("Error fetching roles:", err));

        if (openNotification === true) {
            updateMarkAllRead();
        }
    }, [openNotification]);


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
    const updateMarkAllRead =()=>{
        notificationService.updateMarkAllRead().then(res => console.log(res)).catch()
    }

    const home = () => {
        navigate('/');
    }

    const handleShowPlayLyrics = () => {
        setShowPlayLyrics(!isShowPlayLyrics);
    }
    const handleCloseNotification = () => {
        setOpenNotification(!openNotification);
    }
    const handleCloseChat = () => {
        setOpenChatModal(!openChatModal);
    }

    const getNumberNoRead =(amount)=>{
        setNumberNotification(amount)
    }


    const handleShowPlayList = () => {
        setIsShowQueues(!isShowQueues);
    }

    const handleChangeSearchValue = (value) =>{
        setSearchValue(value);
        setOpenModalSearch(!!value);
    }

    const handleOpenMenuSong = () => {
        setIsOpenSongMenu(!isOpenSongMenu);
    }

    const handleCloseSongMenu = () => {
        setIsOpenSongMenu(false);
    }

    const handleOpenPlaylistModal = () => {
        setIsModalPlaylistOpen(true);
    }

    const handleClosePlaylistModal = () => {
        setIsModalPlaylistOpen(false);
    }

    const handleOpenSelectThemeModal = () => {
        setOpenModalSelectTheme(true);
    }

    const handleCloseSelectThemeModal = () => {
        setOpenModalSelectTheme(false);
    }
    const handleModalMenuLogin = () => {
        // onClose();
        setIsOpenModalMenuLogin(true);
    };
    return (

        <Layout className={'layout-home'}>
            <Group className="flex h-full max-h-svh overlay " gd={{overflow:"hidden", height: '100vh'}}>
                <RenderIf isTrue={true}>
                    <Sidebar ref={elementRefSideBar} gd={{marginBottom: (positionFooter.bottom - positionFooter.top)}}
                             className="overflow-auto hidden md:!flex backdrop-blur bg-opacity-80">
                        <Button text="" className="logo-app" theme="logo" size={1}
                                icon={<img src={Logo} height="60px" onClick={() => home()}/>}/>
                        <Nav listNav={navigationHomeItems1} LinkComponent={Link} className="" activeClass="active-class"
                             overflow={false}/>
                        <Typography className="hr-top"></Typography>

                        <Nav listNav={navigationHomeItems2} LinkComponent={Link} className="" activeClass="active-class"/>

                       {isAuthenticated && (
                            <Nav listNav={navigationHomeItems3} LinkComponent={Link} className="" activeClass="active-class"/>
                        )}

                        {!isAuthenticated ? (
                            <Button theme={"reset"} text={"Thêm mới Playlist"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleModalMenuLogin();
                                    }}>
                            </Button>
                        ):(
                            <Button theme={"reset"} text={"Thêm mới Playlist"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenPlaylistModal();
                                    }}>
                            </Button>
                        )}

                        {!isVip && (<Button theme={"primary"} text={"Nâng cấp tài khoản"} className="mt-4" onClick={() => navigate('/vip')}></Button>)}
                    </Sidebar>
                </RenderIf>
                <Group>
                    <Header ref={elementRefHeader} fixed className="backdrop-blur bg-opacity-80 md:px-4"
                            gd={{left: positionSidebar.right}}>
                        <Flex gap={3} justifyContent="between">
                            <Flex gap={3} className="flex-1" gd={{position: "relative"}}>
                            <RenderIf isTrue={[0, 1, 2].includes(breakpoints)}>
                                    <Button text="" theme="reset" icon={<MdMenuOpen size={24} color="gray" />} onClick={() => setOpenModalMenuHome(true)} />
                                    <Button text="" theme="reset" icon={<MdMenuOpen size={24} color="gray" />} onClick={() => setOpenModalMenuHome(!openModalMenuHome)} />
                            </RenderIf>
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

                                <InputSearchHome onValueChange={(value)=>handleChangeSearchValue(value)}
                                                 onPositionChange={(position) => setPositionInputSearch(position)} />

                            </Flex>
                            <Flex gap={3}>

                                <RenderIf isTrue={[4, 5, 6].includes(breakpoints)}>
                                    <Flex className=" items-center">
                                        {isVip && (
                                            <Typography className="ml-2 text-yellow-500 font-bold">
                                                VIP
                                            </Typography>
                                        )}
                                        <Button text="" className="setting-home"
                                                theme="setting"
                                                icon={<img src={shirt} alt={"shirt"} style={{width: "1.5rem", height: '1.5rem'}}/> }
                                                rounded="rounded-full"
                                                onClick={handleOpenSelectThemeModal}
                                        />
                                    </Flex>
                                </RenderIf>
                                {
                                    isAuthenticated && (
                                        <Button text="" theme="reset" className="" size={1} icon={<><IoIosNotificationsOutline size={24} />
                                            <Typography tag="span" className="m-0 !-ml-3 bg-red-600 h-fit rounded-full text-white px-1 text-[12px]">{numberNotification}</Typography>
                                         </>} rounded="rounded-full" onClick={()=>setOpenNotification(!openNotification)} />
                                )}

                                {
                                    isAuthenticated && isVip && (
                                        <Button text="" className="setting-home" theme="setting" icon={<BiMessageRoundedDetail size={24} />} rounded="rounded-full"
                                                onClick={()=>setOpenChatModal(!openChatModal)}/>
                                    )
                                }

                                <Avatar src={avatar} size={40} id="avatar_active_modal_sigup" onClick={() => setOpenModalAvatar(!openModalAvatar)} />
                            </Flex>
                        </Flex>
                    </Header>

                    <Main withShadow={false} className="p-0 md:p-4" gd={{ marginTop: positionHeader.bottom, marginBottom: (positionFooter.bottom - positionFooter.top) }}>
                        <Outlet />
                    </Main>
                </Group>
            </Group>
            <Footer ref={elementRefFooter} className={cn("flex items-center backdrop-blur !py-2", playSongList.length < 1 && "hidden")}
                    fixed gd={{ height: "78px" }}>
                <PlayMusicFooter callPlayLyrics={handleShowPlayLyrics}
                                 callPlayList={handleShowPlayList}
                                 openMenuSongFooter={handleOpenMenuSong}
                />
            </Footer>


            <LyricAndComment showLyrics={isShowPlayLyrics}></LyricAndComment>

            <PlayQueue showPlayList={isShowQueues}></PlayQueue>
            <ModalSearch isOpen={openModalSearch} searchValue={searchValue} onClose={() => setOpenModalSearch(false) } position={positionInputSearch}/>

            <ModalUserAccess isOpen={openModalAvatar} onClose={() => setOpenModalAvatar(!openModalAvatar)} />
            <RenderIf isTrue={[0, 1, 2].includes(breakpoints)}>
                <SidebarHomeMobile
                    isOpen={openModalMenuHome}
                    onClose={() => setOpenModalMenuHome(!openModalMenuHome)}
                    openPlaylistModal={handleOpenPlaylistModal}
                    openSelectThemeModal={handleOpenSelectThemeModal}
                />
            </RenderIf>

            <NotificationBox openNotification={openNotification} callOpenNotification={handleCloseNotification} notifications={notifications}></NotificationBox>
            <ChatBox openChat={openChatModal} callCloseChat={handleCloseChat} />


            {playSongList.length > 0 &&
                <ModalSongMenu
                    isOpen={isOpenSongMenu}
                    onClose={handleCloseSongMenu}
                    song={playSongList[songIndexList]}
                ></ModalSongMenu>
            }
                <CreatePlaylistModal
                    isOpen={isModalPlaylistOpen}
                    onClose={handleClosePlaylistModal}
                ></CreatePlaylistModal>
            <ModalSelectTheme
                isOpen={openModalSelectTheme}
                onClose={handleCloseSelectThemeModal}
            />
            <ModalMenuSigUp isOpen={isOpenModalMenuLogin} onClose={() => setIsOpenModalMenuLogin(false)} />
        </Layout>
    );
}

export default LayoutHome;
