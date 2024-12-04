import { useState } from "react";
import SideBar from "./sidebar";
import TopBar from "./topbar";

export default function NavigationBar(props: {children: React.ReactNode, sidebarIndex: number}) {
    const [showSidebar, setShowSidebar] = useState(false);

    return <div>
        <SideBar sidebarState={showSidebar} sidebarController={setShowSidebar} navbarState={props.sidebarIndex}/>
        <TopBar navbarState={props.sidebarIndex} sidebarController={setShowSidebar}/>
        <div className="md:ml-64 mt-12 p-4 md:p-8">
            {props.children}
        </div>
    </div>
}