'use client';
import ChoiceChip from "@/components/choice-chip";
import Container from "@/components/container";
import FeeListItem from "@/components/fee-list-item";
import LongFeeChip from "@/components/long-fee-chip";
import NavigationBar from "@/components/navigation-bar";
import UnpaidTransaction from "@/components/unpaid-transaction";
import { DotsThreeVertical, MapPin, Phone, Plus, Trash, User } from "@phosphor-icons/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { create } from "zustand";
import * as schema from '@/database/schema';
import numberFormatter from "@/lib/formatter";
import EditUserPopup from "@/components/edit-user-popup";
import PaymentPopup from "@/components/payment-popup";
import LoadingAnimation from "@/components/loading-animation";
import * as dateConvert from "@/lib/date-converter";

interface ComponentState {
    userData: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    paymentsList: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    undonePayments: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[],
    monthList: string[],
    showContextMenu: boolean,
    filterStatusIndex: number,
    showEditUserPopup: boolean,
    showPaymentPopup: boolean,
    selectedPaymentID: number,
    setUserData: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setPaymentsList: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setUndonePayments: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => void,
    setMonthList: (value: string[]) => void,
    setShowContextMenu: (value: boolean) => void,
    setFilterStatusIndex: (value: number) => void,
    setShowEditUserPopup: (value: boolean) => void,
    setShowPaymentPopup: (data: boolean) => void,
    setSelectedPaymentID: (data: number) => void
}

