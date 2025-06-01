import React from "react";
import {Typography, Grid, Button, Flex} from "lvq";
import {CiUser} from "react-icons/ci";
import {ReactComponent as Google} from "../../../assets/icons/icons8-google.svg";
import {ReactComponent as Facebook} from "../../../assets/icons/icons8-facebook.svg";
import {IoIosWarning} from "react-icons/io";

const AuthLanding = ({isSignIn, onGoogleSignIn, onFacebookSignIn, showSignIn, showSignUp, validateError}) => {
    return (
        <>
            <Typography tag="h2" center className="text-[1.75rem]">
                Đăng nhập vào Music Streaming
            </Typography>
            <Grid gap={4} gd={{marginTop: "2rem"}} center>
                <Button
                    theme="sign_up"
                    size={4}
                    text="Sử dụng email / số điện thoại"
                    icon={<CiUser size={21}/>}
                    gap={8}
                    rounded="rounded-full"
                    onClick={showSignIn}
                    className="w-3/4"
                />
                <Button
                    disabled={isSignIn}
                    theme="sign_up"
                    size={4}
                    text={isSignIn ? 'Đang đăng nhập ...' : 'Đăng nhập với Google'}
                    icon={<Google/>}
                    gap={8}
                    rounded="rounded-full"
                    className="w-3/4"
                    onClick={onGoogleSignIn}
                />
                <Button
                    disabled={isSignIn}
                    theme="sign_up"
                    size={4}
                    text={isSignIn ? 'Đang đăng nhập ...' : 'Đăng nhập với Facebook'}
                    icon={<Facebook/>}
                    gap={8}
                    rounded="rounded-full"
                    className="w-3/4"
                    onClick={onFacebookSignIn}
                />
                {validateError.duplicateEmail && (
                    <Flex align="center" gd={{marginTop: "1rem", width: "70%"}}>
                        <IoIosWarning size={27} color="red" style={{marginTop: 5}}/>
                        <Typography gd={{color: 'red'}} center={true}>
                            Email "{validateError.duplicateEmail}" đã được sử dụng bởi phương thức đăng nhập khác.
                        </Typography>
                    </Flex>
                )}
                <Flex>
                    <Typography>Bạn chưa có tài khoản</Typography>
                    <Button
                        theme="reset"
                        text="Đăng ký"
                        gd={{textDecoration: "underline"}}
                        onClick={showSignUp}
                    />
                </Flex>
                <Typography gd={{textAlign: 'center'}}>
                    Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đã đồng ý với điều khoản sử dụng của chúng tôi
                </Typography>
            </Grid>
        </>
    );
};

export default AuthLanding;
