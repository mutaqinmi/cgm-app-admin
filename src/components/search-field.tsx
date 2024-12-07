import { MagnifyingGlass } from "@phosphor-icons/react";

export default function SearchField(props: {customWidth?: string; onChange: (keyword: string) => void; value: string; setValue: (value: string) => void}) {
    return <div className={`relative w-full ${props.customWidth ? props.customWidth : 'md:w-72'}`}>
        <input type="search" name="search" id="search" placeholder="Cari Warga atau Alamat" className={`w-full ${props.customWidth ? props.customWidth : 'md:w-72'} bg-zinc-100 rounded-lg py-3 pl-4 pr-8 border-none outline-none`} value={props.value} onChange={(e) => {props.setValue(e.currentTarget.value); props.onChange(e.currentTarget.value)}} onKeyUp={(e) => {props.setValue(e.currentTarget.value); props.onChange(e.currentTarget.value)}}/>
        <MagnifyingGlass size={16} className="text-gray-500 absolute top-1/2 -translate-y-1/2 right-4"/>
    </div>
}