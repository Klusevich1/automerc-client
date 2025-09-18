import {FC} from "react";
import H1 from "@/components/headers/H1";
import Text from "@/components/headers/Text";
import {GoArrowLeft} from "react-icons/go";
import Button from "@/components/Button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {defaultFetch} from "@/utils/fetch\'s/defaultFetch";

type ResetPasswordFormProps = {
    email: string;
    code: string;
    setIsShowCodeResetPassword: (isShowCodeResetPassword: boolean) => void;
    setDefaultIsShowResetPassword: (isShowResetPassword: boolean) => void;
    isShowResetPassword: boolean;
    setIsShowResetPassword: (isShowResetPassword: boolean) => void;
};

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(6, "Пароль должен быть минимум 6 символов")
            .max(32, "Пароль не должен быть больше 32 символов"),
        repeatPassword: z.string(),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Пароли не совпадают",
        path: ["repeatPassword"],
    });

type PasswordForm = z.infer<typeof passwordSchema>;

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({email, code, isShowResetPassword, setIsShowResetPassword, setIsShowCodeResetPassword, setDefaultIsShowResetPassword}) => {
    const {
        register: passwordRegister,
        handleSubmit: passwordHandleSubmit,
        formState: {errors: passwordErrors},
        setError,
    } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    const submitPassword = async (data: PasswordForm) => {
        try {
            const res = await defaultFetch("/auth/password/reset", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, code, newPassword: data.password}),
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok) {
                setError("repeatPassword", {
                    type: "manual",
                    message: result.message || "Ошибка при смене пароля",
                });
                return;
            }

            setIsShowResetPassword(false);
            setIsShowCodeResetPassword(false);
            setDefaultIsShowResetPassword(false);
        } catch (error: any) {
            setError("repeatPassword", {
                type: "manual",
                message: error.message || "Ошибка при смене пароля",
            });
        }
    };

    return (
        <>
            <div className="max-w-[344px] lg:max-w-[380px] w-full">
                <button className="mb-5" onClick={() => setIsShowResetPassword(!isShowResetPassword)}>
                    <GoArrowLeft className="w-6 h-6"/>
                </button>
                <H1 className="text-xl font-semibold mb-4">Введите новый пароль</H1>
                <Text variant="Body" className="mt-4">
                    Введите новый пароль и повторите его
                </Text>

                <form onSubmit={passwordHandleSubmit(submitPassword)} className="flex flex-col w-full">
                    <input
                        {...passwordRegister("password")}
                        type="password"
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        placeholder="Введите новый пароль"
                    />
                    {passwordErrors.password && (
                        <span className="text-red text-sm mt-2">{passwordErrors.password.message}</span>
                    )}

                    <input
                        {...passwordRegister("repeatPassword")}
                        type="password"
                        className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                        placeholder="Повторите пароль"
                    />
                    {passwordErrors.repeatPassword && (
                        <span className="text-red text-sm mt-2">{passwordErrors.repeatPassword.message}</span>
                    )}

                    <Button
                        type="submit"
                        styles="w-full mt-12 py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                        text="Сменить пароль"
                    />
                </form>
            </div>
        </>
    );
};

export default ResetPasswordForm;