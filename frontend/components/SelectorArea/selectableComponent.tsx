import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setStorageSelected } from "../../redux/reducers/storageReducer"
import { RootState } from "../../redux/store"
import { Storage } from "../../types/Storage"

type Props = {
    children: JSX.Element,
    storage?: Storage
}

export default ({ children, storage }: Props) => {
    const dispatch = useDispatch()
    const storageReducer = useSelector((state: RootState) => state.storage)

    const [countExecMouseEnter, setCountExecMouseEnter] = useState(0)

    /*
    const handleAddIdStorage = () => {
        if (storage.selectorAreaActive && idStorage != undefined && countExecMouseEnter == 0) {
            const check_storage = storage.storageSelected.find((value) => value == idStorage)
            console.log(check_storage, idStorage)
            let storages = [0]
            if (check_storage != undefined) {
                alert('ja existe ' + idStorage)
                storages = storage.storageSelected.filter((value) => value != idStorage)
            } else {
                storages = storage.storageSelected.concat([idStorage])

                dispatch(setStorageSelected(storages))
            }


        }

        setCountExecMouseEnter(1)
    }
    */



    const handleAddOnStorageSelected = () => {
        if (storageReducer.selectorAreaActive && storage != undefined) {
            const check_storage = storageReducer.storageSelected.find((value) => value.id == storage.id)

            if (!check_storage) {
                const storages = storageReducer.storageSelected.concat([storage])

                dispatch(setStorageSelected(storages))
            }
        }
    }

    return (
        <div
            onMouseDownCapture={handleAddOnStorageSelected}
            onPointerMoveCapture={handleAddOnStorageSelected}
            onMouseUp={handleAddOnStorageSelected}
        >
            {children}
        </div>
    )
}