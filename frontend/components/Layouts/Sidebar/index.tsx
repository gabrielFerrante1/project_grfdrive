import styles from './Sidebar.module.scss'
import { RiDriveLine } from 'react-icons/ri'
import { HiOutlineTrash } from 'react-icons/hi';
import { Typography } from 'antd';
import { useRouter } from 'next/router';
import { RiAddFill } from 'react-icons/ri'
import { BiStar } from 'react-icons/bi'
import { FaRegShareSquare } from 'react-icons/fa'
import { NewStorage } from './NewStorage';
import { useState } from 'react'
import Link from 'next/link';

const { Text } = Typography

export const Sidebar = () => {
    const router = useRouter()

    const [visibleMenuNewStorage, setVisibleMenuNewStorage] = useState(false)

    return (
        <div id={styles.sideBar}>
            <div className={styles.buttonAddStorage} onClick={() => setVisibleMenuNewStorage(true)}>
                <RiAddFill className={styles.buttonAddStorageIcon} />

                <Text className={styles.buttonAddStorageLabel} strong >
                    Novo
                </Text>
            </div>

            <div id='grf-menu-new-storage-19'>
                <NewStorage
                    id_higher='grf-menu-new-storage-19'
                    visible={visibleMenuNewStorage}
                    setVisible={setVisibleMenuNewStorage}
                />
            </div>

            <ul className={styles.sideBarList}>
                <li>
                    <Link href='/'>
                        <div className={`${styles.listItem} ${router.pathname == '/' && styles.listItemActive}`}>
                            <div>
                                <RiDriveLine className={styles.itemIcon} />
                            </div>

                            <Text className={styles.itemLabel}>Meu Drive</Text>
                        </div>
                    </Link>
                </li>

                <li>
                    <Link href='/shares'>
                        <div className={`${styles.listItem} ${router.pathname == '/shares' && styles.listItemActive}`}>
                            <div>
                                <FaRegShareSquare className={styles.itemIconShare} />
                            </div>

                            <Text className={styles.itemLabel}>Compartilhamentos</Text>
                        </div>
                    </Link>
                </li>

                <li>
                    <Link href='/bin'>
                        <div className={`${styles.listItem} ${router.pathname == '/bin' && styles.listItemActive}`}>

                            <div>
                                <HiOutlineTrash className={styles.itemIconTrash} />
                            </div>

                            <Text className={styles.itemLabel}>Lixeira</Text>

                        </div>
                    </Link>
                </li>

                <li>
                    <Link href='/favorites'>
                        <div className={`${styles.listItem} ${router.pathname == '/favorites' && styles.listItemActive}`}>

                            <div>
                                <BiStar className={styles.itemIconFavorite} />
                            </div>

                            <Text className={styles.itemLabel}>Favoritos</Text>

                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    )
}