import { Bell, List } from "@phosphor-icons/react";
import NotificationItem from "./notification-item";
import { useState } from "react";

export default function TopBar(props: {navbarState: number; sidebarController: (show: boolean) => void;}){
    const [showNotification, setShowNotification] = useState(false);

    return <div className="flex w-full py-6 px-4 md:px-8 md:pl-72 z-40 justify-between items-center bg-white fixed top-0">
        <div className="flex items-center gap-4">
            <List size={24} onClick={() => props.sidebarController(true)} className="md:hidden"/>
            <h1 className="text-2xl font-semibold">{(() => {
                if(props.navbarState === 0) return 'Dashboard';
                if(props.navbarState === 1) return 'Iuran';
                if(props.navbarState === 2) return 'Warga';
                if(props.navbarState === 3) return 'Pengaturan';
            })()}</h1>
        </div>
        <div className="flex flex-row-reverse justify-center items-center gap-4">
            <Bell size={32} onClick={() => setShowNotification(!showNotification)}/>
        </div>
        {showNotification ? <div className="bg-white w-80 md:w-96 p-4 rounded-lg absolute right-8 -top-0 mt-20 flex flex-col gap-4">
            <NotificationItem date="Senin, 11 November 2024 06.34" description="Aktivitas login terdeteksi, Anda login pada perangkat A-113B. Jika bukan anda, segera amankan akun anda!"/>
            <NotificationItem date="Senin, 11 November 2024 06.34" description="Aktivitas login terdeteksi, Anda login pada perangkat A-113B. Jika bukan anda, segera amankan akun anda!"/>
            <NotificationItem date="Senin, 11 November 2024 06.34" description="Aktivitas login terdeteksi, Anda login pada perangkat A-113B. Jika bukan anda, segera amankan akun anda!"/>
        </div> : null}
    </div>
}