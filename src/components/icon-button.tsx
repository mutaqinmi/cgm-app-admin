export default function IconButton(props: {onClick?: () => void; icon: React.ReactNode}) {
    return <div className="p-4 bg-blue-500 rounded-md justify-center items-center flex text-white" onClick={props.onClick}>
        {props.icon}
    </div>
}