export default function UserListItem(props: {onClick?: () => void; name: string; phone: string; address: string; rt: string;}) {
    return <tr className="text-center border-b border-b-gray-200 cursor-pointer" onClick={props.onClick}>
        <td className="text-nowrap">{props.name}</td>
        <td className="text-nowrap">{props.phone}</td>
        <td className="text-nowrap">{props.address}</td>
        <td className="text-nowrap">{props.rt}</td>
    </tr>
}