import React, {useState} from "react";
import {Button, Grid, Modal, Typography, Input, Label, Flex, Form, ErrorMessage, RenderIf, Group} from "lvq";
import {CiUser} from "react-icons/ci";
import {ReactComponent as Google} from "../../../assets/icons/icons8-google.svg";
import {ReactComponent as Facebook} from "../../../assets/icons/icons8-facebook.svg";
import {useForm} from "react-hook-form";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";
import * as authenticationService from "../../../core/services/AuthenticationService";
import {useNavigate} from "react-router-dom";
import {doSignInWithFacebook, doSignInWithGoogle} from '../../../firebase'
import {IoIosWarning} from "react-icons/io";
import {usePopUp} from "../../../core/contexts/PopUpContext";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import AuthLanding from "./AuthLanding";


const ModalMenuSignUp = ({isOpen, onClose}) => {

    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const isAuthenticated = authenticationService.isAuthenticated();
    const showToast = usePopUp();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        watch,
    } = useForm({criteriaMode: "all"});
    const navigate = useNavigate();

    const [validateError, setValidateError] = useState([]);

    const showSignIn = () => {
        setIsSignIn(true);
        setIsSignUp(false);
        reset();
    };

    const showSignUp = () => {
        setIsSignUp(true);
        setIsSignIn(false);
        reset();
    };
    const handleBackClick = () => {
        setIsSignIn(false);
        setIsSignUp(false);
        reset();
        setValidateError([]);
    };

    const handleSignInSubmit = async (data) => {
        try {
            const userData = await authenticationService.login(data);
            const user = {
                token: userData.token,
                fullName: userData.fullName,
                avatar: userData.avatar,
                userId: userData.userId,
            };
            localStorage.setItem("user", JSON.stringify(user));
            const decodedToken = jwtDecode(userData.token);
            
            if (decodedToken && window.location.pathname !== "/login") {
                onClose();
                showToast("Đăng nhập thành công!", 'success' , '5000');
                window.location.reload();
            } else if (window.location.pathname === "/login") {
                showToast("Đăng nhập thành công!", 'success' , '5000');
                navigate("/");
            }
            reset();
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error('Login error:', error);
            setValidateError(error);
            toast.error("Đăng nhập thất bại");
        }
    };

    const handleSignUpSubmit = async (data) => {
        try {
            const userData = await authenticationService.register(data);
            if (userData.statusCode === 200) {
                const {newEmail, newPassword} = data;
                await handleSignInSubmit({email: newEmail, password: newPassword});
                showToast("Đăng kí thành công!", 'success' , '5000');
            }
            setValidateError([]);
        } catch (error) {
            setValidateError(error);
        }
    };

    const onGoogleSignIn = async (e) => {
        try {
            const userData = await doSignInWithGoogle();
            if (userData.data.statusCode === 200) {
                const user = {
                    token: userData.data.token,
                    fullName: userData.data.fullName,
                    avatar: userData.data.avatar,
                    userId: userData.data.userId
                };
                localStorage.setItem("user", JSON.stringify(user));
                const decodedToken = jwtDecode(userData.data.token);
                
                if (decodedToken && window.location.pathname !== "/login") {
                    onClose();
                    showToast("Đăng nhập thành công!", 'success' , '5000');
                } else if (window.location.pathname === "/login") {
                    showToast("Đăng nhập thành công!", 'success' , '5000');
                    navigate("/");
                }
                reset();

                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            const message = error.duplicateEmail
                ? `Email ${error.duplicateEmail} đã được sử dụng bởi tài khoản khác. Vui lòng thử lại với tài khoản khác.`
                : "Đăng nhập thất bại do lỗi từ hệ thống!";
            toast.error(message);
            setValidateError(error);
        }
    };

    const onFacebookSignIn = async (e) => {
        try {
            const user = await doSignInWithFacebook();
            if (user.data.statusCode === 200) {
                const userData = {
                    token: user.data.token,
                    fullName: user.data.fullName,
                    avatar: user.data.avatar,
                    userId: user.data.userId
                };
                localStorage.setItem("user", JSON.stringify(userData));
                const decodedToken = jwtDecode(user.data.token);
                
                if (decodedToken && window.location.pathname !== "/login") {
                    onClose();
                    showToast("Đăng nhập thành công!", 'success' , '5000');
                } else if (window.location.pathname === "/login") {
                    showToast("Đăng nhập thành công!", 'success' , '5000');
                    navigate("/");
                }
                reset();

                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            const message = error.duplicateEmail
                ? `Email ${error.duplicateEmail} đã được sử dụng bởi tài khoản khác. Vui lòng thử lại với tài khoản khác.`
                : "Đăng nhập facebook thất bại do lỗi từ hệ thống!";
            showToast("Đăng nhập thất bại!" + "Có lỗi: " + message, 'error' , '5000');
            setValidateError(error);
        }
    };

    return (

        <Modal isOpen={isOpen} onClose={onClose} gd={{padding: "0.5rem",}} className="shadow shadow-slate-400">
            <>
                {!isSignIn && !isSignUp && (
                    <AuthLanding
                        isSignIn={isSignIn}
                        onGoogleSignIn={onGoogleSignIn}
                        onFacebookSignIn={onFacebookSignIn}
                        showSignIn={showSignIn}
                        showSignUp={showSignUp}
                        validateError={validateError}
                    />
                )}

                {isSignIn && (
                    <SignInForm
                        register={register}
                        errors={errors}
                        validateError={validateError}
                        handleSubmit={handleSubmit}
                        handleSignInSubmit={handleSignInSubmit}
                        handleBackClick={handleBackClick}
                    />
                )}

                {isSignUp && (
                    <SignUpForm
                        register={register}
                        errors={errors}
                        validateError={validateError}
                        handleSubmit={handleSubmit}
                        handleSignUpSubmit={handleSignUpSubmit}
                        handleBackClick={handleBackClick}
                        watch={watch}
                    />
                )}
            </>
        </Modal>

    );
};

export default ModalMenuSignUp;
