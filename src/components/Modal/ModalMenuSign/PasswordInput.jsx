import React, { useState } from "react";
import { Input, Group, ErrorMessage } from "lvq";

const PasswordInput = ({
                         label,
                         placeholder,
                         name,
                         register,
                         errors,
                         validateError,
                         rules
                       }) => {
  const [show, setShow] = useState(false);

  return (
      <label htmlFor={name}>
        {label}
        <Group style={{ position: "relative" }}>
          <Input
              {...register(name, rules)}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              name={name}
          />
          <span
              onClick={() => setShow(!show)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
          >
        </span>
        </Group>
        <ErrorMessage condition={errors?.[name]} message={errors?.[name]?.message} />
        <ErrorMessage condition={validateError?.[name]} message={validateError?.[name]} />
      </label>
  );
};

export default PasswordInput;
