import {Avatar, Button, Card, Grid, Modal, Typography} from 'lvq';
import React from 'react';
import {toast} from "react-toastify";
import * as authenticationService from "../../core/services/AuthenticationService";
import {useNavigate} from "react-router-dom";

export const ModalMenuHeader = ({isOpen, onClose, avatar, fullName}) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        authenticationService.logout();
        toast.success("Đăng xuất thành công");
    }
    const handleEditUSer = async () => {
        navigate("/edit-user-information");
    }

    return (
            <Modal isOpen={isOpen} onClose={onClose} displayCoat={false} idControl="avatar_active_modal_sigup" position="relative" gd={{ top: '7.5%', right: '1%'}}>
                <Grid gd={{maxWidth: "400px"}}>
                    <Button text="Cập Nhật Thông tin" gap={8} rounded="rounded-full" gd={{minWidth: "240px"}} onClick={handleEditUSer}/>
                    <Button text="Đăng xuất" gap={8} rounded="rounded-full" gd={{minWidth: "240px"}} onClick={handleLogout}/>
                </Grid>
            </Modal>

    );
};
