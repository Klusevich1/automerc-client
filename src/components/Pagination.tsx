import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { startLoading } from "@/redux/loadingSlice";
import { useDispatch } from "react-redux";

const Pagination: React.FC<{ totalPages: number; currentPage: number }> = ({
  totalPages,
  currentPage,
}) => {
  //   const [currentPage, setCurrentPage] = useState(5);
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const goToPage = (page: number) => {
    dispatch(startLoading());
    if (page >= 1 && page <= totalPages) {
      const query = { ...router.query, page: page.toString() };
      router.push({ pathname: router.pathname, query }, undefined, {
        scroll: false,
      });
    }
  };

  const renderPages = () => {
    const pages: (number | string)[] = [];

    if (isMobile) {
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    } else {
      if (totalPages <= 9) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 6) {
        for (let i = 1; i <= 7; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages.map((item) =>
      typeof item === "number" ? (
        <button
          key={item}
          onClick={() => goToPage(item)}
          className={`w-[38px] h-[38px] rounded-[8px] flex items-center justify-center text-sm ${
            currentPage === item
              ? "bg-stroke bg-opacity-30"
              : "hover:underline"
          }`}
        >
          <p className="text-[16px] font-medium">{item}</p>
        </button>
      ) : (
        <p
          key={`dots-${Math.random()}`} // уникальный ключ для "..."
          className="text-[16px] font-medium w-[38px] select-none text-center"
        >
          ...
        </p>
      )
    );
  };

  return (
    <>
      {/* {isLoading && <LoadingSpinner />} */}
      <div className="flex items-center gap-2 w-fit py-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:opacity-30 mr-[8px]"
        >
          <Image
            src={"/resources/arrow-left.svg"}
            width={24}
            height={24}
            alt="Arrow"
          />
        </button>

        {renderPages()}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="disabled:opacity-30 ml-[8px]"
        >
          <Image
            src={"/resources/arrow-left.svg"}
            width={24}
            height={24}
            alt="Arrow"
            className="rotate-180"
          />
        </button>
      </div>
    </>
  );
};

export default Pagination;
