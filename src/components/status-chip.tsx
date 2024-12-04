export default function StatusChip(props: {status: string}) {
    if(props.status === "done"){
        return <span className="rounded-full bg-green-200 px-2 py-1 text-green-500 text-xs">Lunas</span>
    } else if (props.status === "pending"){
        return <span className="rounded-full bg-yellow-200 px-2 py-1 text-yellow-500 text-xs">Menunggu Konfirmasi</span>
    }
    
    return <span className="rounded-full bg-red-200 px-2 py-1 text-red-500 text-xs">Belum Lunas</span>
}