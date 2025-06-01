import React, { useEffect, useState } from 'react';
import {getAllPaymentsUser, getVipPackage, paymentMethod, paymentMethodTest} from '../../core/services/PaymentService';
import { motion } from 'framer-motion';
import { Modal, Typography, Button, Flex, Group } from 'lvq';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import './Vip.scss';
import * as paymentService from '../../core/services/PaymentService';
import momoImg from '../../assets/images/bank/momo.png';
import vnpayImg from '../../assets/images/bank/vnpay.png';
import zalopayImg from '../../assets/images/bank/zalopay.png';

const Vip = () => {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPackages = async () => {
            const data = await getVipPackage();
            const normalized = data.map(pkg => ({
                ...pkg,
                id: pkg.packageId
            }));
            setPackages(normalized);
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await getAllPaymentsUser();
        }
        fetchData();
    }, []);


    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
    };

    const getAllPaymentsUser = async () => {
        console.log("abc")
        const user = JSON.parse(localStorage.getItem("user"));
        const temp = await paymentService.getAllPaymentsUser(user.userId);
        setPayments(temp);
    };

    const agreePayment = async () => {
        if (!selectedPackage?.id) {
            toast.error("Vui lòng chọn gói VIP trước khi thanh toán!");
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePayment = async (bankCode) => {
        console.log("Selected package before payment:", selectedPackage);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast.error("Vui lòng đăng nhập để thanh toán!");
            return;
        }

        if (!selectedPackage?.id) {
            toast.error("Vui lòng chọn gói VIP trước khi thanh toán!");
            return;
        }

        try {
            const response = await paymentMethodTest(
                selectedPackage.price,
                bankCode,
                user.userId,
                selectedPackage.id
            );

            if (response.code === 200 && response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error(response.message || "Có lỗi xảy ra khi xử lý thanh toán!");
            }
        } catch (error) {
            console.error("Payment error:", error);
            if (error.response?.status === 403) {
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            } else {
                toast.error("Có lỗi xảy ra khi xử lý thanh toán!");
            }
        }
    };


    return (
        <Group className="vip-container">
            <div className="vip-header">
                <h1>Nâng Cấp VIP</h1>
                <p>Trải nghiệm âm nhạc không giới hạn với gói VIP</p>
            </div>

            <div className="vip-packages">
                {packages.map((pkg) => (
                    <motion.div
                        key={pkg.id}
                        className={`vip-package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectPackage(pkg)}
                    >
                        <div className="package-header">
                            <h2>{pkg.name}</h2>
                            <div className="price">
                                <span className="amount">{pkg.price.toLocaleString('vi-VN')}đ</span>
                                <span className="period">/{pkg.duration} tháng</span>
                            </div>
                        </div>
                        <div className="package-features">
                            <ul>
                                {pkg.features?.map((feature, index) => (
                                    <li key={index}>
                                        <i className="fas fa-check"></i>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="select-button">
                            {selectedPackage?.id === pkg.id ? 'Đã Chọn' : 'Chọn Gói'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {selectedPackage && (
                <motion.div
                    className="selected-package-summary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3>Gói Đã Chọn: {selectedPackage.name}</h3>
                    <p>Giá: {selectedPackage.price.toLocaleString('vi-VN')}đ</p>
                    <button className="purchase-button" onClick={agreePayment}>
                        Thanh Toán Ngay
                    </button>
                </motion.div>
            )}

            <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
                <Group className="payment-modal">
                    <Flex justifyContent={'between'} alignItems={'center'} className="modal-header">
                        <Typography tag={"h2"}>Chọn phương thức thanh toán</Typography>
                        <Button
                            theme={'reset'}
                            className="close-button"
                            onClick={() => setShowPaymentModal(false)}
                            text={<IoClose />}
                        />
                    </Flex>

                    <Group className="payment-options">
                        <button
                            className="payment-option"
                            onClick={() => handlePayment('MOMO')}
                        >
                            <img src={momoImg} alt="Momo"/>
                            <span>Thanh toán qua Momo</span>
                        </button>

                        <button
                            className="payment-option"
                            onClick={() => handlePayment('NCB')}
                        >
                            <img src={vnpayImg} alt="VNPay"/>
                            <span>Thanh toán qua VNPay</span>
                        </button>

                        <button
                            className="payment-option"
                            onClick={() => handlePayment('NCB')}
                        >
                            <img src={zalopayImg} alt="ZaloPay"/>
                            <span>Thanh toán qua ZaloPay</span>
                        </button>
                    </Group>
                </Group>
            </Modal>
        </Group>
    );
};

export default Vip;
