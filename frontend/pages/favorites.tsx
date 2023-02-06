import { useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SelectorArea from '../components/SelectorArea'
import SelectableComponent from '../components/SelectorArea/selectableComponent'
import ViewStorage from '../components/Storages/ItemStorage'
import { setDeleteStorage, setReloadBinStorages, setReloadFavoriteStorages } from '../redux/reducers/storageReducer'
import { RootState } from '../redux/store'
import styles from '../styles/GetMyStorages.module.scss'
import { Api } from '../types/Api'
import { ApiGetMyStorages, Storage } from '../types/Storage'
import { api } from '../utils/api'


const GetMyStorages = () => { 
    const { data } = useSession()

    const dispatch = useDispatch()
    const storage = useSelector((state: RootState) => state.storage)

    const [storagesList, setStoragesList] = useState<Storage[]>([])

    const handleGetFavoritedsStorages = async () => {
        const storages: ApiGetMyStorages = await api('storages', 'get', `is_favorite=true`, data?.user.jwt)

        setStoragesList(storages.storages)
    }
 
    useEffect(() => {
        handleGetFavoritedsStorages()
    }, [])

    useEffect(() => {
        if (storage.reloadFavoriteStorages) {
            handleGetFavoritedsStorages()
            dispatch(setReloadFavoriteStorages(false))
        }
    }, [storage.reloadFavoriteStorages])


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