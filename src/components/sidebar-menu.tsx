export default function SideBarMenu(props: {className?: string; onClick?: () => void; icon: React.ReactNode; label: string; active: boolean;}) {
	return <li className={`flex justify-start items-center gap-4 p-3 cursor-pointer rounded-md ${props.active ? 'bg-blue-500 text-white' : 'bg-none text-black'}`} onClick={props.onClick}>
		{props.icon}
		<span>{props.label}</span>
	</li>
}