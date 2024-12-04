'use client';
import Card from '@/components/card';
import Container from '@/components/container';
import * as schema from '@/database/schema';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { create } from 'zustand';
import * as dateConvert from '@/lib/date-converter';
import { HandCoins, Plus, Users } from '@phosphor-icons/react';
import SearchField from '@/components/search-field';
import VerticalDivider from '@/components/vertical-divider';
import IconButton from '@/components/icon-button';
import TableHead from '@/components/table-head';
import UserListItem from '@/components/user-list-item';
import PaginationWidget from '@/components/pagination';
import Chart from '@/components/chart';
import FeeListItem from '@/components/fee-list-item';
import UserActivityList from '@/components/user-activity-list';
import SetFeePopup from '@/components/set-fee-popup';
import AddUserPopup from '@/components/add-user-popup';
import NavigationBar from '@/components/navigation-bar';
import { useRouter } from 'next/navigation';
import PaymentPopup from '@/components/payment-popup';
import LoadingAnimation from '@/components/loading-animation';

interface ComponentState {
    currentMonthData: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] | null,
    usersList: schema.usersType[],
    userListPagination: number,
    userCount: number,
    searchKeyword: string,
    feeList: schema.feesType[],
    feeListPagination: number,
    feesCount: number,
    paymentHistoryList: {payments: schema.paymentsType, users: schema.usersType}[],
    paymentHistoryPagination: number,
    paymentHistoryCount: number,
    chartData: { month: string, done: number, undone: number }[],
    showSetFeePopup: boolean,
    showAddUserPopup: boolean,
    showPaymentPopup: boolean,
    selectedPaymentID: number,
    setCurrentMonthData: (data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[]) => void,
    setUsersList: (data: schema.usersType[]) => void,
    setUserListPagination: (data: number) => void,
    setUserCount: (data: number) => void,
    setSearchKeyword: (data: string) => void,
    setFeeList: (data: schema.feesType[]) => void,
    setFeeListPagination: (data: number) => void,
    setFeesCount: (data: number) => void,
    setPaymentHistoryList: (data: {payments: schema.paymentsType, users: schema.usersType}[]) => void,
    setPaymentHistoryPagination: (data: number) => void,
    setPaymentHistoryCount: (data: number) => void,
    setChartData: (data: { month: string, done: number, undone: number }[]) => void,
    setShowSetFeePopup: (data: boolean) => void,
    setShowAddUserPopup: (data: boolean) => void,
    setShowPaymentPopup: (data: boolean) => void,
    setSelectedPaymentID: (data: number) => void
}

const useComponent = create<ComponentState>((set) => {
    return {
        currentMonthData: null,
        usersList: [],
        userListPagination: 1,
        userCount: 0,
        searchKeyword: '',
        feeList: [],
        feeListPagination: 1,
        feesCount: 0,
        paymentHistoryList: [],
        paymentHistoryPagination: 1,
        paymentHistoryCount: 0,
        chartData: [],
        showSetFeePopup: false,
        showAddUserPopup: false,
        showPaymentPopup: false,
        selectedPaymentID: 0,
        setCurrentMonthData: (data) => set(() => ({ currentMonthData: data })),
        setUsersList: (data) => set(() => ({ usersList: data })),
        setUserListPagination: (data) => set(() => ({ userListPagination: data })),
        setUserCount: (data) => set(() => ({ userCount: data })),
        setSearchKeyword: (data) => set(() => ({ searchKeyword: data })),
        setFeeList: (data) => set(() => ({ feeList: data })),
        setFeeListPagination: (data) => set(() => ({ feeListPagination: data })),
        setFeesCount: (data) => set(() => ({ feesCount: data })),
        setPaymentHistoryList: (data) => set(() => ({ paymentHistoryList: data })),
        setPaymentHistoryPagination: (data) => set(() => ({ paymentHistoryPagination: data })),
        setPaymentHistoryCount: (data) => set(() => ({ paymentHistoryCount: data })),
        setChartData: (data) => set(() => ({ chartData: data })),
        setShowSetFeePopup: (data) => set(() => ({ showSetFeePopup: data })),
        setShowAddUserPopup: (data) => set(() => ({ showAddUserPopup: data })),
        setShowPaymentPopup: (data) => set(() => ({ showPaymentPopup: data })),
        setSelectedPaymentID: (data) => set(() => ({ selectedPaymentID: data }))
    }
})

