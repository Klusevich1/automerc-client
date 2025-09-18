import { startLoading } from "@/redux/loadingSlice";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";

interface Breadcrumb {
  name: string;
  link: string;
}

interface BreadcrumbsProps {
  className?: string;
  breadcrumbs: Breadcrumb[];
  theme?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs,
  className,
  theme = "",
}) => {
  const dispatch = useDispatch();
  return (
    <nav
      className={`text-black_80 flex flex-wrap ${className} mb-[16px] ${
        theme === "dark" ? "bg-black" : "transparent"
      }`}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <span
          key={index}
          className={`flex items-center ${
            index === 0 ||
            (breadcrumbs.length === 3 && (index == 0 || index == 1))
              ? "text-black_80"
              : `${theme === "dark" ? "text-white" : "text-black_80"}`
          }`}
        >
          <Link
            href={breadcrumb.link}
            className="text-[14px] font-manrope hover:text-blue_main transition duration-300"
            onClick={() => {
              dispatch(startLoading());
            }}
          >
            {breadcrumb.name}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <span className="mx-2 text-[14px]">/</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
