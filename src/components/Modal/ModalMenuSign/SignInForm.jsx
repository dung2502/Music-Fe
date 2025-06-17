import { Button, ErrorMessage, Grid, Group, Form, Input, Label, Typography } from "lvq";
import PasswordInput from "./PasswordInput";
import { useNavigate } from "react-router-dom";

const SignInForm = ({
                        register,
                        errors,
                        validateError,
                        handleSubmit,
                        handleSignInSubmit,
                        handleBackClick
                    }) => {
    const navigate = useNavigate();
    
    return (
    <Group
        gd={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "0.5rem",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto"
        }}
    >
        <Button
            onClick={handleBackClick}
            size={4}
            text="Quay lại"
            gd={{ alignSelf: "flex-start", marginBottom: "0.5rem" }}
        />
        <Typography tag="h2" gd={{ fontSize: "1.8rem", fontWeight: "bold" }}>
            Đăng nhập
        </Typography>
        <Form onSubmit={handleSubmit(handleSignInSubmit)} className="p-2" gd={{ width: "100%" }}>
            <Label
                htmlFor="email"
                gd={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Typography tag="label" className="m-0">Email</Typography>
                <Input
                    size={4}
                    placeholder="Email"
                    {...register("email", {
                        required: "Email không được để trống!",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Email không hợp lệ!"
                        }
                    })}
                />
                <ErrorMessage
                    condition={errors?.email}
                    message={errors.email?.message}
                    gd={{ color: "red", fontSize: "0.85rem" }}
                />
                <ErrorMessage
                    condition={validateError?.email}
                    message={validateError.email}
                    gd={{ color: "red", fontSize: "0.85rem" }}
                />
            </Label>

            <PasswordInput
                label="Mật khẩu:"
                placeholder="Nhập mật khẩu"
                name="password"
                register={register}
                errors={errors}
                validateError={validateError}
                rules={{ required: "* Bắt buộc nhập trường này" }}
            />

            <Button
                onClick={() => navigate('/check-email')}
                text="Quên mật khẩu?"
                gd={{
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    alignSelf: "flex-end",
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "0"
                }}
            />

            <Button
                type="submit"
                size={4}
                text="Đăng nhập"
                gd={{
                    gridColumn: "span 2",
                    width: "100%",
                    marginTop: "1rem",
                    backgroundColor: "#4CAF50",
                    color: "white"
                }}
            />
        </Form>
    </Group>
    );
};

export default SignInForm;
