import { CheckCircle } from "@phosphor-icons/react";

export default function FeeHistory(props: {date: string; status: string; title:string; colors:string;}){
    return<div className="flex gap-4 items-center mt-4">
        <div className="p-3 bg-blue-200 rounded-lg">
            <CheckCircle className="text-blue-500" size={24}/>
        </div>
        <div className="flex flex-col">
            <div className="flex gap-2 items-center">
                <span className="text-xs">{props.date}</span>
                <span className="leading-none">&#8226;</span>
                <span className="rounded-full bg-green-200 px-2 py-1 text-green-500 text-xs">{props.status}</span>
            </div>
            <span className="text-md font-semibold">{props.title}</span>
        </div>
    </div>
}