export default function Page() {
    const component = useComponent();
    const route = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getCurrentMonthFee = useCallback(async (fee_id: number) => {
        return await axios.get(`${process.env.API_URL}/admin/fees?fee_id=${fee_id}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: {fees: schema.feesType, payments: schema.paymentsType, users: schema.usersType}[] };
                    component.setCurrentMonthData(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
    }, []);

    const currentMonthFeeAPI = useCallback(async () => {
        setIsLoading(true);

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        return await axios.get(`${process.env.API_URL}/admin/fees?month=${currentMonth}&year=${currentYear}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: schema.feesType[] };
                    if(data.length > 0){
                        getCurrentMonthFee(data[0].fee_id);
                    }

                    component.setCurrentMonthData([]);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
            .finally(() => setIsLoading(false))
    }, [getCurrentMonthFee]);

    const getAllUsers = useCallback(async (pagination: number) => {     
        setIsLoading(true);
        
        return await axios.get(`${process.env.API_URL}/admin/users?page=${pagination}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data, count } = res.data as { data: schema.usersType[], count: number };
                    component.setUsersList(data);
                    component.setUserCount(count);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
            .finally(() => setIsLoading(false))
    }, [])

    const searchUser = useCallback(async (keyword: string) => {        
        return await axios.get(`${process.env.API_URL}/admin/users?search=${keyword}`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: schema.usersType[] };
                    component.setUsersList(data);
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
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
                console.log(message);
            })
            .finally(() => setIsLoading(false))
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
                console.log(message);
            })
    }, []);

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
                console.log(message);
            })
            .finally(() => setIsLoading(false))
    }, [])

    const getChartData = useCallback(async () => {
        setIsLoading(true);

        return await axios.get(`${process.env.API_URL}/admin/fees?chart_data=true`)
            .then((res: AxiosResponse) => {
                if(res.status === 200){
                    const { data } = res.data as { data: { month: string, done: number, undone: number }[] };
                    component.setChartData(Object.values(data));
                }
            })
            .catch((error: AxiosError) => {
                const { message } = error.response?.data as { message: string };
                console.log(message);
            })
            .finally(() => setIsLoading(false))
    }, [])

    const totalDoneAmount = component.currentMonthData ? component.currentMonthData.reduce((accumulator, currentValue) => {
        if (currentValue.payments.payment_description === "done") {
            return accumulator + 1;
        }
        return accumulator;
    }, 0) : 0;

    const totalPendingAmount = component.currentMonthData ? component.currentMonthData.reduce((accumulator, currentValue) => {
        if (currentValue.payments.payment_description === "pending") {
            return accumulator + 1;
        }
        return accumulator;
    }, 0) : 0;

    const totalUndoneAmount = component.currentMonthData ? component.currentMonthData.reduce((accumulator, currentValue) => {
        if (currentValue.payments.payment_description === "undone") {
            return accumulator + 1;
        }
        return accumulator;
    }, 0) : 0;

    const userListPaginationHandler = (pagination: number) => getAllUsers(pagination);
    const searchUserHandler = (keyword: string) => searchUser(keyword);
    const feeListPaginationHandler = (pagination: number) => getAllFees(pagination);
    const dateFilterHandler = (e: React.ChangeEvent<HTMLInputElement>) => getFeeByMonth(e.currentTarget.value.split('-')[1], e.currentTarget.value.split('-')[0]);
    const paymentHistoryPaginationHandler = (pagination: number) => getActivityHistory(pagination);

    const refresh = useCallback(() => {
        currentMonthFeeAPI();
        getAllUsers(component.userListPagination);
        getAllFees(component.feeListPagination);
        getActivityHistory(component.paymentHistoryPagination);
        getChartData();
    }, [currentMonthFeeAPI, getAllUsers, getAllFees, getActivityHistory, getChartData, component.feeListPagination, component.paymentHistoryPagination, component.userListPagination])

    useEffect(() => refresh(), [refresh]);

    return isLoading ? <LoadingAnimation/> : <NavigationBar sidebarIndex={0}>
        {component.currentMonthData ? component.currentMonthData.length ? <>
            <div className="mt-8">
                <h1 className="font-semibold text-lg">Iuran Bulan Ini</h1>
            </div>
            <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <Card color="blue" title="Jumlah Warga" total={component.currentMonthData.length} nominal={component.currentMonthData.length * component.currentMonthData[0].fees.fee_amount!} icon={<Users/>}/>
                <Card color="green" title="Sudah Lunas" total={totalDoneAmount} nominal={totalDoneAmount * component.currentMonthData[0].fees.fee_amount!} icon={<HandCoins/>}/>
                <Card color="yellow" title="Menunggu Konfirmasi" total={totalPendingAmount} nominal={totalPendingAmount * component.currentMonthData[0].fees.fee_amount!} icon={<HandCoins/>}/>
                <Card color="red" title="Belum Lunas" total={totalUndoneAmount} nominal={totalUndoneAmount * component.currentMonthData[0].fees.fee_amount!} icon={<HandCoins/>}/>
            </div>
        </> : <span className="w-full p-4 bg-red-200 text-red-500 border border-red-500 mt-4 rounded-lg block text-center">Iuran bulan {dateConvert.toString(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`)} belum anda atur. <span className="underline cursor-pointer" onClick={() => component.setShowSetFeePopup(true)}>Atur sekarang</span></span> : null}
        <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="col-span-1 md:col-span-3 flex flex-col gap-8">
                <Container>
                    <div>
                        <h1 className="text-lg font-semibold">Grafik Pembayaran</h1>
                        <span className="text-sm">Menampilkan statistik selama 6 bulan terakhir.</span>
                    </div>
                    <div className="mt-8">
                        <Chart chartData={component.chartData.map((data) => {
                            return { month: dateConvert.toString(data.month), done: data.done, undone: data.undone }
                        })}/>
                    </div>
                </Container>
                <Container>
                    <div className="flex-col md:flex-row flex gap-4 justify-between items-start md:items-center">
                        <h1 className="text-lg font-semibold">Daftar Warga</h1>
                        <div className="flex gap-4 justify-center items-center">
                            <SearchField value={component.searchKeyword} setValue={component.setSearchKeyword} onChange={searchUserHandler}/>
                            <VerticalDivider/>
                            <IconButton icon={<Plus size={14}/>} onClick={() => component.setShowAddUserPopup(true)}/>
                        </div>
                    </div>
                    <div className="mt-8">
                        <table className="w-full">
                            <TableHead title={['Nama', 'No. Telepon', 'Alamat', 'RT']}/>
                            <tbody>
                                {component.usersList.map((user: schema.usersType) => {
                                    return <UserListItem key={user.user_id} name={user.name!} phone={user.phone!} address={user.address!} rt={user.rt!} onClick={() => route.push(`/cgm-admin/warga/detail?user_id=${user.user_id!}`)}/>
                                })}
                            </tbody>
                        </table>
                    </div>
                    {component.searchKeyword === '' ? <PaginationWidget currentPage={component.userListPagination} totalPage={Math.ceil(component.userCount / 10)} onClickNext={() => {if(component.userListPagination >= Math.ceil(component.userCount / 10)) return; component.setUserListPagination(component.userListPagination + 1); userListPaginationHandler(component.userListPagination + 1)}} onClickPrev={() => {if(component.userListPagination <= 1) return; component.setUserListPagination(component.userListPagination - 1); userListPaginationHandler(component.userListPagination - 1)}}/> : null}
                </Container>
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
                <Container>
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-semibold">Rekapan Iuran Bulanan</h1>
                        <input type="month" name="month" id="month" onChange={dateFilterHandler} className="bg-blue-500 text-white [&::-webkit-calendar-picker-indicator]:invert-[1] outline-none p-2 rounded-md [&::-webkit-datetime-edit]:text-sm" defaultValue={`${new Date().getFullYear()}-${new Date().getMonth() + 1}`}/>
                    </div>
                    <div className="mt-8 flex flex-col gap-4">
                        {component.feeList.length ? component.feeList.map((fee: schema.feesType) => {
                            return <FeeListItem key={fee.fee_id} month={fee.fee_date!} onClick={() => route.push(`/cgm-admin/iuran?fee_id=${fee.fee_id}`)}/>
                        }) : <span className='text-sm italic text-gray-500 text-center'>Rekapan iuran tidak ditemukan.</span>}
                    </div>
                    {component.feeList.length ? <PaginationWidget currentPage={component.feeListPagination} totalPage={Math.ceil(component.feesCount / 10)} onClickNext={() => {if(component.feeListPagination >= Math.ceil(component.feesCount / 10)) return; component.setFeeListPagination(component.feeListPagination + 1); feeListPaginationHandler(component.feeListPagination + 1)}} onClickPrev={() => {if(component.feeListPagination <= 1) return; component.setFeeListPagination(component.feeListPagination - 1); feeListPaginationHandler(component.feeListPagination - 1)}}/> : null}
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
        {component.showSetFeePopup ? <SetFeePopup popupHandler={component.setShowSetFeePopup} refresh={refresh}/> : null}
        {component.showAddUserPopup ? <AddUserPopup popupHandler={component.setShowAddUserPopup} refresh={refresh}/> : null}
        {component.showPaymentPopup ? <PaymentPopup popupHandler={component.setShowPaymentPopup} payment_id={component.selectedPaymentID} refresh={refresh}/> : null}
    </NavigationBar>
}