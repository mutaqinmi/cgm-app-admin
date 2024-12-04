import * as dateConvert from '@/lib/date-converter';
import { X } from '@phosphor-icons/react';
import Form from 'next/form';
import FilledButton from './filled-button';
import { useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import OutlinedButton from './outlined-button';

export default function SetFeePopup(props: {refresh?: () => void; popupHandler: (show: boolean) => void}){
    const setNewFee = useCallback(async (amount: number) => {
        return await axios.post(`${process.env.API_URL}/admin/fees`, { amount })
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

    const setNewFeeHandler = (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); setNewFee(e.currentTarget.amount.value)};

    return <div className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex justify-center items-center">
        <div className="w-4/5 md:w-80 p-4 bg-white rounded-lg">
            <div className="flex justify-between">
                <div>
                    <span className="text-sm">Atur Iuran</span>
                    <h1 className="font-semibold text-xl">{dateConvert.toString(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`)}</h1>
                </div>
                <X onClick={() => props.popupHandler(false)}/>
            </div>
            <Form action={""} formMethod='POST' onSubmit={setNewFeeHandler}>
                <div className="my-8 flex flex-col gap-2">
                    <span>Jumlah Iuran</span>
                    <div className="relative">
                        <span className="font-semibold text-gray-500 absolute top-1/2 -translate-y-1/2 left-3">Rp.</span>
                        <input type="text" name="amount" id="amount" inputMode="numeric" className="w-full py-2 pl-11 pr-3 outline-none border border-slate-500 rounded-lg font-semibold" placeholder="Masukkan Jumlah Iuran"/>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <OutlinedButton type='button' label='Batal' onClick={() => props.popupHandler(false)}/>
                    <FilledButton type='submit' label='Atur Iuran'/>
                </div>
            </Form>
        </div>
    </div>
}