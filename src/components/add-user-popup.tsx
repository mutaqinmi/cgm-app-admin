import { X } from "@phosphor-icons/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import Form from "next/form";
import { useCallback } from "react";
import FilledButton from "./filled-button";
import OutlinedButton from "./outlined-button";

export default function AddUserPopup(props: {refresh?: () => void; popupHandler: (value: boolean) => void}) {
    const createNewUser = useCallback(async (name: string, phone: string, address: string, rt: string) => {
        return await axios.post(`${process.env.API_URL}/admin/users`, { name, phone, address, rt })
            .then((res: AxiosResponse) => {
                if(res.status === 201){
                    if(props.refresh) props.refresh();
                    props.popupHandler(false);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, [props]);

    const createNewUserHandler = (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); createNewUser(e.currentTarget.username.value, e.currentTarget.phone.value, e.currentTarget.address.value, e.currentTarget.rt.value)};

    return <div className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex justify-center items-center">
        <div className="w-4/5 md:w-96 p-4 bg-white rounded-lg">
            <div className="flex justify-between">
                <h1 className="font-semibold text-xl">Tambah Warga</h1>
                <X onClick={() => props.popupHandler(false)}/>
            </div>
            <Form action={""} formMethod="POST" className="grid grid-cols-3 mt-8 gap-4" onSubmit={createNewUserHandler}>
                <div className="w-full col-span-3 relative">
                    <input type="text" name="username" id="username" className="w-full px-3 py-2 border border-slate-500 rounded-lg outline-none peer" required/>
                    <label htmlFor="username" className="transition-all ease-in-out absolute bg-white px-2 top-1/2 -translate-y-1/2 left-2 peer-focus:text-xs peer-focus:top-0 peer-valid:text-xs peer-valid:top-0">Nama Warga</label>
                </div>
                <div className="w-full col-span-3 relative">
                    <input type="tel" name="phone" id="phone" className="w-full px-3 py-2 border border-slate-500 rounded-lg outline-none peer" required/>
                    <label htmlFor="phone" className="transition-all ease-in-out absolute bg-white px-2 top-1/2 -translate-y-1/2 left-2 peer-focus:text-xs peer-focus:top-0 peer-valid:text-xs peer-valid:top-0">No Telepon</label>
                </div>
                <div className="w-full col-span-2 relative">
                    <textarea rows={3} name="address" id="address" className="w-full px-3 py-2 border border-slate-500 rounded-lg outline-none peer" required></textarea>
                    <label htmlFor="address" className="transition-all ease-in-out absolute bg-white px-2 top-1/2 -translate-y-1/2 left-2 peer-focus:text-xs peer-focus:top-0 peer-valid:text-xs peer-valid:top-0">Alamat</label>
                </div>
                <select name="rt" id="rt" className="col-span-1 w-full h-fit px-3 py-2 border border-slate-500 rounded-lg outline-none" required>
                    <option defaultValue={"Pilih RT"} disabled>Pilih RT</option>
                    <option value="1">RT 001</option>
                    <option value="2">RT 002</option>
                    <option value="3">RT 003</option>
                    <option value="4">RT 004</option>
                </select>
                <div className='flex gap-2 col-span-3 mt-4'>
                    <OutlinedButton type='button' label='Batal' onClick={() => props.popupHandler(false)}/>
                    <FilledButton type='submit' label='Tambah Warga'/>
                </div>
            </Form>
        </div>
    </div>
}