export default function TableHead(props: {title: string[]}){
    return <thead>
        <tr className="text-center">
            {props.title.map((title: string, index: number) => {
                return <th key={index}>{title}</th>
            })}
        </tr>
    </thead>
}