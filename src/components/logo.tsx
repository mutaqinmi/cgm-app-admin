import Image from "next/image"

export default function Logo(props: {className?: string}) {
  return <Image
    src="/assets/logo.png"
    width={500}
    height={500}
    alt="Logo"
    className={`w-20 ${props.className}`}
  />
}