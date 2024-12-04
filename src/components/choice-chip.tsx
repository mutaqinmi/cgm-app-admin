export default function ChoiceChip(props: {onClick?: () => void; label: string; active: boolean;}) {
    return <button className={`px-4 py-2 rounded-full border border-blue-500 ${props.active ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-500'}`} onClick={props.onClick}>{props.label}</button>
}