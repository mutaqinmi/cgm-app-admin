import { CaretDown } from "@phosphor-icons/react";

export default function DropDown(props: {onClick?: () => void; label: string}){
    return <button className="py-3 px-4 w-36 bg-blue-500 text-white flex justify-between items-center gap-4 rounded-full" onClick={props.onClick}>
        <span>{props.label}</span>
        <CaretDown size={16} className="text-white"/>
    </button>
}