import React, { useEffect, useState } from 'react';
import {getYourProfile} from "../../core/services/AuthenticationService";

const YourComponent = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const userData = await getYourProfile();
            if (userData) {
                setUser(userData);
            }
        };

        fetchProfile();
    }, []);
    console.log(user.fullName);
    return (
        <div>
            {user ? (
                <div>
                    <p>Xin chào, {user.fullName}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>Đang tải thông tin người dùng...</p>
            )}
        </div>
    );
};

export default YourComponent;
