import {Button, ErrorMessage, Group, Input, Label, Typography} from "lvq";
import PasswordInput from "./PasswordInput";

const SignUpForm = ({ register, errors, validateError, handleSubmit, handleSignUpSubmit, handleBackClick, watch }) => (
    <Group>
        <Button onClick={handleBackClick} size={4} text="Quay lại" />
        <Typography tag="h2">Đăng ký</Typography>

        <form onSubmit={handleSubmit(handleSignUpSubmit)}>

            <Label htmlFor="newEmail">Email:
                <Input
                    {...register("newEmail", {
                        required: "* Bắt buộc nhập trường này",
                        pattern: {
                            value: /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/,
                            message: "Email không hợp lệ!"
                        }
                    })}
                    name="newEmail"
                    type="email"
                    placeholder="Nhập email"
                />
                <ErrorMessage condition={errors?.newEmail} message={errors.newEmail?.message} />
                <ErrorMessage condition={validateError?.newEmail} message={validateError?.newEmail} />
            </Label>

            <PasswordInput
                label="Mật khẩu:"
                placeholder="Nhập mật khẩu"
                name="newPassword"
                register={register}
                errors={errors}
                validateError={validateError}
                rules={{
                    required: "* Bắt buộc nhập trường này",
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/_])[A-Z][A-Za-z\d@$!%*/?&]{7,49}$/,
                        message: "Mật khẩu phải bắt đầu bằng chữ hoa, có ít nhất 1 chữ thường, 1 số, 1 ký tự đặc biệt và dài từ 8 đến 50 ký tự!",
                    }
                }}
            />

            <PasswordInput
                label="Xác nhận mật khẩu:"
                placeholder="Nhập lại mật khẩu"
                name="confirmPassword"
                register={register}
                errors={errors}
                validateError={validateError}
                rules={{
                    required: "* Bắt buộc nhập trường này",
                    validate: (value) =>
                        value === watch("newPassword") || "Mật khẩu xác nhận không khớp!"
                }}
            />

            <Button size={4} text="Đăng ký" type="submit" />

        </form>
    </Group>
);
export default SignUpForm;
