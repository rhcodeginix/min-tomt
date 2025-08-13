import React from "react";
import { Field } from "formik";

interface InputProps {
  label: string;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  errors?: any;
  touched?: any;
  onChange: (value: string) => void;
  value?: any;
  disabled?: boolean;
}

const InputField: React.FC<InputProps> = ({
  label,
  type,
  name,
  id,
  placeholder,
  errors,
  touched,
  onChange,
  value,
  disabled,
}) => {
  return (
    <div>
      <label htmlFor={id} className={`text-darkBlack text-sm font-semibold`}>
        {label}
      </label>
      <Field
        onChange={onChange}
        name={name}
        type={type}
        id={id}
        value={value}
        className={`border mt-2 w-full font-base placeholder:font-base focus:outline-none rounded-[8px] py-[13px] px-[16px] h-[48px] relative flex items-center justify-between ${
          errors && touched && errors[name] && touched[name]
            ? "border-red"
            : "border-[#B9C0D4]"
        } ${disabled && "cursor-not-allowed bg-[#EFF1F5] text-grayText"}`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {errors && touched && errors[name] && touched[name] && (
        <div className="text-xs mt-1" style={{ color: "red" }}>
          {errors[name]}
        </div>
      )}
    </div>
  );
};

export default InputField;
