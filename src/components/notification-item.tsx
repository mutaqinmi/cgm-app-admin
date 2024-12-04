import { Bell } from "lucide-react";

export default function NotificationItem(props: {date: string; description: string}) {
    return <div className="flex gap-4 justify-start items-center">
        <div className="p-3 bg-blue-200 rounded-lg">
            <Bell className="text-blue-500" size={18}/>
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">{props.date}</span>
            <span className="text-sm">{props.description}</span>
        </div>
    </div>
}