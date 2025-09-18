import {FC, useState} from "react";
import H1 from "@/components/headers/H1";
import Text from "@/components/headers/Text";
import {GoArrowLeft} from "react-icons/go";
import Button from "@/components/Button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {defaultFetch} from "@/utils/fetch\'s/defaultFetch";
import CodeResetPasswordForm from "@/components/forms/CodeResetPasswordForm";

type EmailResetPasswordFormProps = {
    startTimer: () => void;
    timer: number;
    isDisabled: boolean;
    isShowResetPassword: boolean;
    setIsShowEmailResetPassword: (isShowResetPassword: boolean) => void;
};

const emailSchema = z.object({
    email: z.string().email({message: "Введите корректный email"}),
});

type EmailForm = z.infer<typeof emailSchema>;

const EmailResetPasswordForm: FC<EmailResetPasswordFormProps> = ({isShowResetPassword, setIsShowEmailResetPassword, startTimer, timer, isDisabled}) => {
    const [isShowCodeResetPasswordForm, setIsShowCodeResetPasswordForm] = useState(false);
    const [email, setEmail] = useState('');

    const {
        register: emailRegister,
        handleSubmit: emailHandleSubmit,
        formState: {errors: emailErrors},
        setError,
    } = useForm<EmailForm>({
        resolver: zodResolver(emailSchema),
    });

    const submitEmail = async (data: EmailForm) => {
        if(!isDisabled) {
            try {
                const res = await defaultFetch("/auth/password/forgot", {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify(data),
                    credentials: "include",
                });

                const result = await res.json();

                if (!res.ok) {
                    setError("email", {
                        type: "manual",
                        message: result.message || "Ошибка при проверке почты",
                    });
                    return;
                }

                setEmail(data.email);
                setIsShowCodeResetPasswordForm(!isShowCodeResetPasswordForm);
                startTimer();
            } catch (error: any) {
                setError("email", {
                    type: "manual",
                    message: error.message || "Ошибка при проверке почты",
                });
            }
        }
    };

    return (
        <>
            {
                isShowCodeResetPasswordForm ?
                    <CodeResetPasswordForm
                        email={email}
                        setDefaultIsShowResetPassword={setIsShowEmailResetPassword}
                        isShowCodeResetPassword={isShowCodeResetPasswordForm}
                        setIsShowCodeResetPassword={setIsShowCodeResetPasswordForm}
                    />
                    :
                    <div className="max-w-[344px] lg:max-w-[380px] w-full">
                        <button className="mb-5" onClick={() => setIsShowEmailResetPassword(!isShowResetPassword)}>
                            <GoArrowLeft className="w-6 h-6"/>
                        </button>
                        <H1 className="text-xl font-semibold mb-4">Восстановление пароля</H1>
                        <Text variant="Body" className="mt-4">
                            На указанную вами почту будет отправлен код для восстановления пароля
                        </Text>

                        <form onSubmit={emailHandleSubmit(submitEmail)} className="flex flex-col w-full">
                            <input
                                {...emailRegister("email")}
                                className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                                type="email"
                                placeholder="Введите почту"
                            />
                            {emailErrors.email && (
                                <span className="text-red text-sm mt-2">{emailErrors.email.message}</span>
                            )}
                            {isDisabled ?
                                <span className="mt-4 block">Запросить следующий код можно через {timer} сек</span>
                                : <></>
                            }

                            <Button
                                disabled={isDisabled}
                                type="submit"
                                styles={(isDisabled ? "opacity-70" : " opacity-100") + " w-full mt-12 py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"}
                                text="Получить код"
                            />
                        </form>
                    </div>
            }
        </>
    );
};

export default EmailResetPasswordForm;