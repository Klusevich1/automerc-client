import React from "react";
import clsx from "clsx";
import HeaderProps from "@/components/headers/HeaderProps";

const H1: React.FC<HeaderProps> = ({
  children,
  className = "",
  fontFamily = "font-manrope",
  fontWeightDesktop = "lg:font-bold",
  fontWeightMobile = "font-medium",
  textSizeDesktop = "lg:text-[32px]",
  textSizeMobile = "text-[16px]",
  tracking = "-tracking-[0.02em]",
}) => {
  return (
    <h1
      className={clsx(
        fontFamily,
        tracking,
        `${textSizeMobile} ${fontWeightMobile}`,
        `${textSizeDesktop} ${fontWeightDesktop}`,
        className
      )}
    >
      {children}
    </h1>
  );
};

export default H1;
