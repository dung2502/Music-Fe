import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';
import './PaymentResult.css';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');

    const getStatusConfig = (status) => {
        switch (status) {
            case 'success':
                return {
                    icon: <FaCheckCircle className="status-icon success" />,
                    title: 'Thanh toán thành công!',
                    message: 'Cảm ơn bạn đã nâng cấp tài khoản. Bạn có thể bắt đầu sử dụng các tính năng VIP ngay bây giờ.',
                    buttonText: 'Trở về trang chủ',
                    buttonAction: () => navigate('/')
                };
            case 'fail':
                return {
                    icon: <FaTimesCircle className="status-icon fail" />,
                    title: 'Thanh toán thất bại',
                    message: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau.',
                    buttonText: 'Thử lại',
                    buttonAction: () => navigate('/vip')
                };
            case 'not_found':
                return {
                    icon: <FaExclamationCircle className="status-icon warning" />,
                    title: 'Không tìm thấy giao dịch',
                    message: 'Không thể xác định trạng thái giao dịch. Vui lòng liên hệ hỗ trợ nếu bạn đã thanh toán.',
                    buttonText: 'Liên hệ hỗ trợ',
                    buttonAction: () => navigate('/')
                };
            default:
                return {
                    icon: <FaExclamationCircle className="status-icon warning" />,
                    title: 'Lỗi không xác định',
                    message: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
                    buttonText: 'Trở về trang chủ',
                    buttonAction: () => navigate('/')
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className="payment-result-container">
            <div className="payment-result-card">
                {config.icon}
                <h2 className="status-title">{config.title}</h2>
                <p className="status-message">{config.message}</p>
                <button 
                    className="action-button"
                    onClick={config.buttonAction}
                >
                    {config.buttonText}
                </button>
            </div>
        </div>
    );
};

export default PaymentResult;