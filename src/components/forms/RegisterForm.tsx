import {FC, useEffect} from "react";
import H1 from "@/components/headers/H1";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {defaultFetch} from "@/utils/fetch's/defaultFetch";
import {useRouter} from "next/navigation";
import Button from "@/components/Button";
import {z} from "zod";

type RegisterFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    isShowLogin: boolean;
    setIsShowLogin: (isShowLogin: boolean) => void;
};

const registerSchema = z.object({
    firstName: z.string().min(1, "Имя обязательно").regex(/^[А-Яа-яA-Za-z]+$/, "Имя должно содержать только буквы"),
    lastName: z.string().min(1, "Фамилия обязательна").regex(/^[А-Яа-яA-Za-z]+$/, "Фамилия должна содержать только буквы"),
    email: z.email("Некорректный email").min(1, "Email обязателен"),
    password: z.string().min(1, "Пароль обязателен"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: FC<RegisterFormProps> = ({open, setOpen, setIsShowLogin, isShowLogin}) => {
    const router = useRouter();

    const {
        register: registerRegister,
        handleSubmit: registerHandleSubmit,
        reset: registerReset,
        setError,
        formState: {errors: registerErrors},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if (!open) {
            registerReset();
        }
    }, [open, isShowLogin, registerReset]);

    const submitRegister = async (data: RegisterFormData) => {
        try {
            const res = await defaultFetch("/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setError("password", {
                    type: "manual",
                    message: result.message || "Ошибка регистрации",
                });
                return;
            }

            registerReset();
            setOpen(false);
            router.push('/profile', {scroll: false})
        } catch (error: any) {
            setError("password", {
                type: "manual",
                message: error.message || "Ошибка регистрации",
            });
        }
    };

    return (
            <div className="max-w-[344px] lg:max-w-[380px]  w-full">
                <H1 className="text-xl font-semibold mb-4">Регистрация</H1>

                <form onSubmit={registerHandleSubmit(submitRegister)}
                      className="flex flex-col w-full">
                    <input
                        {...registerRegister("firstName")}
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        type="text"
                        placeholder="Имя"
                    />
                    {registerErrors.firstName && (
                        <span
                            className="text-red text-sm mt-1">{registerErrors.firstName.message}</span>
                    )}

                    <input
                        {...registerRegister("lastName")}
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        type="text"
                        placeholder="Фамилия"
                    />
                    {registerErrors.lastName && (
                        <span
                            className="text-red text-sm mt-1">{registerErrors.lastName.message}</span>
                    )}

                    <input
                        {...registerRegister("email")}
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        type="email"
                        placeholder="Email"
                    />
                    {registerErrors.email && (
                        <span
                            className="text-red text-sm mt-1">{registerErrors.email.message}</span>
                    )}

                    <input
                        {...registerRegister("password")}
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        type="password"
                        placeholder="Пароль"
                    />
                    {registerErrors.password && (
                        <span
                            className="text-red text-sm mt-1">{registerErrors.password.message}</span>
                    )}

                    <Button
                        type="submit"
                        styles="w-full py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none mt-12"
                        text="Зарегистрироваться"
                    />
                    <Button
                        styles="w-full py-[16px] text-center rounded-[8px] text-[16px] font-semibold outline-none"
                        text="Войти"
                        onClick={() => setIsShowLogin(!isShowLogin)}
                    />
                </form>
            </div>
    );
};

export default RegisterForm;