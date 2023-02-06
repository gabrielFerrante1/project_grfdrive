import styles from '../PageNavbar.module.scss'
import {
    MdOutlineInfo,
    MdOutlineRemoveRedEye,
    MdStarOutline,
    MdOutlineRestoreFromTrash,
    MdOutlineDriveFileRenameOutline,
    MdOutlineSecurity,
    MdOutlineShare
} from 'react-icons/md'
import {
    BiTrash
} from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, store } from '../../../../redux/store'
import { Storage } from '../../../../types/Storage'
import { useState, useEffect } from 'react'
import { setDeleteStorage, setOpenStorage, setProtectStorage, setRenameStorage, setShareStorage, setStorageDetails, setToggleFavoriteStorage, setToggleTrashStorage } from '../../../../redux/reducers/storageReducer'
import { useSession } from 'next-auth/react'

export const Actions = () => {
    const { data: auth } = useSession()

    const dispatch = useDispatch()
    const storageReducer = useSelector((state: RootState) => state.storage)

    const [lastStorageSelected, setLastStorageSelected] = useState<Storage>()

    //Conditionals
    const condStorageSelected = lastStorageSelected != undefined && lastStorageSelected?.type != 'Pasta' || lastStorageSelected?.type == 'Pasta'

    //Actions
    const handleOpenStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setOpenStorage(lastStorageSelected))
    }

    const handleToggleBinStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setToggleTrashStorage(lastStorageSelected))
    }

    const handleToggleFavoriteStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setToggleFavoriteStorage(lastStorageSelected))
    }

    const handleDeleteStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setDeleteStorage(lastStorageSelected))
    }

    const handleRenameStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setRenameStorage({ storage: lastStorageSelected, name: null }))
    }

    const handleProtectStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setProtectStorage(lastStorageSelected))
    }

    const handleToggleStorageDetails = () => {
        dispatch(setStorageDetails(!storageReducer.storageDetails))
    }

    const handleShareStorage = () => {
        if (lastStorageSelected != undefined)
            dispatch(setShareStorage(lastStorageSelected))
    }

    useEffect(() => {
        if (storageReducer.storageSelected.length == 1) {
            const last_length = storageReducer.storageSelected.length - 1
            const first_storage_selected = storageReducer.storageSelected[last_length]

            setLastStorageSelected(first_storage_selected)
        } else {
            setLastStorageSelected(undefined)
        }

    }, [storageReducer.storageSelected])

    return (
        <div className={styles.actionsStorage}>
            {storageReducer.modePage == 'home' && condStorageSelected ?
                <>
                    <div className={styles.iconContent} onClick={handleOpenStorage}>
                        <MdOutlineRemoveRedEye className={styles.icon} />
                    </div>
                    {lastStorageSelected.owner.id == auth?.user.id &&
                        <div className={styles.iconContent} onClick={handleRenameStorage}>
                            <MdOutlineDriveFileRenameOutline className={styles.icon} />
                        </div>
                    }
                    <div className={`${styles.iconContent} `} onClick={handleProtectStorage}>
                        <MdOutlineSecurity className={`${styles.icon} ${styles.iconSecurity}`} />
                    </div>
                    {lastStorageSelected.owner.id == auth?.user.id &&
                        <div className={styles.iconContent} onClick={handleShareStorage}>
                            <MdOutlineShare className={styles.icon} />
                        </div>
                    }
                    <div className={styles.iconContent} onClick={handleToggleFavoriteStorage}>
                        <MdStarOutline className={styles.icon} />
                    </div>
                    <div className={styles.iconContent} onClick={handleToggleBinStorage}>
                        <BiTrash className={styles.icon} />
                    </div>
                </>
                : ''}

            {storageReducer.modePage == 'bin' && condStorageSelected ?
                <>
                    <div className={styles.iconContent} onClick={handleToggleBinStorage}>
                        <MdOutlineRestoreFromTrash className={styles.icon} />
                    </div>
                    <div className={styles.iconContent} onClick={handleDeleteStorage}>
                        <BiTrash className={styles.icon} />
                    </div>
                </>
                : ''}

            {storageReducer.modePage == 'favorites' && condStorageSelected ?
                <>
                    <div className={styles.iconContent} onClick={handleToggleFavoriteStorage}>
                        <MdStarOutline className={styles.icon} />
                    </div>
                </>
                : ''}


            {condStorageSelected &&
                <div className={`m-2 ${styles.iconContent}`} onClick={handleToggleStorageDetails}>
                    <MdOutlineInfo className={styles.icon} />
                </div>
            }

        </div>
    )
}