import { Bell, List } from "@phosphor-icons/react";
import NotificationItem from "./notification-item";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as schema from '@/database/schema';

export default function TopBar(props: {navbarState: number; sidebarController: (show: boolean) => void;}){
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState<schema.admin_notificationsType[]>([]);
    const [adminID, setAdminID] = useState<number>(0);

    const getNotification = useCallback(async (admin_id: number) => {
        return await axios.get(`${process.env.API_URL}/admin/notification?admin_id=${admin_id}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: schema.admin_notificationsType[] };
                    setNotificationData(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
    }, [])

    const markAsRead = useCallback(async (admin_id: number) => {
        return await axios.patch(`${process.env.API_URL}/admin/notification`, { admin_id }, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    refresh();
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
    }, [])

    const totalUnreadNotification = notificationData.filter((notification: schema.admin_notificationsType) => notification.is_read === false).length;

    const refresh = useCallback(() => {
        if(window !== undefined){
            const admin_id = localStorage.getItem('admin_id');
            if(admin_id) setAdminID(parseInt(admin_id));
            getNotification(parseInt(admin_id!));
        }
    }, [getNotification])

    useEffect(() => {
        refresh();
    }, [refresh]);

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
        <div className="flex flex-row-reverse justify-center items-center gap-4" onClick={() => {setShowNotification(!showNotification); markAsRead(adminID)}}>
            <div className="relative">
                <Bell size={32}/>
                {totalUnreadNotification > 0 ? <div className="p-2 bg-red-500 rounded-full absolute top-0 right-0"></div> : null}
            </div>
        </div>
        {showNotification ? <div className="bg-white w-80 md:w-96 p-4 rounded-lg absolute right-8 -top-0 mt-24 flex flex-col gap-4">
            {notificationData.length ? notificationData.map((notification: schema.admin_notificationsType) => {
                return <NotificationItem key={notification.notification_id} date={notification.notification_date!} description={notification.notification_content!}/>
            }) : <span className="text-center italic text-sm text-gray-500">Belum ada notifikasi</span>}
        </div> : null}
    </div>
}