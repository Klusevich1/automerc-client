import React from "react";
import Text from "./headers/Text";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { startLoading } from "@/redux/loadingSlice";

interface ButtonProps {
    styles: string;
    text: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    type?: "button" | "reset" | "submit" | undefined;
}

const Button: React.FC<ButtonProps> = ({styles, text, onClick, href, type = 'button', disabled = false}) => {
    const dispatch = useDispatch()
    return (
        <>
            {href ? (
                <Link href={href} className="w-full">
                    <button className={styles} onClick={onClick} type={type} disabled={disabled}>
                        <Text variant="ButtonText" children={text}/>
                    </button>
                </Link>
            ) : (
                <button className={styles} onClick={onClick} disabled={disabled}>
                    <Text variant="ButtonText" children={text}/>
                </button>
            )}
        </>
    );
};

export default Button;