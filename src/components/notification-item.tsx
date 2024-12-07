import { Bell } from "lucide-react";

export default function NotificationItem(props: {date: Date; description: string}) {
    const dateFormat = (date: Date) => {
        const datetime = new Date(date);
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const day = datetime.getUTCDate();
        const month = months[datetime.getMonth()];
        const year = datetime.getFullYear();
        const hours = datetime.getUTCHours().toString().padStart(2, '0');
        const minutes = datetime.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year} ${hours}.${minutes}`;
    }

    return <div className="flex gap-4 justify-start items-center">
        <div className="p-3 bg-blue-200 rounded-lg">
            <Bell className="text-blue-500" size={18}/>
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">{dateFormat(props.date)}</span>
            <span className="text-sm">{props.description}</span>
        </div>
    </div>
}