import { Button, Grid, Modal } from 'lvq';
import React, { useEffect, useState } from 'react';
import ModalMenuSigUp from './ModalMenuSign';
import * as userService from "../../core/services/AuthenticationService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../../core/services/AuthenticationService";

export const ModalUserAccess = ({ isOpen, onClose }) => {
    const [isOpenModalMenu, setIsOpenModalMenu] = useState(false);
    const [canAccessDashboard, setCanAccessDashboard] = useState(false);
    const isAuthenticated = !!localStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
        const checkRoles = async () => {
            if (isAuthenticated) {
                const roles = await getRoles();
                const hasAccess = roles.some(role =>
                    role.roleName === 'ROLE_ADMIN' || role.roleName === 'ROLE_ASSISTANT'
                );
                setCanAccessDashboard(hasAccess);
            }
        };
        checkRoles();
    }, [isAuthenticated]);

    const handleModal = () => {
        onClose();
        setIsOpenModalMenu(true);
    };

    const handleLogout = async () => {
        try {
            await userService.logout();
            toast.success("Đăng xuất thành công!");
            localStorage.removeItem('user');
            onClose();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const handleEditUser = () => {
        navigate("/edit-user-information");
    };

    const handleGoToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} displayCoat={false} idControl="avatar_active_modal_sigup">
                {!isAuthenticated ? (
                    <Grid gd={{ maxWidth: "400px" }}>
                        <Button text="Đăng ký" gap={8} rounded="rounded-full" gd={{ minWidth: "240px" }} onClick={handleModal} />
                        <Button text="Đăng nhập" gap={8} rounded="rounded-full" gd={{ minWidth: "240px" }} onClick={handleModal} />
                    </Grid>
                ) : (
                    <Grid gd={{ maxWidth: "400px" }}>
                        <Button text="Cập nhật thông tin" gap={8} rounded="rounded-full" gd={{ minWidth: "240px" }} onClick={handleEditUser} />
                        {canAccessDashboard && (
                            <Button text="Dashboard" gap={8} rounded="rounded-full" gd={{ minWidth: "240px" }} onClick={handleGoToDashboard} />
                        )}
                        <Button text="Đăng xuất" gap={8} rounded="rounded-full" gd={{ minWidth: "240px" }} onClick={handleLogout} />
                    </Grid>
                )}
            </Modal>
            <ModalMenuSigUp isOpen={isOpenModalMenu} onClose={() => setIsOpenModalMenu(false)} />
        </>
    );
};
