import StatusChip from "./status-chip";

export default function UserListFeeItem(props: {onClick?: () => void; name: string; address: string; status: string}) {
    return <tr className="text-center border-b border-b-gray-200 cursor-pointer" onClick={props.onClick}>
        <td className="text-nowrap">{props.name}</td>
        <td className="text-nowrap">{props.address}</td>
        <td className="text-nowrap">
            <StatusChip status={props.status}/>
        </td>
    </tr>
}