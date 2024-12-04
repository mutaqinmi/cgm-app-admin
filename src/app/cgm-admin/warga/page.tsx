'use client';
import Container from "@/components/container";
import IconButton from "@/components/icon-button";
import NavigationBar from "@/components/navigation-bar";
import PaginationWidget from "@/components/pagination";
import SearchField from "@/components/search-field";
import TableHead from "@/components/table-head";
import UserListItem from "@/components/user-list-item";
import VerticalDivider from "@/components/vertical-divider";
import { Plus } from "@phosphor-icons/react";
import { create } from "zustand";
import * as schema from '@/database/schema';
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import LoadingAnimation from "@/components/loading-animation";
import AddUserPopup from "@/components/add-user-popup";
import { useRouter } from "next/navigation";

interface ComponentState {
    searchKeyword: string;
    usersList: schema.usersType[],
    userCount: number,
    userListPagination: number,
    showAddUserPopup: boolean,
    setSearchKeyword: (value: string) => void,
    setUsersList: (value: schema.usersType[]) => void,
    setUserCount: (value: number) => void,
    setUserListPagination: (value: number) => void,
    setShowAddUserPopup: (value: boolean) => void,
}

const useComponent = create<ComponentState>((set) => {
    return {
        searchKeyword: '',
        usersList: [],
        userCount: 0,
        userListPagination: 1,
        showAddUserPopup: false,
        setSearchKeyword: (value) => set({ searchKeyword: value }),
        setUsersList: (value) => set({ usersList: value }),
        setUserCount: (value) => set({ userCount: value }),
        setUserListPagination: (value) => set({ userListPagination: value }),
        setShowAddUserPopup: (value) => set({ showAddUserPopup: value }),
    }
});

export default function Page() {
    const component = useComponent();
    const route = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            .finally(() => setIsLoading(false));
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
    }, [getAllUsers])

    const userListPaginationHandler = (pagination: number) => getAllUsers(pagination);
    const searchUserHandler = (keyword: string) => searchUser(keyword);

    const refresh = useCallback(() => {
        getAllUsers(component.userListPagination);
    }, [getAllUsers]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return isLoading ? <LoadingAnimation/> : <NavigationBar sidebarIndex={2}>
        <div className="mt-8 w-full">
            <Container>
                <div className="flex-col gap-4 md:gap-0 md:flex-row flex justify-between items-start md:items-center">
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
                            {component.usersList.map((user) => {
                                return <UserListItem key={user.user_id} name={user.name!} phone={user.phone!} address={user.address!} rt={user.rt!} onClick={() => route.push(`/cgm-admin/warga/detail?user_id=${user.user_id}`)}/>
                            })}
                        </tbody>
                    </table>
                </div>
                {component.searchKeyword === '' ? <PaginationWidget currentPage={component.userListPagination} totalPage={Math.ceil(component.userCount / 10)}  onClickNext={() => {if(component.userListPagination >= Math.ceil(component.userCount / 10)) return; component.setUserListPagination(component.userListPagination + 1); userListPaginationHandler(component.userListPagination + 1)}} onClickPrev={() => {if(component.userListPagination <= 1) return; component.setUserListPagination(component.userListPagination - 1); userListPaginationHandler(component.userListPagination - 1)}}/> : null}
            </Container>
        </div>
        {component.showAddUserPopup ? <AddUserPopup popupHandler={component.setShowAddUserPopup} refresh={refresh}/> : null}
    </NavigationBar>
}