import { useEffect, useState } from "react";
import BaseDialog from "./BaseDialog";
import { CgClose } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { HeaderButton, MobileMenuButtonItem } from "./Header";
import { BiUser } from "react-icons/bi";
import { useUser } from "@/utils/hooks/useUser";
import EmailResetPasswordForm from "@/components/forms/EmailResetPasswordForm";
import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import Image from "next/image";

const DialogAuth: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isShowResetPassword, setIsShowResetPassword] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!isDisabled) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDisabled]);

  const startTimer = () => {
    setTimer(60);
    setIsDisabled(true);
  };

  return (
    <>
      <BaseDialog isOpen={open} onClose={() => setOpen(false)}>
        <div className="w-full flex-col flex items-center h-screen">
          <div className="w-full flex justify-end mb-4">
            <Image
              src={"/resources/cross.svg"}
              width={24}
              height={24}
              alt="Cross"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>
          {isShowResetPassword ? (
            <EmailResetPasswordForm
              startTimer={startTimer}
              timer={timer}
              isDisabled={isDisabled}
              isShowResetPassword={isShowResetPassword}
              setIsShowEmailResetPassword={setIsShowResetPassword}
            />
          ) : (
            <>
              {isShowLogin ? (
                <LoginForm
                  isShowLogin={isShowLogin}
                  setIsShowLogin={setIsShowLogin}
                  isShowResetPassword={isShowResetPassword}
                  setIsShowResetPassword={setIsShowResetPassword}
                  open={open}
                  setOpen={setOpen}
                />
              ) : (
                <RegisterForm
                  isShowLogin={isShowLogin}
                  setIsShowLogin={setIsShowLogin}
                  open={open}
                  setOpen={setOpen}
                />
              )}
            </>
          )}
        </div>
      </BaseDialog>
    </>
  );
};

export default DialogAuth;
