import {Link, useLocation, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import spinner from "../../../assets/icons/Spinner.gif";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import * as authenticationService from "../../../core/services/AuthenticationService";
import {toast} from "react-toastify";
import "./CheckEmail.css";

export function ForgotPassword() {
    const [validateError, setValidateError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openEyeOne, setOpenEyeOne] = useState(false);
    const [openEyeTwo, setOpenEyeTwo] = useState(false);
    const navigate = useNavigate();
    const {state} = useLocation();
    const {register, handleSubmit, formState: {errors}, setValue, getValues} = useForm({
        criteriaMode: "all"
    });

    useEffect(()=> {
        setValue("email", state.email);
    }, [state.email]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const temp = await authenticationService.forgotPassword(data);
            if (temp.statusCode === 200) {
                setTimeout(()=> {
                    setIsLoading(false);
                    toast.success(temp.message);
                    navigate("/login");
                }, 2000)
            }
        } catch (e) {
            if (e.statusCode === 400) {
                setValidateError(e.errors.errors);
            }
            else toast.error(e.message)
        } finally {
            setTimeout(()=> {
                setIsLoading(false);
            }, 2000)
        }
    }

    const handleShowPassword = (data) => {
        if (data === 1) {
            setOpenEyeOne(!openEyeOne);
        }
        if (data === 2) {
            setOpenEyeTwo(!openEyeTwo);
        }
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-header">
                <Link to='/check-email' className="back-link">
                    <i className="fas fa-arrow-left"></i> Quay lại trang trước
                </Link>
            </div>
            <div className="forgot-password-content">
                <div className="forgot-password-card">
                    <div className="forgot-password-title">
                        <h2>Đặt lại mật khẩu</h2>
                        <p className="subtitle">Vui lòng nhập mật khẩu mới của bạn</p>
                    </div>
                    <form className="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-input"
                                disabled 
                                {...register("email")} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Mật khẩu mới <span className="required">*</span>
                            </label>
                            <div className="password-input-container">
                                <input 
                                    type={openEyeOne ? "text" : "password"}
                                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                                    placeholder="Nhập mật khẩu mới"
                                    {...register("newPassword", {
                                        required: "Mật khẩu không được để trống!",
                                        minLength: {value: 8, message: "Mật khẩu phải từ 8 đến 50 chữ!"},
                                        maxLength: {value: 50, message: "Mật khẩu phải từ 8 đến 50 chữ!"},
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%/*?&_])[A-Z][A-Za-z\d@$!%*?/&]{7,49}$/,
                                            message: "Mật khẩu phải bắt đầu bằng một chữ hoa, chứa ít nhất một chữ thường, một chữ số, ký tự đặc biệt (@$!%*?&/_), và phải dài từ 8 đến 50 ký tự!"
                                        }
                                    })}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={() => handleShowPassword(1)}
                                >
                                    {openEyeOne ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="error-message">{errors.newPassword.message}</p>}
                            {validateError && <p className="error-message">{validateError.newPassword}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Xác nhận mật khẩu <span className="required">*</span>
                            </label>
                            <div className="password-input-container">
                                <input 
                                    type={openEyeTwo ? "text" : "password"}
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Nhập lại mật khẩu mới"
                                    {...register("confirmPassword", {
                                        validate: value => value === getValues('newPassword') || "Mật khẩu không trùng khớp!"
                                    })}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={() => handleShowPassword(2)}
                                >
                                    {openEyeTwo ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
                            {validateError && <p className="error-message">{validateError.confirmPassword}</p>}
                        </div>

                        <button 
                            className={`submit-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading} 
                            type="submit"
                        >
                            {isLoading ? (
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
