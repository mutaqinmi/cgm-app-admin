import { ChartBar, Gear, HandCoins, SignOut, Users, X } from "@phosphor-icons/react";
import Logo from "./logo";
import SideBarMenu from "./sidebar-menu";
import HorizontalDivider from "./horizontal-divider";
import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function SideBar(props: {className?: string; sidebarState: boolean; sidebarController: (show: boolean) => void; navbarState: number}) {
    const route = useRouter();

    const signoutAPI = useCallback(async () => {
        const confirmDialog = confirm("Apakah anda yakin ingin keluar?");
        if(!confirmDialog) return;

        return await axios.get(`${process.env.API_URL}/admin/auth/signout`)
            .then(res => {
                if(res.status === 200){
                    localStorage.clear();
                    route.refresh();
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
    }, [route]);

    const signoutController = useCallback(async () => await signoutAPI(), [signoutAPI]);

    return <div className={`h-screen w-60 bg-white md:flex flex-col justify-between fixed top-0 left-0 z-50 ${props.sidebarState ? 'flex' : 'hidden'}`}>
        <X size={24} className="absolute right-4 top-8 md:hidden" onClick={() => props.sidebarController(false)}/>
        <div>
            <div className="w-full flex justify-center items-center p-8">
                <Logo/>
            </div>
            <div className="mt-4 p-4">
                <ul>
                    <SideBarMenu icon={<ChartBar size={24}/>} label="Dashboard" active={props.navbarState === 0} onClick={() => {route.push('/cgm-admin/dashboard'); props.sidebarController(false)}}/>
                    <SideBarMenu icon={<HandCoins size={24}/>} label="Iuran" active={props.navbarState === 1} onClick={() => {route.push('/cgm-admin/iuran'); props.sidebarController(false)}}/>
                    <SideBarMenu icon={<Users size={24}/>} label="Warga" active={props.navbarState === 2} onClick={() => {route.push('/cgm-admin/warga'); props.sidebarController(false)}}/>
                </ul>
            </div>
        </div>
        <div className="p-4">
            <ul>
                <SideBarMenu icon={<Gear size={24}/>} label="Pengaturan" active={props.navbarState === 3} onClick={() => {route.push('/cgm-admin/settings'); props.sidebarController(false)}}/>
                <li>
                    <HorizontalDivider/>
                </li>
                <SideBarMenu icon={<SignOut size={24}/>} label="Keluar" active={false} onClick={signoutController}/>
            </ul>
        </div>
    </div>
}