import { Typography } from "antd"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setStorageDetails } from "../../redux/reducers/storageReducer"
import { RootState } from "../../redux/store"
import { ApiGetOneStorage, Storage } from "../../types/Storage"
import { api } from "../../utils/api"
import styles from './StorageDetails.module.scss'
import { IoClose } from 'react-icons/io5'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Input } from '@chakra-ui/react'
import { StorageSize } from "../../utils/transformStorageSize"

const { Text } = Typography

const StorageDetails = () => {
    //Auth
    const { data } = useSession()

    const storageReducer = useSelector((state: RootState) => state.storage)
    const dispatch = useDispatch()

    const [tabActive, setTabActive] = useState(1)
    const [storage, setStorage] = useState<ApiGetOneStorage>()


    const handleGetStorage = async (p_storage: Storage) => {
        const r: ApiGetOneStorage = await api(`storages/${p_storage.id}`, 'get', '', data?.user.jwt)
        if (r.error == "") {
            setStorage(r)
        }
    }

    const handleCloseStorageDetails = () => {
        dispatch(setStorageDetails(false))
    }

    useEffect(() => {
        if (storageReducer.storageSelected.length > 1) {
            dispatch(setStorageDetails(false))
        }

        if (storageReducer.storageSelected.length == 1) {
            setTabActive(1)

            const last_length = storageReducer.storageSelected.length - 1
            const first_storage_selected = storageReducer.storageSelected[last_length]

            handleGetStorage(first_storage_selected)
        }

    }, [storageReducer.storageSelected])

    return (
        <div >
            <div id={styles.header}>
                <div className={styles.headerInfo}>
                    <Text className={styles.headerNameStorage} >
                        {storage?.storage.name}
                    </Text>

                    <IoClose className={styles.headerCloseIconStorageDetails} onClick={handleCloseStorageDetails} />
                </div>

                <div className={styles.headerTabs}>
                    <div className={`${styles.headerTabsTab} ${tabActive == 1 && styles.headerTabsTabActive}`} onClick={() => setTabActive(1)}>
                        Detalhes
                    </div>
                    <div className={`${styles.headerTabsTab} ${tabActive == 2 && styles.headerTabsTabActive}`} onClick={() => setTabActive(2)}>
                        Atividade
                    </div>
                </div>
            </div>
             

            <div id={styles.body}>
                {tabActive == 1 ?
                    <>
                        <div className={styles.detailItem}>
                            <small>Tipo:</small>
                            <p>{storage?.storage.type} </p>
                        </div>
                        <div className={styles.detailItem}>
                            <small>Tamanho:</small>
                            <p>{StorageSize(storage?.storage.size as number)} </p>
                        </div>
                        <div className={styles.detailItem}>
                            <small>Proprietário: </small>
                            <p>{storage?.storage.owner.email} </p>
                        </div>
                        {storage?.modifications[storage?.modifications.length - 1] &&
                            <div className={styles.detailItem}>
                                <small>Modificado em:</small>
                                <p>{storage?.modifications[storage?.modifications.length - 1].date.toString()} </p>
                            </div>
                        }

                        <div className={styles.detailItem}>
                            <small>Criado em:</small>
                            <p>{storage?.storage.created_at.toString()} </p>
                        </div>

                        <div className={styles.detailItem}>
                            <small>{storage?.storage.type == 'Pasta' ? 'A Pasta é protegida?' : 'O Arquivo é protegido?'}</small>
                            <p>{storage?.storage.is_protected ? 'Sim' : 'Não'} </p>
                        </div>
                        <div className={styles.detailItem}>
                            <small>Descrição:</small>

                            <p><Input size='sm' value={storage?.storage.type} /> </p>
                        </div>
                    </>
                    :
                    <>
                        {storage?.modifications.map((item, key) => (
                            <div key={key} className={styles.modificationItem}> 
                                <div className={styles.detailItem}>
                                    <small>Data da moficação:</small>
                                    <p>{item.date.toString()} </p>
                                </div>
                                <div className={styles.detailItem}>
                                    <small>Autor:</small>
                                    <p>{item.owner.email} </p>
                                </div>
                                <div className={styles.detailItem}>
                                    <small>Moficação:</small>
                                    <p>{item.action} </p>
                                </div>
                            </div>
                        ))}
                    </>}
            </div>
        </div >
    )
}

export default StorageDetails