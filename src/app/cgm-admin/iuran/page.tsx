'use client';
import * as schema from '@/database/schema';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { create } from 'zustand';
import * as dateConvert from '@/lib/date-converter';
import DropDown from '@/components/dropdown';
import DropDownItem from '@/components/dropdown-item';
import Card from '@/components/card';
import { HandCoins, Users } from '@phosphor-icons/react';
import Container from '@/components/container';
import ChoiceChip from '@/components/choice-chip';
import SearchField from '@/components/search-field';
import TableHead from '@/components/table-head';
import UserListFeeItem from '@/components/user-list-fee-item';
import PaginationWidget from '@/components/pagination';
import SetFeePopup from '@/components/set-fee-popup';
import FeeListItem from '@/components/fee-list-item';
import UserActivityList from '@/components/user-activity-list';
import NavigationBar from '@/components/navigation-bar';
import LoadingAnimation from '@/components/loading-animation';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentPopup from '@/components/payment-popup';

interface ComponentState {
    selectedContext: string;
    showContextMenu: boolean;
    filterStatusIndex: number;
    showSetFeePopup: boolean;
    searchKeyword: string;
    currentMonthData: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] | null;
    usersList: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[];
    userListPagination: number;
    feeList: schema.feesType[];
    feeListPagination: number;
    feesCount: number;
    paymentHistoryList: {payments: schema.paymentsType, users: schema.usersType}[];
    paymentHistoryPagination: number;
    paymentHistoryCount: number;
    showPaymentPopup: boolean,
    selectedPaymentID: number,
    setSelectedContext: (selectedContext: string) => void;
    setShowContextMenu: (showContextMenu: boolean) => void;
    setFilterStatusIndex: (filterStatusIndex: number) => void;
    setShowSetFeePopup: (showSetFeePopup: boolean) => void;
    setSearchKeyword: (searchKeyword: string) => void;
    setCurrentMonthData: (currentMonthData: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => void;
    setUsersList: (usersList: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => void;
    setUserListPagination: (userListPagination: number) => void;
    setFeeList: (feeList: schema.feesType[]) => void;
    setFeeListPagination: (feeListPagination: number) => void;
    setFeesCount: (feesCount: number) => void;
    setPaymentHistoryList: (paymentHistoryList: {payments: schema.paymentsType, users: schema.usersType}[]) => void;
    setPaymentHistoryPagination: (paymentHistoryPagination: number) => void;
    setPaymentHistoryCount: (paymentHistoryCount: number) => void;
    setShowPaymentPopup: (data: boolean) => void,
    setSelectedPaymentID: (data: number) => void
}

const useComponent = create<ComponentState>((set) => {
    return {
        selectedContext: 'Semua RT',
        showContextMenu: false,
        filterStatusIndex: 0,
        showSetFeePopup: false,
        searchKeyword: '',
        currentMonthData: null,
        usersList: [],
        userListPagination: 1,
        feeList: [],
        feeListPagination: 1,
        feesCount: 0,
        paymentHistoryList: [],
        paymentHistoryPagination: 1,
        paymentHistoryCount: 0,
        showPaymentPopup: false,
        selectedPaymentID: 0,
        setSelectedContext: (selectedContext: string) => set({selectedContext}),
        setShowContextMenu: (showContextMenu: boolean) => set({showContextMenu}),
        setFilterStatusIndex: (filterStatusIndex: number) => set({filterStatusIndex}),
        setShowSetFeePopup: (showSetFeePopup: boolean) => set({showSetFeePopup}),
        setSearchKeyword: (searchKeyword: string) => set({searchKeyword}),
        setCurrentMonthData: (currentMonthData: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => set({currentMonthData}),
        setUsersList: (usersList: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => set({usersList}),
        setUserListPagination: (userListPagination: number) => set({userListPagination}),
        setFeeList: (feeList: schema.feesType[]) => set({feeList}),
        setFeeListPagination: (feeListPagination: number) => set({feeListPagination}),
        setFeesCount: (feesCount: number) => set({feesCount}),
        setPaymentHistoryList: (paymentHistoryList: {payments: schema.paymentsType, users: schema.usersType}[]) => set({paymentHistoryList}),
        setPaymentHistoryPagination: (paymentHistoryPagination: number) => set({paymentHistoryPagination}),
        setPaymentHistoryCount: (paymentHistoryCount: number) => set({paymentHistoryCount}),
        setShowPaymentPopup: (data) => set(() => ({ showPaymentPopup: data })),
        setSelectedPaymentID: (data) => set(() => ({ selectedPaymentID: data }))
    }
})

function Iuran() {
    const component = useComponent();
    const searchParams = useSearchParams();
    const route = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCurrentMonthFee = useCallback(async (fee_id: number, pagination: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}&page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data, users } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[], users: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setCurrentMonthData(data);
                    component.setUsersList(users);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [])

    const currentMonthFeeAPI = useCallback(async (pagination: number) => {        
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?month=${currentMonth}&year=${currentYear}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: schema.feesType[] };
                    if(data.length > 0){
                        getCurrentMonthFee(data[0].fee_id, pagination);
                    };

                    component.setCurrentMonthData([])
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [getCurrentMonthFee]);

    const getRTFilteredCurrentMonthFee = useCallback(async (fee_id: number, filter: string, pagination: number) => {
        if(filter === 'Semua RT') return getCurrentMonthFee(fee_id, pagination);

        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}&filter=${filter}&page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data, users } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[], users: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setCurrentMonthData(data);
                    component.setUsersList(users);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [getCurrentMonthFee])

    const getStatusFilteredCurrentMonthFee = useCallback(async (fee_id: number, status: string, pagination: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}&status=${status}&page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { users } = res.data as { users: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setUsersList(users);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [])

    const getFilteredCurrentMonthFee = useCallback(async (fee_id: number, filter: string, status: string, pagination: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}&filter=${filter}&status=${status}&page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setUsersList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [])

    const getAllFees = useCallback(async (pagination: number) => {    
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data, count } = res.data as { data: schema.feesType[], count: number };
                    component.setFeeList(data);
                    component.setFeesCount(count);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [])

    const getFeeByMonth = useCallback(async (month: string, year: string) => {        
        if(month === '' || year === '') return getAllFees(component.feeListPagination);
        
        return await axios.get(`${process.env.API_URL}/admin/fees?month=${month}&year=${year}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: schema.feesType[] };
                    component.setFeeList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
    }, [getAllFees]);

    const getActivityHistory = useCallback(async (pagination: number) => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees/history?page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data, count } = res.data as { data: {payments: schema.paymentsType, users: schema.usersType}[], count: number };
                    component.setPaymentHistoryList(data);
                    component.setPaymentHistoryCount(count);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [])

    const searchUser = useCallback(async (fee_id: number, keyword: string) => {
        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}&search=${keyword}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setUsersList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
    }, [])

    const searchUserWithRT = useCallback(async (fee_id: number, filter: string, keyword: string) => {
        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}&filter=${filter}&search=${keyword}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setUsersList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.error(message);
            })
    }, [])

    const totalDoneAmount = component.currentMonthData? component.currentMonthData.reduce((accumulator, currentValue) => {
        if (currentValue.payments.payment_description === "done") {
            return accumulator + 1;
        }
        return accumulator;
    }, 0) : 0;

    const totalPendingAmount = component.currentMonthData? component.currentMonthData.reduce((accumulator, currentValue) => {
        if (currentValue.payments.payment_description === "pending") {
            return accumulator + 1;
        }
        return accumulator;
    }, 0) : 0;

    const totalUndoneAmount = component.currentMonthData? component.currentMonthData.reduce((accumulator, currentValue) => {
        if (currentValue.payments.payment_description === "undone") {
            return accumulator + 1;
        }
        return accumulator;
    }, 0) : 0;

    const filterRTHandler = (fee_id: number, filter: string, pagination: number) => getRTFilteredCurrentMonthFee(fee_id, filter, pagination);
    const userListPaginationHandler = (pagination: number) => {
        if(component.filterStatusIndex !== 0){
            if(component.filterStatusIndex === 1){
                return getStatusFilteredCurrentMonthFee(component.currentMonthData![0].fees.fee_id, 'done', pagination);
            } else {
                return getStatusFilteredCurrentMonthFee(component.currentMonthData![0].fees.fee_id, 'undone', pagination);
            }
        }

        getCurrentMonthFee(component.currentMonthData![0].fees.fee_id, pagination);
    };
    const feeListPaginationHandler = (pagination: number) => getAllFees(pagination);
    const dateFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => getFeeByMonth(e.currentTarget.value.split('-')[1], e.currentTarget.value.split('-')[0]);
    const paymentHistoryPaginationHandler = (pagination: number) => getActivityHistory(pagination);
    const filterCurrentMonthFeeHandler = (fee_id: number, filter: string, status: string, pagination: number) => {
        let filterContext = '';
        if(filter === 'RT 001') filterContext = '1';
        if(filter === 'RT 002') filterContext = '2';
        if(filter === 'RT 003') filterContext = '3';
        if(filter === 'RT 004') filterContext = '4';

        if(filter === 'Semua RT' && status === 'Semua'){
            return getCurrentMonthFee(fee_id, pagination);
        } else if(filter !== 'Semua RT' && status === 'Semua'){
            return getRTFilteredCurrentMonthFee(fee_id, filterContext, pagination);
        } else if(filter === 'Semua RT' && status !== 'Semua'){
            return getStatusFilteredCurrentMonthFee(fee_id, status, pagination);
        } else {
            return getFilteredCurrentMonthFee(fee_id, filterContext, status, pagination);
        }
    };
    const searchUserHandler = (fee_id: number, filter: string, keyword: string) => {
        component.setFilterStatusIndex(0);

        let filterContext = '';
        if(filter === 'RT 001') filterContext = '1';
        if(filter === 'RT 002') filterContext = '2';
        if(filter === 'RT 003') filterContext = '3';
        if(filter === 'RT 004') filterContext = '4';

        if(keyword === '') return filterRTHandler(fee_id, filterContext, component.userListPagination);

        if(filter === 'Semua RT') return searchUser(fee_id, keyword);

        return searchUserWithRT(fee_id, filterContext, keyword);
    }

    const refresh = useCallback(() => {
        const fee_id = searchParams.get('fee_id');
        if(!fee_id){
            currentMonthFeeAPI(component.userListPagination);
        } else {
            getCurrentMonthFee(parseInt(fee_id), component.userListPagination);
        }
        getAllFees(component.feeListPagination);
        getActivityHistory(component.paymentHistoryPagination);

        // reset all state
        component.setFilterStatusIndex(0);
        component.setSelectedContext('Semua RT');
    }, [searchParams, getCurrentMonthFee, currentMonthFeeAPI, getAllFees, getActivityHistory, component.userListPagination, component.feeListPagination, component.paymentHistoryPagination])

    useEffect(() => {
        refresh();
    }, [refresh]);
    
    return isLoading ? <LoadingAnimation/> : component.currentMonthData ? <NavigationBar sidebarIndex={1}>
        {!component.currentMonthData.length ? <div className="w-full h-screen flex flex-col gap-8 justify-center items-center">
            <span>Iuran bulan {dateConvert.toString(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`)} belum anda atur. <span className="underline cursor-pointer" onClick={() => component.setShowSetFeePopup(true)}>Atur sekarang</span></span>
        </div> : <>
            <div className="mt-8 flex justify-between items-center">
                <div>
                    <span className="text-xs">Iuran Bulan</span>
                    <h1 className="font-semibold text-xl md:text-2xl">{dateConvert.toString(component.currentMonthData[0].fees.fee_date!)}</h1>
                </div>
                <div className="relative">
                    <DropDown label={component.selectedContext} onClick={() => component.setShowContextMenu(!component.showContextMenu)}/>
                    {component.showContextMenu ? <div className="w-full absolute mt-2 flex flex-col justify-center items-center">
                        <DropDownItem label="Semua RT" onClick={() => {component.setSelectedContext('Semua RT'); component.setShowContextMenu(false); filterRTHandler(component.currentMonthData![0].fees.fee_id, 'Semua RT', component.userListPagination); component.setFilterStatusIndex(0);}}/>
                        <DropDownItem label="RT 001" onClick={() => {component.setSelectedContext('RT 001'); component.setShowContextMenu(false); filterRTHandler(component.currentMonthData![0].fees.fee_id, '1', component.userListPagination); component.setFilterStatusIndex(0);}}/>
                        <DropDownItem label="RT 002" onClick={() => {component.setSelectedContext('RT 002'); component.setShowContextMenu(false); filterRTHandler(component.currentMonthData![0].fees.fee_id, '2', component.userListPagination); component.setFilterStatusIndex(0);}}/>
                        <DropDownItem label="RT 003" onClick={() => {component.setSelectedContext('RT 003'); component.setShowContextMenu(false); filterRTHandler(component.currentMonthData![0].fees.fee_id, '3', component.userListPagination); component.setFilterStatusIndex(0);}}/>
                        <DropDownItem label="RT 004" onClick={() => {component.setSelectedContext('RT 004'); component.setShowContextMenu(false); filterRTHandler(component.currentMonthData![0].fees.fee_id, '4', component.userListPagination); component.setFilterStatusIndex(0);}}/>
                    </div> : null}
                </div>
            </div>
            <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <Card color="blue" title="Jumlah Warga" total={component.currentMonthData.length} nominal={component.currentMonthData.length * component.currentMonthData[0].fees.fee_amount!} icon={<Users/>}/>
                <Card color="green" title="Sudah Lunas" total={totalDoneAmount} nominal={totalDoneAmount * component.currentMonthData[0].fees.fee_amount!} icon={<HandCoins/>}/>
                <Card color="yellow" title="Menunggu Konfirmasi" total={totalPendingAmount} nominal={totalPendingAmount * component.currentMonthData[0].fees.fee_amount!} icon={<HandCoins/>}/>
                <Card color="red" title="Belum Lunas" total={totalUndoneAmount} nominal={totalUndoneAmount * component.currentMonthData[0].fees.fee_amount!} icon={<HandCoins/>}/>
            </div>
            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="col-span-1 md:col-span-3 flex flex-col gap-8">
                    <Container>
                        <div className="w-full flex-col-reverse md:flex-row flex justify-between items-start md:items-center gap-4">
                            <div className="flex gap-2">
                                <ChoiceChip label="Semua" active={component.filterStatusIndex === 0} onClick={() => {component.setFilterStatusIndex(0); filterCurrentMonthFeeHandler(component.currentMonthData![0].fees.fee_id, component.selectedContext, 'Semua', component.userListPagination)}}/>
                                <ChoiceChip label="Lunas" active={component.filterStatusIndex === 1} onClick={() => {component.setFilterStatusIndex(1); filterCurrentMonthFeeHandler(component.currentMonthData![0].fees.fee_id, component.selectedContext, 'done', component.userListPagination)}}/>
                                <ChoiceChip label="Belum Lunas" active={component.filterStatusIndex === 2} onClick={() => {component.setFilterStatusIndex(2); filterCurrentMonthFeeHandler(component.currentMonthData![0].fees.fee_id, component.selectedContext, 'undone', component.userListPagination)}}/>
                            </div>
                            <SearchField value={component.searchKeyword} setValue={component.setSearchKeyword} onChange={() => searchUserHandler(component.currentMonthData![0].fees.fee_id, component.selectedContext, component.searchKeyword)}/>
                        </div>
                        <div className="mt-8">
                            {component.usersList.length ? <table className="w-full">
                                <TableHead title={['Nama', 'Alamat', 'Status']}/>
                                <tbody>
                                    {component.usersList.map((data) => {
                                        return <UserListFeeItem key={data.users.user_id} name={data.users.name!} address={data.users.address!} status={data.payments.payment_description!} onClick={() => {component.setSelectedPaymentID(data.payments.payment_id); component.setShowPaymentPopup(true)}}/>
                                    })}
                                </tbody>
                            </table> : <span className='w-full block text-sm italic text-center'>Data tidak ditemukan</span>}
                        </div>
                        {component.filterStatusIndex === 0 ? <PaginationWidget currentPage={component.userListPagination} totalPage={Math.ceil(component.currentMonthData.length / 20)} onClickNext={() => {if(component.userListPagination >= Math.ceil(component.currentMonthData!.length / 20)) return; component.setUserListPagination(component.userListPagination + 1); userListPaginationHandler(component.userListPagination + 1)}} onClickPrev={() => {if(component.userListPagination <= 1) return; component.setUserListPagination(component.userListPagination - 1); userListPaginationHandler(component.userListPagination - 1)}}/> : null}
                    </Container>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
                    <Container>
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Rekapan Iuran Bulanan</h1>
                            <input type="month" name="month" id="month" onChange={dateFilterHandler} className="bg-blue-500 text-white [&::-webkit-calendar-picker-indicator]:invert-[1] outline-none p-2 rounded-md [&::-webkit-datetime-edit]:text-sm" defaultValue={`${new Date().getFullYear()}-${new Date().getMonth() + 1}`}/>
                        </div>
                        <div className="mt-8 flex flex-col gap-4">
                            {component.feeList.map((fee: schema.feesType) => {
                                return <FeeListItem key={fee.fee_id} month={fee.fee_date!} onClick={() => route.push(`/cgm-admin/iuran?fee_id=${fee.fee_id}`)}/>
                            })}
                        </div>
                        <PaginationWidget currentPage={component.feeListPagination} totalPage={Math.ceil(component.feesCount / 10)} onClickNext={() => {if(component.feeListPagination >= Math.ceil(component.feesCount / 10)) return; component.setFeeListPagination(component.feeListPagination + 1); feeListPaginationHandler(component.feeListPagination + 1)}} onClickPrev={() => {if(component.feeListPagination <= 1) return; component.setFeeListPagination(component.feeListPagination - 1); feeListPaginationHandler(component.feeListPagination - 1)}}/>
                    </Container>
                    <Container>
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Aktivitas Terbaru</h1>
                        </div>
                        <div className="mt-8 flex flex-col gap-4">
                            {component.paymentHistoryList.map((history: {payments: schema.paymentsType, users: schema.usersType}) => {
                                return <UserActivityList key={history.payments.payment_id} month={history.payments.last_update!} name={history.users.name!} phone={history.users.phone!} status={history.payments.payment_description!} onClick={() => {component.setSelectedPaymentID(history.payments.payment_id); component.setShowPaymentPopup(true)}}/>
                            })}
                        </div>
                        <PaginationWidget currentPage={component.paymentHistoryPagination} totalPage={Math.ceil(component.paymentHistoryCount / 5)} onClickNext={() => {if(component.paymentHistoryPagination >= Math.ceil(component.paymentHistoryCount / 5)) return; component.setPaymentHistoryPagination(component.paymentHistoryPagination + 1); paymentHistoryPaginationHandler(component.paymentHistoryPagination + 1)}} onClickPrev={() => {if(component.paymentHistoryPagination <= 1) return; component.setPaymentHistoryPagination(component.paymentHistoryPagination - 1); paymentHistoryPaginationHandler(component.paymentHistoryPagination - 1)}}/>
                    </Container>
                </div>
            </div>
        </>}
        {component.showSetFeePopup ? <SetFeePopup popupHandler={component.setShowSetFeePopup} refresh={refresh}/> : null}
        {component.showPaymentPopup ? <PaymentPopup popupHandler={component.setShowPaymentPopup} payment_id={component.selectedPaymentID} refresh={refresh}/> : null}
    </NavigationBar> : null;
}

export default function Page(){
    return <Suspense fallback={<LoadingAnimation/>}>
        <Iuran/>
    </Suspense>
}