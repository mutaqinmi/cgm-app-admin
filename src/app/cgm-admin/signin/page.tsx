'use client'
import Logo from "@/components/logo";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";
import { create } from "zustand";
import axios, { AxiosError, AxiosResponse } from "axios";
import ErrorSigninPopup from "@/components/error-signin-popup";
import PhoneNumberInput from "@/components/phone-number-input";
import PasswordInputField from "@/components/password-input-field";
import FilledButton from "@/components/filled-button";
import LoadingAnimation from "@/components/loading-animation";

interface InputState {
    phone: string;
    password: string;
    setPhone: (phone: string) => void;
    setPassword: (password: string) => void;
}

const useInput = create<InputState>((set) => {
    return {
        phone: "",
        password: "",
        setPhone: (phone: string) => set({phone}),
        setPassword: (password: string) => set({password})
    }
})

export default function Page(){
    const route = useRouter();
    const {phone, password} = useInput.getState();
    const {setPhone, setPassword} = useInput();
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const signin_api = useCallback(async (phone: string, password: string) => {
        setIsLoading(true);
        setError(undefined);

        return await axios.post(`${process.env.API_URL}/admin/auth/signin`, {
            phone,
            password
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response: AxiosResponse) => {
            if(response.status === 200){
                const { user, admin_id } = response.data?.data as { user: string; admin_id: number };
                localStorage.setItem("user", user);
                localStorage.setItem("admin_id", admin_id.toString());
                route.push("/cgm-admin/dashboard");
            }
        }).catch((error: AxiosError) => {
            console.log(error.response?.data);
            const {message} = error.response?.data as {message: string};
            setError(message);
        }).finally(() => setIsLoading(false));
    }, [route])

    const signin = (event: FormEvent<HTMLFormElement>) : void => {
        event.preventDefault();
        signin_api(phone, password);
    }

    return isLoading ? <LoadingAnimation/> : <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div className="p-4 w-4/5 md:w-80 rounded-md bg-white">
            <div>
                <h1 className="text-3xl font-semibold">Masuk</h1>
                <span className="text-sm">Masuk untuk melanjutkan.</span>
            </div>
            {!error ? null : <ErrorSigninPopup message={error}/>}
            <Form action={""} formMethod="POST" onSubmit={signin}>
                <PhoneNumberInput phone={phone} setPhone={setPhone} className="mt-12"/>
                <PasswordInputField password={password} setPassword={setPassword}/>
                <FilledButton type="submit" className="mt-12" label="Masuk"/>
            </Form>
        </div>
        <Logo className="mt-24"/>
    </div>
}