type UserReceiveShare = {
    id: number,
    name: string,
    email: string
}
 
export type UserEditor = {
    id: number,
    name: string,
    email: string
}
 

export type EventStorageSocketUserReceiveShare = {
    data: {
        from_user: UserReceiveShare,
        to_user: UserReceiveShare,
        share_id: number
    }
}