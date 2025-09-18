import React from "react";
import clsx from "clsx";
import HeaderProps from "@/components/headers/HeaderProps";

const H3: React.FC<HeaderProps> = ({
  children,
  className = "",
  fontFamily = "font-manrope",
  fontWeightDesktop = "lg:font-bold",
  fontWeightMobile = "font-medium",
  textSizeDesktop = "lg:text-[20px]",
  textSizeMobile = "text-[16px]",
  tracking = "-tracking-[0.02em]",
}) => {
  return (
    <h3
      className={clsx(
        fontFamily,
        tracking,
        `${textSizeMobile} ${fontWeightMobile}`,
        `${textSizeDesktop} ${fontWeightDesktop}`,
        className
      )}
    >
      {children}
    </h3>
  );
};

export default H3;
