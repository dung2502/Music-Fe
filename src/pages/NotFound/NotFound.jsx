import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Oops! Trang không tồn tại</h2>
                <p className="error-message">
                    Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link to="/" className="home-button">
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}

export default NotFound;