export default function RegularChoiceChip(props: {onClick?: () => void; active: boolean; label: string}){
    return <button className={`px-4 py-3 rounded-full text-xs md:text-base ${props.active? 'bg-blue-500 text-white' : 'bg-white text-black'}`} onClick={props.onClick}>{props.label}</button>
}