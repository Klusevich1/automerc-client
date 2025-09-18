import React from "react";
import clsx from "clsx";

export type TextVariant =
  | "Subtitle"
  | "Body"
  | "Bold"
  | "Small"
  | "PreTitle"
  | "ButtonText";

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<TextVariant, string> = {
  Subtitle: "text-[20px] lg:text-[20px] font-medium",
  Body: "text-[16px] lg:text-[16px] font-medium",
  Bold: "text-[16px] lg:text-[16px] font-bold",
  Small: "text-[14px] lg:text-[14px] font-medium",
  PreTitle: "text-[12px] lg:text-[12px] font-medium",
  ButtonText: "text-[16px] lg:text-[16px] font-semibold",
};

const Text: React.FC<TextProps> = ({
  children,
  variant = "Body",
  className = "",
  onClick,
}) => {
  return (
    <p
      className={clsx("font-manrope", variantStyles[variant], className)}
      onClick={onClick}
    >
      {children}
    </p>
  );
};

export default Text;
