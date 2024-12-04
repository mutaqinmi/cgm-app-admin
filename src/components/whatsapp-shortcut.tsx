import { WhatsappLogo } from "@phosphor-icons/react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function WhatsAppShortcut(){
    const route = useRouter();
    const [phone, setPhone] = useState<string>("");
    const getAdministratorPhone = useCallback(async () => {
        return await axios.get(`${process.env.API_URL}/general?get=whatsapp`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { phone } = res.data as { phone: string };
                    const formattedPhone = `https://wa.me/${phone.charAt(0).replace('0', '62')}` + phone.slice(1);
                    setPhone(formattedPhone);
                }
            })
    }, [])

    useEffect(() => {
        getAdministratorPhone();
    }, [getAdministratorPhone]);

    return <div className="py-4 md:py-3 px-4 bg-green-500 text-white rounded-full absolute bottom-8 right-8 flex items-center gap-2 cursor-pointer" onClick={() => route.push(phone)}>
        <span className="hidden md:flex">Butuh Bantuan?</span>
        <WhatsappLogo size={32}/>
    </div>
}