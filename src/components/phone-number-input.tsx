import Image from "next/image";

export default function PhoneNumberInput(props: {className?: string; phone: string; setPhone: (phone: string) => void}) {
    return <div className={`flex w-full items-center my-2 gap-4 ${props.className}`}>
        <div className="flex items-center w-28 h-11 rounded-lg px-2 gap-1 cursor-default">
            <Image src="/assets/bendera.png" width={500} height={500} alt="Indonesian Flag" className="w-10 h-5"/>
            <span className="font-semibold">+62</span>
        </div>
        <div className="w-full relative flex rounded-lg">
            <input required className="peer w-full outline-none px-4 py-3 text-base rounded-md bg-white border-2" id="phone" name="phone" type="tel" inputMode="numeric" onChange={(event) => props.setPhone(event.currentTarget.value)} value={props.phone}/>
            <label htmlFor="phone" className="text-gray-500 text-sm cursor-text absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 peer-focus:text-sm peer-focus:text-black peer-valid:-top-0 peer-valid:left-3 peer-valid:text-sm peer-valid:text-black duration-300">
                Nomor Telepon
            </label>
        </div>
    </div>
}