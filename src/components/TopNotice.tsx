// components/TopNotice.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideTopNotice } from "@/redux/uiTopNoticeSlice";
import { RootState } from "@/redux/store";
import Text from "./headers/Text";

export default function TopNotice() {
  const dispatch = useDispatch();
  const { open, title, subtitle, imageUrl, href, variant, autoHideMs } =
    useSelector((s: RootState) => s.uiTopNotice);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => dispatch(hideTopNotice()), autoHideMs);
    return () => clearTimeout(t);
  }, [open, autoHideMs, dispatch]);

  // Цветовая схема под вариант
  const border =
    variant === "success"
      ? "border-green-500"
      : variant === "error"
      ? "border-red-500"
      : "border-gray-500";

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-end`}
    >
      <div
        className={`pointer-events-auto w-full sm:max-w-[324px] max-w-[217px] mx-4 mt-[80px] bg-black text-white backdrop-blur shadow-custom transition-all duration-300
        ${
          open ? "translate-x-0 opacity-100" : "-translate-x-[-110%] opacity-0"
        }`}
        role="dialog"
        aria-modal="false"
      >
        <div className="flex items-center gap-2 p-3">
          {imageUrl ? (
            <div className="shrink-0">
              <Image
                src={imageUrl}
                alt="Товар"
                width={48}
                height={48}
                className="rounded-md object-cover max-h-[48px]"
              />
            </div>
          ) : null}
          <div className="flex-1">
            <div className="flex flex-row items-center gap-1">
              <Image
                src={"/resources/Bag-white.svg"}
                width={16}
                height={16}
                alt="Cart"
              />
              <Text variant="PreTitle" className="font-medium">
                {title ?? "Добавлен в корзину"}
              </Text>
            </div>
            {subtitle ? (
              <div className="text-[14px] font-bold sm:max-w-[236px] max-w-[140px] truncate">{subtitle}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
