import * as date from '@/lib/date-converter';

export default function LongFeeChip(props: {item: string;}) {
    return <div className="px-4 py-2 bg-blue-500 text-white rounded-full">
        <span>{date.toString(props.item)}</span>
    </div>
}