import React from "react";
import clsx from "clsx";
import HeaderProps from "@/components/headers/HeaderProps";

const H2: React.FC<HeaderProps> = ({
  children,
  className = "",
  fontFamily = "font-manrope",
  fontWeightDesktop = "lg:font-bold",
  fontWeightMobile = "font-medium",
  textSizeDesktop = "lg:text-[24px]",
  textSizeMobile = "text-[16px]",
  tracking = "-tracking-[0.02em]",
}) => {
  return (
    <h2
      className={clsx(
        fontFamily,
        tracking,
        `${textSizeMobile} ${fontWeightMobile}`,
        `${textSizeDesktop} ${fontWeightDesktop}`,
        className
      )}
    >
      {children}
    </h2>
  );
};

export default H2;
