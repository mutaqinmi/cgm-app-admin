export default function DropDownItem(props: {onClick?: () => void; label: string}) {
    return <button className="w-full p-2 md:p-3 bg-white hover:bg-gray-100" onClick={props.onClick}>{props.label}</button>
}