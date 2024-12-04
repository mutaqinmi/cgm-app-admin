export default function Container(props: {children: React.ReactNode}){
    return <div className="bg-white p-4 md:p-8 rounded-lg">
        {props.children}
    </div>
}