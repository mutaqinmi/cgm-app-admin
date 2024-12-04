export default function UserListItem(props: {onClick?: () => void; name: string; phone: string; address: string; rt: string;}) {
    return <tr className="text-center border-b border-b-gray-200 cursor-pointer" onClick={props.onClick}>
        <td className="py-3">{props.name}</td>
        <td className="py-3">{props.phone}</td>
        <td className="py-3">{props.address}</td>
        <td className="py-3">{props.rt}</td>
    </tr>
}