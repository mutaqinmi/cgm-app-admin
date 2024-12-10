export default function HorizontalDivider(props: {className?: string}) {
    return <div className={`w-full h-[0.5px] bg-gray-500 bg-opacity-50 my-2 ${props.className}`}></div>
}