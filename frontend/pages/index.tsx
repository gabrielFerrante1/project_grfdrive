import { useDispatch, useSelector } from 'react-redux'
import SelectorArea from '../components/SelectorArea'
import SelectableComponent from '../components/SelectorArea/selectableComponent'
import ViewStorage from '../components/Storages/ItemStorage'
import { RootState } from '../redux/store'
import styles from '../styles/GetMyStorages.module.scss'
import { ApiGetMyStorages, ApiToggleFavoriteStorage, ApiToggleTrashStorage, Storage } from '../types/Storage'
import { api } from '../utils/api'
import { useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { setOpenStorage, setPathCurrent, setReloadStorages, setToggleFavoriteStorage, setToggleTrashStorage } from '../redux/reducers/storageReducer'
import { useRouter } from 'next/router'


const GetMyStorages = () => {
    const router = useRouter()

    const toast = useToast()

    const { data } = useSession()

    const dispatch = useDispatch()
    const storage = useSelector((state: RootState) => state.storage)

    const [storagesList, setStoragesList] = useState<Storage[]>([])

    const handleGetStorages = async () => {
        const last_length_path_current = storage.pathCurrent.length - 1
        const last_path_current = storage.pathCurrent[last_length_path_current]

        const storages: ApiGetMyStorages = await api('storages', 'get', `storage_higher_level_id=${last_path_current.id}`, data?.user.jwt)

        setStoragesList(storages.storages) 
    }


    useEffect(() => {
        handleGetStorages()
    }, [storage.pathCurrent])

    useEffect(() => {
        if (storage.reloadStorages) {
            handleGetStorages()
            dispatch(setReloadStorages(false))
        }
    }, [storage.reloadStorages])


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

/*
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await unstable_getServerSession(
        ctx.req, ctx.res, authOptions
    )
    const user = session?.user;

    const return_unathorized = { redirect: { destination: `/autenticar?redirect=/`, permanent: true } }
    if (!session) return return_unathorized

    var storages: ApiGetMyStorages = { error: '', storages: [] }

    try {
        storages = await api('storages', 'get', '', user?.jwt)
    } catch (error) {
        return return_unathorized
    }


    return {
        props: {
            storages: storages.storages
        }
    }
}
*/