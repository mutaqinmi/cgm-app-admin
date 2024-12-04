import numberFormatter from "@/lib/formatter";

export default function Card(props: {color: string; title: string; total: number; nominal: number; icon: React.ReactNode;}) {
    return <div className="w-full col-span-1 bg-white p-4 flex gap-4 items-center rounded-lg">
        <div className={`p-2 md:p-3 bg-${props.color}-200 text-${props.color}-500 text-2xl md:text-4xl rounded-lg`}>
            {props.icon}
        </div>
        <div className="flex flex-col">
            <span className="text-xs text-gray-500">{props.title}</span>
            <span className="text-2xl font-semibold">{props.total}</span>
            <span className={`text-xs md:text-sm text-${props.color}-500 mt-1`}>( {numberFormatter(props.nominal.toString())} )</span>
        </div>
    </div>
}