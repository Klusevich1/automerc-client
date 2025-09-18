import {FC, useEffect} from "react";
import H1 from "@/components/headers/H1";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {defaultFetch} from "@/utils/fetch's/defaultFetch";
import {useRouter} from "next/navigation";
import Text from "@/components/headers/Text";
import Button from "@/components/Button";
import {z} from "zod";

type LoginFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    isShowLogin: boolean;
    setIsShowLogin: (isShowLogin: boolean) => void;
    isShowResetPassword: boolean;
    setIsShowResetPassword: (isShowResetPassword: boolean) => void;
};

const loginSchema = z.object({
    email: z.email("Некорректный email").min(1, "Email обязателен"),
    password: z.string().min(1, "Пароль обязателен"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: FC<LoginFormProps> = ({isShowResetPassword, setIsShowResetPassword, open, setOpen, setIsShowLogin, isShowLogin}) => {
    const router = useRouter();
    const {
        register: loginRegister,
        handleSubmit: loginHandleSubmit,
        reset: loginReset,
        setError,
        formState: {errors: loginErrors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (!open) {
            loginReset();
        }
    }, [open, isShowLogin, loginReset]);

    const submitLogin = async (data: LoginFormData) => {
        try {
            const res = await defaultFetch("/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(data),
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok) {
                setError("password", {
                    type: "manual",
                    message: result.message || "Ошибка входа",
                });
                return;
            }

            loginReset();
            setOpen(false);
            router.push('/profile', {scroll: false})
        } catch (error: any) {
            setError("password", {
                type: "manual",
                message: error.message || "Ошибка сервера",
            });
        }
    };
    return (
        <>
            <div className="max-w-full xs:max-w-[344px] lg:max-w-[380px] w-full">
                <H1 className="lg:!text-[32px] !text-[24px] !font-bold mb-4">Войти или зарегистрироваться</H1>
                <Text variant="Body" className="mt-4">
                    Отправим код. Введите последние 4 цифры номера телефона или код из сообщения.
                </Text>

                <form onSubmit={loginHandleSubmit(submitLogin)} className="flex flex-col w-full">
                    <input
                        {...loginRegister("email")}
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        type="email"
                    />
                    {loginErrors.email && (
                        <span className="text-red text-sm mt-2">{loginErrors.email.message}</span>
                    )}

                    <input
                        {...loginRegister("password")}
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        type="password"
                    />
                    {loginErrors.password && (
                        <span
                            className="text-red text-sm mt-2">{loginErrors.password.message}</span>
                    )}

                    <div className="flex justify-end">
                        <Text variant="Small" className="w-fit mb-12 mt-1 hover:underline cursor-pointer"
                              onClick={() => setIsShowResetPassword(!isShowResetPassword)}>
                            Забыли пароль?
                        </Text>
                    </div>

                    <Button
                        type="submit"
                        styles="w-full py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                        text="Войти"
                    />
                    <Button
                        styles="w-full py-[16px] text-center rounded-[8px] text-[16px] font-semibold outline-none"
                        text="Зарегистрироваться"
                        onClick={() => setIsShowLogin(!isShowLogin)}
                    />
                </form>
            </div>
        </>
    );
};

export default LoginForm;