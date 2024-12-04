export default function FilledButton(props: {className?: string; onClick?: () => void; type: "submit" | "button"; label: string}) {
    return <button type={props.type} className={`w-full h-12 rounded-md bg-[#3D8FED] ${props.className}`} onClick={props.onClick}>
        <span className="text-white font-semibold text-sm">{props.label}</span>
    </button>;
  }