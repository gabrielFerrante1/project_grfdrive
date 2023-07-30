import { useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SelectorArea from '../components/SelectorArea'
import SelectableComponent from '../components/SelectorArea/selectableComponent'
import ViewStorage from '../components/Storages/ItemStorage'
import { setDeleteStorage, setReloadBinStorages } from '../redux/reducers/storageReducer'
import { RootState } from '../redux/store'
import styles from '../styles/GetMyStorages.module.scss'
import { Api } from '../types/Api'
import { ApiGetMyStorages, Storage } from '../types/Storage'
import { api } from '../utils/api'


const GetMyStorages = () => {
    const toast = useToast()

    const { data } = useSession()

    const dispatch = useDispatch()
    const storage = useSelector((state: RootState) => state.storage)

    const [storagesList, setStoragesList] = useState<Storage[]>([])

    const handleGetBinStorages = async () => {
        const storages: ApiGetMyStorages = await api('storages', 'get', `is_deleted=true`, data?.user.jwt)

        setStoragesList(storages.storages)
    }

    const handleDeleteBinStorage = async () => { 
        const storages: Api = await api(`storages/${storage.deleteStorage?.id}/dumps`, 'delete', {}, data?.user.jwt)

        if (storages.error == "") {
            dispatch(setDeleteStorage(null))

            handleGetBinStorages()

            toast({
                title: storage.deleteStorage?.type == 'Pasta' ? 'Pasta deletada com sucesso' : 'Arquivo deletado com sucesso',
                status: 'success',
                isClosable: true,
                position: 'bottom-left',
                duration: 6000,
            })
        }

    }

    useEffect(() => {
        handleGetBinStorages()
    }, [])

    useEffect(() => {
        if (storage.reloadBinStorages) {
            handleGetBinStorages()
            dispatch(setReloadBinStorages(false))
        }
    }, [storage.reloadBinStorages])

    useEffect(() => {
        if (storage.deleteStorage != null) {
            handleDeleteBinStorage()
        }

    }, [storage.deleteStorage])


    return (
        <SelectorArea id={styles.container}>
            {storagesList.map((item, key) => (
                <SelectableComponent key={key} storage={item}>
                    <ViewStorage
                        storage={item}
                    />
                </SelectableComponent>
            ))}
        </SelectorArea>
    )
}

export default GetMyStorages 