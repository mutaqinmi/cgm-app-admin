import { HandCoins, X } from "@phosphor-icons/react";
import StatusChip from "./status-chip";
import OutlinedButton from "./outlined-button";
import FilledButton from "./filled-button";
import numberFormatter from "@/lib/formatter";
import { useCallback, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as schema from '@/database/schema';
import { create } from "zustand";
import * as dateConvert from '@/lib/date-converter';

interface ComponentState {
    paymentData: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[],
    setPaymentData: (value: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => void,
}

const useComponent = create<ComponentState>((set) => {
    return {
        paymentData: [],
        setPaymentData: (value) => set({paymentData: value}),
    }
})

export default function PaymentPopup(props: {refresh?: () => void; popupHandler: (value: boolean) => void; payment_id: number;}) {
    const component = useComponent();

    const getPaymentInfo = useCallback(async (payment_id: number) => {
        return await axios.get(`${process.env.API_URL}/admin/fees/warga?payment_id=${payment_id}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setPaymentData(data);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, [component])

    const updatePaymentInfo = useCallback(async (payment_id: number, payment_status: boolean, payment_description: string) => {
        return await axios.patch(`${process.env.API_URL}/admin/fees/warga?payment_id=${payment_id}`, {
            payment_status,
            payment_description,
        })
        .then((res: AxiosResponse) => {
            if(res.status === 200){
                if(props.refresh) props.refresh();
                props.popupHandler(false);
            }
        })
        .catch((error: AxiosError) => {
            console.log(error);
        })
    }, [props])

    const updatePaymentInfoHandler = (payment_id: number, payment_status: boolean, payment_description: string) => updatePaymentInfo(payment_id, payment_status, payment_description);

    useEffect(() => {
        getPaymentInfo(props.payment_id);
    }, [getPaymentInfo, props.payment_id])

    return !component.paymentData.length ? null : <div className="w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-0 z-50 flex justify-center items-center">
        <div className="w-4/5 md:w-96 p-4 bg-white rounded-lg">
            <div className='flex gap-4 justify-between'>
                <div className='flex gap-4 items-center'>
                    <div className='p-3 bg-blue-200 text-blue-500 rounded-md'>
                        <HandCoins size={24}/>
                    </div>
                    <div>
                        <h1 className='font-semibold'>Update Iuran</h1>
                        <span className='text-xs'>Update status iuran warga.</span>
                    </div>
                </div>
                <X onClick={() => props.popupHandler(false)}/>
            </div>
            <div className='my-6 grid grid-cols-2 gap-3'>
                <div className='col-span-2'>
                    <h2 className='font-semibold'>Nama</h2>
                    <span className='block p-2 border-2 border-slate-300 rounded-md mt-1'>{component.paymentData[0].users?.name}</span>
                </div>
                <div className='col-span-2'>
                    <h2 className='font-semibold'>Alamat</h2>
                    <span className='block p-2 border-2 border-slate-300 rounded-md mt-1'>{component.paymentData[0].users?.address}</span>
                </div>
                <div className='col-span-2'>
                    <h2 className='font-semibold'>Iuran Bulan</h2>
                    <span className='block p-2 border-2 border-slate-300 rounded-md mt-1'>{dateConvert.toString(component.paymentData[0].fees?.fee_date!)}</span>
                </div>
                <div className='col-span-1'>
                    <h2 className='font-semibold'>Jumlah Iuran</h2>
                    <span className='block p-2 border-2 border-slate-300 rounded-md mt-1'>{numberFormatter(component.paymentData[0].fees?.fee_amount?.toString()!)}</span>
                </div>
                <div className='col-span-1'>
                    <h2 className='font-semibold'>Status Iuran</h2>
                    <div className='py-3'>
                        <StatusChip status={component.paymentData[0].payments?.payment_description!}/>
                    </div>
                </div>
            </div>
            {component.paymentData[0].payments?.payment_status === true ? <FilledButton type='button' label='Tandai Belum Lunas' onClick={() => updatePaymentInfoHandler(component.paymentData[0].payments.payment_id, false, 'undone')}/> : <div className='flex gap-2'>
                <OutlinedButton type='button' label='Batal' onClick={() => props.popupHandler(false)}/>
                <FilledButton type='button' label='Tandai Lunas' onClick={() => updatePaymentInfoHandler(component.paymentData[0].payments.payment_id, true, 'done')}/>
            </div>}
        </div>
    </div>
}