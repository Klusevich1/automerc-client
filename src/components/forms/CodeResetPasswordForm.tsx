import {FC, useState} from "react";
import H1 from "@/components/headers/H1";
import Text from "@/components/headers/Text";
import {GoArrowLeft} from "react-icons/go";
import Button from "@/components/Button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {defaultFetch} from "@/utils/fetch\'s/defaultFetch";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

type CodeResetPasswordFormProps = {
    email: string;
    setDefaultIsShowResetPassword: (isShowResetPassword: boolean) => void;
    isShowCodeResetPassword: boolean;
    setIsShowCodeResetPassword: (isShowCodeResetPassword: boolean) => void;
};

const codeSchema = z.object({
    code: z.string().min(1, "Введите код подтверждения")
});

type CodeForm = z.infer<typeof codeSchema>;

const CodeResetPasswordForm: FC<CodeResetPasswordFormProps> = ({
                                                                   email,
                                                                   isShowCodeResetPassword,
                                                                   setIsShowCodeResetPassword,
                                                                   setDefaultIsShowResetPassword
                                                               }) => {
    const [code, setCode] = useState('');
    const [isShowResetPassword, setIsShowResetPassword] = useState(false);
    const {
        register: codeRegister,
        handleSubmit: codeHandleSubmit,
        formState: {errors: codeErrors},
        setError,
    } = useForm<CodeForm>({
        resolver: zodResolver(codeSchema),
    });

    const submitCode = async (data: CodeForm) => {
        try {
            const res = await defaultFetch("/auth/password/verify-code", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({
                    code: data.code,
                    email: email
                }),
                credentials: "include",
            });

            const result = await res.json();

            if (!res.ok) {
                setError("code", {
                    type: "manual",
                    message: result.message || "Ошибка при проверке кода",
                });
                return;
            }

            setCode(data.code);
            setIsShowResetPassword(!isShowResetPassword);
        } catch (error: any) {
            setError("code", {
                type: "manual",
                message: error.message || "Ошибка при проверке кода",
            });
        }
    };

    return (
        <>
            {isShowResetPassword ?
                <ResetPasswordForm
                    email={email}
                    code={code}
                    setIsShowCodeResetPassword={setIsShowCodeResetPassword}
                    setDefaultIsShowResetPassword={setDefaultIsShowResetPassword}
                    isShowResetPassword={isShowResetPassword}
                    setIsShowResetPassword={setIsShowResetPassword}
                />
                :
                <div className="max-w-[344px] lg:max-w-[380px] w-full">
                    <button className="mb-5" onClick={() => setIsShowCodeResetPassword(!isShowCodeResetPassword)}>
                        <GoArrowLeft className="w-6 h-6"/>
                    </button>
                    <H1 className="text-xl font-semibold mb-4">Подтвердите код</H1>
                    <Text variant="Body" className="mt-4">
                        Введите код из сообщения
                    </Text>

                    <form onSubmit={codeHandleSubmit(submitCode)} className="flex flex-col w-full">
                        <input
                            {...codeRegister("code")}
                            className="pb-3 border-b-[1px] outline-none border-black_60 mt-7"
                            placeholder="Введите код"
                        />
                        {codeErrors.code && (
                            <span className="text-red text-sm mt-2">{codeErrors.code.message}</span>
                        )}

                        <Button
                            type="submit"
                            styles="w-full mt-12 py-[16px] text-center bg-blue_main hover:bg-dark_blue_main transition rounded-[8px] text-[16px] font-semibold text-white outline-none"
                            text="Проверить код"
                        />
                    </form>
                </div>
            }
        </>
    );
};

export default CodeResetPasswordForm;