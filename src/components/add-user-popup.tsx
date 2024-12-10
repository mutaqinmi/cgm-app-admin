import { MicrosoftExcelLogo, X, XCircle } from "@phosphor-icons/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import Form from "next/form";
import { useCallback, useState } from "react";
import FilledButton from "./filled-button";
import OutlinedButton from "./outlined-button";
import HorizontalDivider from "./horizontal-divider";
import readXlsxFile from "read-excel-file";
import TableHead from "./table-head";
import UserListItem from "./user-list-item";
import * as schema from '@/database/schema';

export default function AddUserPopup(props: {refresh?: () => void; popupHandler: (value: boolean) => void}) {
    const [fileError, setFileError] = useState<string | null>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const [fileValue, setFileValue] = useState<schema.usersType[] | null>(null);

    const createNewUser = useCallback(async (name: string, phone: string, address: string, rt: string) => {
        return await axios.post(`${process.env.API_URL}/admin/users`, { name, phone, address, rt }, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    if(props.refresh) props.refresh();
                    props.popupHandler(false);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, [props]);

    const createMultipleNewUser = useCallback(async (users: schema.usersType[]) => {
        return await axios.post(`${process.env.API_URL}/admin/users?multiple=true`, { users }, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    if(props.refresh) props.refresh();
                    props.popupHandler(false);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, [props]);

    const createNewUserHandler = (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); createNewUser(e.currentTarget.username.value, e.currentTarget.phone.value, e.currentTarget.address.value, e.currentTarget.rt.value)};
    const createMultipleNewUserHandler = (fileValue: schema.usersType[]) => createMultipleNewUser(fileValue);
    const uploadXLSXhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const schema = {
            'Nama Warga': {
                prop: 'name',
                type: String,
                required: true
            },
            'No Telepon': {
                prop: 'phone',
                type: String,
                required: true
            },
            'Alamat': {
                prop: 'address',
                type: String,
                required: true
            },
            'RT': {
                prop: 'rt',
                type: String,
                required: true
            }
        }

        setFileData(e.currentTarget.files![0]);
        setFileError(null);

        readXlsxFile(e.currentTarget.files![0], { schema: schema }).then((rows) => {
            if(rows.errors.length > 0){
                setFileData(null);
                rows.errors.forEach((error) => {
                    if(error.error === 'required') return setFileError(`Kolom ${error.column} tidak boleh kosong, tambahkan kolom untuk melanjutkan`);
                })
            }

            setFileValue(rows.rows as schema.usersType[]);
        });
    }

    return <div className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex justify-center items-center">
        <div className="w-4/5 md:w-96 p-4 bg-white rounded-lg">
            <div className="flex justify-between">
                <h1 className="font-semibold text-xl">Tambah Warga</h1>
                <X onClick={() => props.popupHandler(false)}/>
            </div>
            {fileData ? <div className="w-full mt-8 flex justify-between items-center p-3 border border-blue-500 bg-blue-100 rounded-md">
                <div className="w-full flex gap-3">
                    <MicrosoftExcelLogo size={42} className="text-blue-500"/>
                    <div className="flex flex-col justify-center">
                        <span>{fileData.name}</span>
                        <span className="text-sm text-gray-500">
                            {fileData.size < 1024 * 1024 
                                ? `${(fileData.size / 1024).toFixed(2)} KB` 
                                : `${(fileData.size / (1024 * 1024)).toFixed(2)} MB`}
                        </span>
                    </div>
                </div>
                <XCircle size={24} className="text-blue-500" onClick={() => {setFileData(null); setFileValue(null)}}/>
            </div> : <div className="mt-8">
                <label htmlFor="upload_xlsx" className="w-full p-3 flex gap-2 items-center justify-center bg-blue-500 text-white rounded-md">Impor file .xlsx <MicrosoftExcelLogo size={24}/></label>
                <input type="file" name="upload_xlsx" id="upload_xlsx" className="hidden" accept=".xlsx" onChange={uploadXLSXhandler} multiple={false}/>
                {fileError ? <span className="text-sm text-red-500">{fileError}</span> : null}
            </div>}
            {fileValue ? <div className="mt-4">
                    <span className="text-lg font-semibold">Data Warga</span>
                    <div className="mt-4 max-h-96 overflow-auto">
                        <table className="w-full border-separate border-spacing-4">
                            <TableHead title={['Nama', 'No. Telepon', 'Alamat', 'RT']}/>
                            <tbody>
                                {fileValue.map((user: schema.usersType, index: number) => {
                                    return <UserListItem key={index} name={user.name!} phone={user.phone!} address={user.address!} rt={user.rt!}/>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex gap-2 mt-8'>
                        <OutlinedButton type='button' label='Batal' onClick={() => props.popupHandler(false)}/>
                        <FilledButton type='button' label='Tambah Warga' onClick={() => createMultipleNewUser(fileValue)}/>
                    </div>
                </div> : <>
                <div className="flex gap-2 justify-center items-center mt-4">
                    <HorizontalDivider/>
                    <span className="text-gray-500">atau</span>
                    <HorizontalDivider/>
                </div>
                <Form action={""} formMethod="POST" className="grid grid-cols-3 mt-4 gap-4" onSubmit={createNewUserHandler}>
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
            </>}
        </div>
    </div>
}