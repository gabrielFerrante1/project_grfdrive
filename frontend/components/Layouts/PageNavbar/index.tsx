import styles from './PageNavbar.module.scss'
import { Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { RiArrowRightSLine } from 'react-icons/ri'
import { StoragePath } from '../../../types/Storage';
import { setPathCurrent, setStorageSelectedToDefault } from '../../../redux/reducers/storageReducer';
import { Actions } from './Actions';
const { Text } = Typography;

export const PageNavbar = () => {
    const storage = useSelector((state: RootState) => state.storage)

    const dispatch = useDispatch()

    const handleOpenDirectory = (id: number) => {
        let stopLoop = false
        const newPathCurrent: StoragePath[] = []

        storage.pathCurrent.forEach((item) => {
            if (!stopLoop) {
                newPathCurrent.push(item)
            }

            if (item.id == id) {
                stopLoop = true
            }
        })

        dispatch(setPathCurrent(newPathCurrent))
        dispatch(setStorageSelectedToDefault(true))
    }

    const titlePage = storage.modePage == 'bin' ? 'Lixeira' :
        storage.modePage == 'favorites' ? 'Favoritos' :
            storage.modePage == 'shares' ? 'Meus compartilhamentos' : ""

    return (
        <div className={styles.content} >
            {titlePage ?
                <div className={styles.titlePage}>
                    {titlePage}
                </div>
                :
                <div className={styles.pathStorage}>
                    {storage.pathCurrent.map((item, key) => (
                        <div key={key} className={styles.directory}>
                            <Text
                                onClick={() => handleOpenDirectory(item.id)}
                                className={storage.pathCurrent.length == key + 1 ? styles.labelStorageActive : styles.labelStorage}
                                color='red'
                            >
                                {item.name}
                            </Text>

                            {storage.pathCurrent.length != key + 1 &&
                                <RiArrowRightSLine className={styles.iconArrowForward} />
                            }
                        </div>
                    ))}
                </div>
            }
            <Actions />
        </div>
    )
} 