const useComponent = create<ComponentState>((set) => {
    return {
        userData: [],
        paymentsList: [],
        undonePayments: [],
        undonePaymentsCount: 0,
        undonePaymentsPagination: 1,
        monthList: [],
        showContextMenu: false,
        filterStatusIndex: 0,
        showEditUserPopup: false,
        showPaymentPopup: false,
        selectedPaymentID: 0,
        setUserData: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => set({ userData: value }),
        setPaymentsList: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => set({ paymentsList: value }),
        setUndonePayments: (value: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => set({ undonePayments: value }),
        setMonthList: (value: string[]) => set({ monthList: value }),
        setShowContextMenu: (value: boolean) => set({ showContextMenu: value }),
        setFilterStatusIndex: (value: number) => set({ filterStatusIndex: value }),
        setShowEditUserPopup: (value: boolean) => set({ showEditUserPopup: value }),
        setShowPaymentPopup: (data) => set(() => ({ showPaymentPopup: data })),
        setSelectedPaymentID: (data) => set(() => ({ selectedPaymentID: data }))
    }
})

function DetailWarga(){
    const component = useComponent();
    const searchParams = useSearchParams();
    const route = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const month_inc = useRef(1);
    const currentDate = useRef({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    })

    const getUserData = useCallback(async (user_id: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/users?user_id=${user_id}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setUserData(data);
                    component.setPaymentsList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getUndonePaymentsFilteredData = useCallback(async (user_id: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/users?user_id=${user_id}&filtered=true`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setUndonePayments(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getStatusFilteredData = useCallback(async (user_id: number, status: string) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/users?user_id=${user_id}&status=${status}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setPaymentsList(data);
                    currentDate.current.month = parseInt(data[0].fees.fee_date?.split('-')[1]!);
                    currentDate.current.year = parseInt(data[0].fees.fee_date?.split('-')[0]!);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const setCurrentDate = useCallback(async (user_id: number, status: string) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/users?user_id=${user_id}&status=${status}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    currentDate.current.month = parseInt(data[0].fees.fee_date?.split('-')[1]!);
                    currentDate.current.year = parseInt(data[0].fees.fee_date?.split('-')[0]!);
                }
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const setMultipleFees = useCallback(async (user_id: number, monthList: string[]) => {
        setIsLoading(true);

        return await axios.post(`${process.env.API_URL}/admin/fees?multiple=true`, {
            user_id,
            date: monthList
        }, { withCredentials: true })
        .then((res: AxiosResponse) => {
            if(res.status === 200){
                const month = monthList.map((month) => dateConvert.toString(month));
                setUserNotification(user_id, 'Pembayaran berhasil', `Pembayaran iuran untuk bulan ${month} telah dikonfirmasi oleh Admin. Terima kasih!`)
                resetDate();
                refresh();
            }
        })
        .catch((error: AxiosError) => {
            const { message } = error.response?.data as { message: string };
            console.log(message);
        })
        .finally(() => setIsLoading(false));
    }, []);

    const setUserNotification = useCallback(async (user_id: number, notification_title: string, notification_content: string) => {
        return await axios.post(`${process.env.API_URL}/admin/notification?type=plain`, {
            user_id,
            notification_title,
            notification_content,
        }, { withCredentials: true })
        .then((res: AxiosResponse) => {
            if(res.status === 200){
                return true;
            }
        })
        .catch((error: AxiosError) => {
            const { message } = error.response?.data as { message: string };
            console.log(message);
        })
    }, [])

    const getHistoryByDate = useCallback(async (user_id: number, date: string) => {
        return await axios.get(`${process.env.API_URL}/admin/users?user_id=${user_id}&date=${date}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] };
                    component.setPaymentsList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
    }, []);

    const deleteUser = useCallback(async (user_id: number) => {
        return await axios.delete(`${process.env.API_URL}/admin/users?user_id=${user_id}`, { withCredentials: true })
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    return route.push('/warga');
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                alert(message);
            })
    }, []);

    const add_month = () => {
        let month = currentDate.current.month + month_inc.current;
        let year = currentDate.current.year;

        if (month > 12) {
            month = 1;
            year += 1;
        }

        const formattedDate: string = `${year}-${month.toString().padStart(2, "0")}`;
        const updatedList = [...component.monthList, formattedDate];
        component.setMonthList(updatedList);

        currentDate.current.month = month;
        currentDate.current.year = year;
        month_inc.current = 1;
    }

    const totalUndoneAmount = component.undonePayments.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.fees.fee_amount!;
    }, 0);

    const groupByYear = (data: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[]) => {
        return data.reduce((acc, item) => {
            const year = item.fees.fee_date!.split('-')[0];
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(item);
            return acc;
        }, {} as { [key: string]: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}[] });
    };

    const groupData = groupByYear(component.paymentsList);
    const setMultipleFeesHandler = (user_id: number, monthList: string[]) => setMultipleFees(user_id, monthList);
    const StatusFilteredDataHandler = (user_id: number, status: string) => {
        if(status === 'Semua'){
            return getUserData(user_id);
        }

        return getStatusFilteredData(user_id, status);
    };
    const deleteUserHandler = (user_id: number) => {
        const confirmDelete = confirm('Apakah anda yakin ingin menghapus warga ini?');
        if(!confirmDelete) return;

        deleteUser(user_id);
    };
    const dateHistoryFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => getHistoryByDate(component.userData[0].user_id, e.currentTarget.value);

    const resetDate = () => {
        currentDate.current = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        };

        month_inc.current = 1;
        component.setMonthList([]);
    };

    const refresh = useCallback(() => {
        const user_id = searchParams.get('user_id');
        if(user_id){
            getUserData(parseInt(user_id));
            getUndonePaymentsFilteredData(parseInt(user_id));
            setCurrentDate(parseInt(user_id), 'done');
        }
    }, [searchParams, getUserData, getUndonePaymentsFilteredData])
 
    useEffect(() => {
        refresh();
    }, [refresh]);
        
    return isLoading ? <LoadingAnimation/> : component.userData ? <NavigationBar sidebarIndex={2}>
        {!component.userData.length ? <div className="w-full h-screen flex flex-col gap-8 justify-center items-center text-center">
            <span>Anda perlu mengatur Iuran bulan {dateConvert.toString(`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)} dahulu untuk melihat data warga. <span className="cursor-pointer underline" onClick={() => route.push('/dashboard')}>Kembali ke Dashboard</span></span>
        </div> : <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-3 flex flex-col gap-8">
                <Container>
                    <div className="flex gap-4 justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 bg-blue-200 rounded-full flex justify-center items-center">
                                <User size={32} className="text-blue-500" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-semibold">{component.userData[0]?.name}</span>
                                <div className="flex gap-2 text-xs mt-1 items-center">
                                    <Phone size={12}/> 
                                    <span className="">{component.userData[0]?.phone}</span>
                                </div>
                                <div className="flex gap-2 text-xs mt-1 items-center">
                                    <MapPin size={12}/> 
                                    <span>{component.userData[0]?.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <DotsThreeVertical size={24} className="cursor-pointer" onClick={() => component.setShowContextMenu(!component.showContextMenu)}/>
                            {component.showContextMenu ? <div className="w-36 bg-white absolute -top-0 right-0 mt-8 flex flex-col">
                                <button className="w-full p-2 hover:bg-gray-100" onClick={() => {component.setShowEditUserPopup(true); component.setShowContextMenu(false)}}>Edit Warga</button>
                                <button className="w-full p-2 hover:bg-gray-100 text-red-500" onClick={() => deleteUserHandler(component.userData[0].user_id)}>Hapus Warga</button>
                            </div> : null}
                        </div>
                    </div>
                </Container>
                <Container>
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-semibold">Riwayat Iuran</h1>
                        <input type="month" className="[&::-webkit-datetime-edit]:text-sm [&::-webkit-calendar-picker-indicator]:invert-[1] p-2 bg-blue-500 rounded-md text-white outline-none" name="filter_fee_history" defaultValue={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`} onChange={dateHistoryFilterHandler}/>
                    </div>
                    <div className="flex gap-2 my-4">
                        <ChoiceChip label="Semua" active={component.filterStatusIndex === 0} onClick={() => {component.setFilterStatusIndex(0); StatusFilteredDataHandler(component.userData[0].user_id, 'Semua')}}/>
                        <ChoiceChip label="Lunas" active={component.filterStatusIndex === 1} onClick={() => {component.setFilterStatusIndex(1); StatusFilteredDataHandler(component.userData[0].user_id, 'done')}}/>
                        <ChoiceChip label="Belum Lunas" active={component.filterStatusIndex === 2} onClick={() => {component.setFilterStatusIndex(2); StatusFilteredDataHandler(component.userData[0].user_id, 'undone')}}/>
                    </div>
                    <div className="flex flex-col-reverse gap-2 mt-4">
                        {Object.keys(groupData).map((year: string, index: number) => {
                            return <div key={index} className="flex flex-col gap-2">
                                <h1 className="font-semibold text-lg my-2 text-gray-500">{year}</h1>
                                {groupData[year].map((item: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}, index: number) => {
                                    return <FeeListItem key={index} month={item.fees.fee_date!} onClick={() => {component.setSelectedPaymentID(item.payments.payment_id); component.setShowPaymentPopup(true)}}/>
                                })}
                            </div>
                        })}
                    </div>
                </Container>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
                <Container>
                    <h1 className="font-semibold text-lg">Iuran Belum Lunas</h1>
                    <div className="w-full flex justify-center items-center mt-4 gap-1">
                        {totalUndoneAmount !== 0 ? <span className="font-bold text-3xl">{numberFormatter(totalUndoneAmount.toString())}</span> : <span className="text-sm italic text-gray-500 my-4">Semua iuran sudah lunas.</span>}
                    </div>
                    {component.undonePayments.length ? <div className="mt-8 flex flex-col gap-4">
                        {component.undonePayments.map((item: {fees: schema.feesType, payments: schema.paymentsType, user_id: number, name: string, address: string, phone: string, rt: string}, index: number) => {
                            return <UnpaidTransaction key={index} month={item.fees.fee_date!} status="Belum Lunas" onClick={() => {component.setSelectedPaymentID(item.payments.payment_id); component.setShowPaymentPopup(true)}}/>
                        })}
                    </div> : null}
                </Container>
                <Container>
                    <div className="flex justify-between items-center">
                        <h1 className="font-semibold text-lg">Iuran Jangka Panjang</h1>
                        {component.monthList.length ? <Trash size={24} className="text-red-500" onClick={resetDate}/> : null}
                    </div>
                    <div className="w-full h-fit flex gap-2 flex-wrap mt-4">
                        {component.monthList.map((item: string, index: number) => {
                            return <LongFeeChip key={index} item={item}/>
                        })}
                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-full flex justify-center items-center gap-2" onClick={add_month}>
                            <Plus/>
                            <span>Tambah Bulan</span>
                        </button>
                    </div>
                    {component.monthList.length ? <button className="bg-blue-500 p-3 text-white rounded-lg mt-8 w-full" onClick={() => setMultipleFeesHandler(component.userData[0].user_id, component.monthList)}>Tandai Lunas</button> : null}
                </Container>
            </div>
        </div>}
        {component.showEditUserPopup ? <EditUserPopup popupHandler={component.setShowEditUserPopup} data={{user_id: component.userData[0].user_id, name: component.userData[0].name, phone: component.userData[0].phone, address: component.userData[0].address, rt: component.userData[0].rt}} refresh={refresh}/> : null}
        {component.showPaymentPopup ? <PaymentPopup popupHandler={component.setShowPaymentPopup} payment_id={component.selectedPaymentID} refresh={refresh}/> : null}
    </NavigationBar> : null;
}

export default function Page(){
    return <Suspense fallback={<LoadingAnimation/>}>
        <DetailWarga/>
    </Suspense>
}