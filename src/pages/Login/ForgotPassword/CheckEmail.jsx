import {useState} from "react";
import {useForm} from "react-hook-form";
import * as authenticationService from "../../../core/services/AuthenticationService";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import spinner from "../../../assets/icons/Spinner.gif";
import "./CheckEmail.css";

export function CheckEmail() {
    const [validateError, setValidateError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}, setValue, getValues} = useForm({
        criteriaMode: "all"
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const temp = await authenticationService.checkEmail(data);
            if (temp) {
                setTimeout(()=> {
                    setIsLoading(false);
                    navigate("/forgot-password", {state: {email: data.email}});
                }, 2000)
            }
        } catch (e) {
            if (e.status === 404) {
                toast.error(e.data);
            }
            else setValidateError(e.data.errors.errors);
        } finally {
            setTimeout(()=> {
                setIsLoading(false);
            }, 2000)
        }
    }
    return (
        <div className="forgot-password-container">
            <div className="forgot-password-header">
                <Link to='/' className="back-link">
                    <i className="fas fa-arrow-left"></i> Quay lại trang chủ
                </Link>
            </div>
            <div className="forgot-password-content">
                <div className="forgot-password-card">
                    <div className="forgot-password-title">
                        <h2>Quên mật khẩu</h2>
                        <p className="subtitle">Vui lòng nhập email và số điện thoại của bạn để tiếp tục</p>
                    </div>
                    <form className="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label className="form-label">
                                Email <span className="required">*</span>
                            </label>
                            <input 
                                type="email" 
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="Nhập email của bạn"
                                {...register("email", {
                                    required: "Email không được để trống!"
                                })} 
                            />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                            {validateError && <p className="error-message">{validateError.email}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Số điện thoại <span className="required">*</span>
                            </label>
                            <input 
                                type='text'
                                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                                placeholder="Nhập số điện thoại của bạn"
                                {...register("phoneNumber", {
                                    required: "Số điện thoại không được để trống!",
                                    pattern: {
                                        value: /^(?:\+84|0)\d{9}/, 
                                        message: "Số điện thoại phải bắt đầu bằng +84 hoặc 0 và kết thúc với 9 số!"
                                    }
                                })}
                            />
                            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber.message}</p>}
                            {validateError && <p className="error-message">{validateError.oldPassword}</p>}
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
                                "Gửi yêu cầu"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}