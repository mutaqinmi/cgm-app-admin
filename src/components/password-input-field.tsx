'use client'
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";

export default function PasswordInputField(props: {password: string; setPassword: (password: string) => void}){
    const [show, setShow] = useState(false);

    return <div className="flex relative my-2">
        <input required id="password" name="password" type={show ? "text" : "password"} className="peer w-full outline-none px-4 py-3 text-base rounded-md bg-white border-2" onChange={(event) => props.setPassword(event.currentTarget.value)} value={props.password}/>
        <label htmlFor="password" className="text-gray-500 text-sm cursor-text absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-300">
            Password
        </label>
        {show ? <Eye size={20} className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => setShow(false)}/> : <EyeSlash size={20} className="absolute top-1/2 -translate-y-1/2 right-4" onClick={() => setShow(true)}/>}
    </div>
}