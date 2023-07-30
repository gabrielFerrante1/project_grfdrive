import { Storage } from "../../../types/Storage"
import styles from './StorageView.module.scss'
import { GoFileDirectory } from 'react-icons/go'
import { Typography } from "antd"
import { useSession } from "next-auth/react"
import { StorageSize } from "../../../utils/transformStorageSize"
import {
    FaRegFileImage,
    FaRegFileVideo,
    FaRegFileAlt,
    FaRegFileArchive
} from 'react-icons/fa'
import { AiOutlineFileUnknown } from 'react-icons/ai'
import { useDispatch, useSelector } from "react-redux"
import { setOpenStorage, setRenameStorage } from "../../../redux/reducers/storageReducer"
import { RootState } from "../../../redux/store"
import { useState } from "react"

type Props = {
    storage: Storage
}

const { Text } = Typography

const ViewStorage = ({ storage }: Props) => { 

    const [inputName, setInputName] = useState(storage.name)

    const storageReducer = useSelector((state: RootState) => state.storage)
    const dispatch = useDispatch()

    const { data } = useSession()

    const handleOpenStorage = () => {
        if (storageReducer.modePage == 'home') 
            dispatch(setOpenStorage(storage)) 
           
    }

    const handleCloseInputRenameStorage = () => {
        if (storageReducer.renameStorage.storage?.id == storage.id) {
            dispatch(setRenameStorage({
                storage: storage,
                name: inputName
            }))
        }

    }


    return (
        <div>
            <div
                onClick={handleCloseInputRenameStorage}
                onDoubleClick={handleOpenStorage}
                className={`${styles.item} ${storageReducer.storageSelected.find((value) => value.id == storage.id) ? styles.itemActive : styles.itemEffectHover} `}
            >
                <div className={styles.itemIcon}>
                    {storage.type == 'Pasta' ?
                        <GoFileDirectory className={styles.icon} />
                        : storage.type == 'Imagem' ?
                            <FaRegFileImage className={styles.icon} />
                            : storage.type == 'Vídeo' ?
                                <FaRegFileVideo className={styles.icon} />
                                : storage.type == 'Texto' ?
                                    <FaRegFileAlt className={styles.icon} />
                                    : storage.type == 'Zip' ?
                                        <FaRegFileArchive className={styles.icon} />
                                        :
                                        <AiOutlineFileUnknown className={styles.icon} />
                    }

                </div>
                <div className={styles.itemName}>
                    <Text strong>
                        {storageReducer.renameStorage.storage?.id == storage.id ?
                            <input value={inputName} onChange={(e) => setInputName(e.target.value)} className={styles.renameStorage} autoFocus />
                            :
                            storage.extension ? `${storage.name}.${storage.extension}` : storage.name
                        }
                    </Text>
                </div>
                <div className={styles.itemOwner}>
                    <Text  >
                        {storage.owner.id == data?.user.id ?
                            'Eu'
                            :
                            storage.owner.email
                        }
                    </Text>
                </div>
                <div className={styles.itemType}>
                    <Text>{storage.type}</Text>
                </div>
                <div className={styles.itemSize}>
                    <Text>{StorageSize(storage.size)}</Text>
                </div>
            </div>
        </div>
    )
}

export default ViewStorage