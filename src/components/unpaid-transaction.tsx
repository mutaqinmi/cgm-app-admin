import { CaretRight, XCircle } from "@phosphor-icons/react";
import * as dateConvert from '@/lib/date-converter';

export default function UnpaidTransaction(props: {onClick?: () => void; month: string; status: string}) {
    return <div className="flex gap-4 justify-between items-center cursor-pointer" onClick={props.onClick}>
        <div className="flex gap-4">
            <div className="p-3 bg-red-200 rounded-lg">
                <XCircle className="text-red-500" size={24}/>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                    <span className="text-xs">{dateConvert.toString(props.month)}</span>
                    <span className="rounded-full bg-red-200 px-2 py-1 text-red-500 text-xs">{props.status}</span>
                </div>
                <span className="text-md font-semibold">{`Iuran Bulan ${dateConvert.toString(props.month)}`}</span>
            </div>
        </div>
        <CaretRight size={14}/>
    </div>
}