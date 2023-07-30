import { Api } from "./Api"

type StorageOwner = {
    id: number,
    email: string
}

export type StoragePath = {
    id: number,
    name: string,
}
export type Storage = {
    id: number,
    name: string,
    size: number,
    extension: string | null,
    type: string,
    is_protected: boolean,
    owner: StorageOwner
}

export type OneStorage = Storage & {
    description: string,
    created_at: Date
}

export type StorageModification = {
    date: Date,
    action: string,
    owner: StorageOwner
}

export type StorageShare = {
    id: number,
    date: Date,
    status: string,
    to_user: string 
}

export interface ApiToggleTrashStorage extends Api {
    action: string
}

export interface ApiToggleFavoriteStorage extends Api {
    action: string
}

export interface ApiCreateStorage extends Api {
    storage?: Storage
}

export interface ApiGetMyStorages extends Api {
    storages: Storage[]
}

export interface ApiGetOneStorage extends Api {
    storage: OneStorage,
    modifications: StorageModification[],
    file_body?: string
}

export interface ApiGetStorageShares extends Api {
    storage_shares: StorageShare[]
}