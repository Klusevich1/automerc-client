import React from "react";
import Text from "./headers/Text";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: React.HTMLInputTypeAttribute | "phone";
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, type = "text", error, ...rest }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "phone") {
        const rawValue = e.target.value;
        const filteredValue = rawValue.replace(/[^\d+]/g, "").replace(/^([^+]*\+)|\+/g, "$1");

        onChange?.({
          ...e,
          target: {
            ...e.target,
            value: filteredValue,
          },
        });
      } else {
        onChange?.(e);
      }
    };

    return (
      <div className="w-full flex flex-col gap-1">
        <input
          {...rest}
          ref={ref}
          value={value}
          onChange={handleChange}
          type={type === "phone" ? "tel" : type}
          className="w-full border-b border-stroke pb-[12px] focus:outline-none text-[16px] lg:text-[16px] font-medium"
        />
        {error && (
          <Text variant="PreTitle" className="text-red font-medium">
            {error}
          </Text>
        )}
      </div>
    );
  }
);

export default Input;
