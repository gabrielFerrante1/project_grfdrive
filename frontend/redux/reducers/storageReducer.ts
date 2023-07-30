import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Storage, StoragePath } from '../../types/Storage';

type ModePage = 'bin' | 'home' | 'favorites' | 'shares' | 'docs_editor'
type RenameStorage = {
    storage: Storage | null,
    name: string | null
} 

const pathCurrent: StoragePath[] = [
    {
        id: 0,
        name: 'Meu Drive',
    },
]

const storageSelected: Storage[] = []

export const slice = createSlice({
    name: 'storage',
    initialState: {
        modePage: 'home' as ModePage,
        pathCurrent: pathCurrent,
        storageSelected: storageSelected,
        selectorAreaActive: false,
        reloadStorages: false,
        reloadBinStorages: false,
        reloadFavoriteStorages: false,
        storageDetails: false,

        //Actions
        openStorage: null as Storage | null,
        toggleTrashStorage: null as Storage | null,
        toggleFavoriteStorage: null as Storage | null,
        deleteStorage: null as Storage | null,
        renameStorage: {} as RenameStorage,
        protectStorage: null as Storage | null,
        storageAuthentication: null as Storage | null,
        shareStorage: null as Storage | null,
    },
    reducers: {
        setModePage: (state, action: PayloadAction<ModePage>) => {
            state.modePage = action.payload;
        },
        setPathCurrent: (state, action: PayloadAction<StoragePath[]>) => {
            state.pathCurrent = action.payload;
        },
        setStorageSelected: (state, action: PayloadAction<Storage[]>) => {
            state.storageSelected = action.payload;
        },
        setStorageSelectedToDefault: (state, action: PayloadAction<boolean>) => {
            state.storageSelected = storageSelected
        },
        setSelectorAreaActive: (state, action: PayloadAction<boolean>) => {
            state.selectorAreaActive = action.payload
        },
        setStorageDetails: (state, action: PayloadAction<boolean>) => {
            state.storageDetails = action.payload
        },
        setOpenStorage: (state, action: PayloadAction<Storage | null>) => {
            state.openStorage = action.payload
        },
        setToggleTrashStorage: (state, action: PayloadAction<Storage | null>) => {
            state.toggleTrashStorage = action.payload
        },
        setToggleFavoriteStorage: (state, action: PayloadAction<Storage | null>) => {
            state.toggleFavoriteStorage = action.payload
        },
        setDeleteStorage: (state, action: PayloadAction<Storage | null>) => {
            state.deleteStorage = action.payload
        },
        setReloadStorages: (state, action: PayloadAction<boolean>) => {
            state.reloadStorages = action.payload
        },
        setReloadBinStorages: (state, action: PayloadAction<boolean>) => {
            state.reloadBinStorages = action.payload
        },
        setReloadFavoriteStorages: (state, action: PayloadAction<boolean>) => {
            state.reloadFavoriteStorages = action.payload
        },
        setRenameStorage: (state, action: PayloadAction<RenameStorage>) => {
            state.renameStorage = action.payload
        },
        setProtectStorage: (state, action: PayloadAction<Storage | null>) => {
            state.protectStorage = action.payload
        },
        setStorageAuthentication: (state, action: PayloadAction<Storage | null>) => {
            state.storageAuthentication = action.payload
        },
        setShareStorage: (state, action: PayloadAction<Storage | null>) => {
            state.shareStorage = action.payload
        }
    }
});

//Exportando ações do reducer
export const {
    setModePage,
    setPathCurrent,
    setStorageSelected,
    setStorageSelectedToDefault,
    setSelectorAreaActive,
    setStorageDetails,
    setOpenStorage,
    setToggleTrashStorage,
    setToggleFavoriteStorage,
    setReloadStorages,
    setReloadBinStorages,
    setDeleteStorage,
    setReloadFavoriteStorages,
    setRenameStorage,
    setProtectStorage,
    setStorageAuthentication,
    setShareStorage
} = slice.actions;

export default slice.reducer;