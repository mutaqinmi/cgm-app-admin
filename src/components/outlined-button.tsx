export default function OutlinedButton(props: {className?: string; onClick?: () => void; labelColor?: string; type: "submit" | "button"; label: string}) {
    return <button type={props.type} className={`w-full h-12 rounded-md bg-white border border-blue-500 ${props.className}`} onClick={props.onClick}>
        <span className={`${props.labelColor ? props.labelColor : 'text-blue-500'} font-semibold text-sm`}>{props.label}</span>
    </button>;
}