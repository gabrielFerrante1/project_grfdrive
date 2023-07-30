import { useSession } from "next-auth/react"
import { ReactElement, useEffect, useRef } from "react"
import Auth from '../Auth'
import { Navbar } from "./Navbar"
import styles from './LayoutMain.module.scss'
import { Sidebar } from "./Sidebar"
import { PageNavbar } from "./PageNavbar"
import { useDispatch, useSelector } from "react-redux"
import { setModePage, setOpenStorage, setPathCurrent, setProtectStorage, setReloadBinStorages, setReloadFavoriteStorages, setReloadStorages, setRenameStorage, setStorageAuthentication, setStorageSelectedToDefault, setToggleFavoriteStorage, setToggleTrashStorage } from "../../redux/reducers/storageReducer"
import { RootState } from "../../redux/store"
import { useRouter } from "next/router"
import { ApiToggleFavoriteStorage, ApiToggleTrashStorage } from "../../types/Storage"
import { api } from "../../utils/api"
import { Button, Input, useToast } from "@chakra-ui/react"
import { Api } from "../../types/Api"
import { ProtectStorage } from "../SecurityStorage/protectStorage"
import { StorageAuthentication } from "../SecurityStorage/storageAuthentication"
import StorageDetails from "../StorageDetails"
import ShareStorage from "../ShareStorage/shareStorage"
import ShareStorageAlert from "../ShareStorage/shareStorageAlert"
import { Loading } from "./Loading/Loading"

type Props = {
    children: ReactElement
}

const Layout = ({ children }: Props) => {
    const router = useRouter()

    const { data, status } = useSession()

    const storage = useSelector((state: RootState) => state.storage)
    const dispatch = useDispatch()

    const navBarRef = useRef<HTMLDivElement | null>(null)
    const sideBarRef = useRef<HTMLDivElement | null>(null)

    const handleStorageSelectedToDefault = () => {
        dispatch(setStorageSelectedToDefault(true))
    }

    //Diselect storage
    useEffect(() => {
        const navBarRefCurrent = navBarRef.current
        const sideBarRefCurrent = sideBarRef.current

        if (
            !navBarRefCurrent ||
            !sideBarRefCurrent ||
            !storage.storageSelected
        ) return;

        navBarRefCurrent.addEventListener("click", handleStorageSelectedToDefault);
        sideBarRefCurrent.addEventListener("click", handleStorageSelectedToDefault);

        return () => {
            navBarRefCurrent.removeEventListener("click", handleStorageSelectedToDefault);
            sideBarRefCurrent.removeEventListener("click", handleStorageSelectedToDefault);
        };
    }, [storage.storageSelected])


    const handleSetTitlePage = (url: string) => {
        if (url == '/bin') {
            dispatch(setModePage('bin'))
        } else if (url == '/favorites') {
            dispatch(setModePage('favorites'))
        } else if (url == '/shares') {
            dispatch(setModePage('shares'))
        } else {
            dispatch(setModePage('home'))
        }
    }

    useEffect(() => {
        // subscribe
        router.events.on('routeChangeStart', handleSetTitlePage);

        // unsubscribe
        return () => router.events.off('routeChangeStart', handleSetTitlePage);
    }, [])


    const toast = useToast()

    const handleOpenDirectory = () => {
        if (storage.openStorage == null) return;

        if (storage.openStorage.is_protected) {
            dispatch(setStorageAuthentication(storage.openStorage))
            return;
        }

        if (storage.openStorage.type == 'Pasta') {
            const path = storage.pathCurrent.concat({
                id: storage.openStorage.id,
                name: storage.openStorage.name
            })

            dispatch(setPathCurrent(path))
        } else if (storage.openStorage.extension == 'txt') {  
            window.open(`docs/editor?storageId=${storage.openStorage.id}`);
        }

        dispatch(setOpenStorage(null))
    }

    const handleToggleMoveBinStorage = async () => {
        if (storage.toggleTrashStorage == null) return;

        const request: ApiToggleTrashStorage = await api(`storages/${storage.toggleTrashStorage.id}/dumps`, 'put', {}, data?.user.jwt)
        if (request.error == "") {
            if (storage.modePage == 'home') {
                dispatch(setReloadStorages(true))
            } else if (storage.modePage == 'bin') {
                dispatch(setReloadBinStorages(true))
            }

            let title = ''
            if (storage.toggleTrashStorage.type != 'Pasta') {
                if (request.action == 'move_to_bin') {
                    title = 'Arquivo movido para a lixeira'
                } else {
                    title = 'Arquivo recuperado da lixeira'
                }
            }

            if (storage.toggleTrashStorage.type == 'Pasta') {
                if (request.action == 'move_to_bin') {
                    title = 'Pasta movida para a lixeira'
                } else {
                    title = 'Pasta recuperada da lixeira'
                }
            }

            toast({
                title,
                status: 'info',
                isClosable: true,
                position: 'bottom-left',
                duration: 6000,
            })
        }

        dispatch(setToggleTrashStorage(null))
    }

    const handleToggleFavoriteStorage = async () => {
        if (storage.toggleFavoriteStorage == null) return;

        const request: ApiToggleFavoriteStorage = await api(`storages/${storage.toggleFavoriteStorage.id}/favorites`, 'put', {}, data?.user.jwt)

        if (request.error == "") {
            if (storage.modePage == 'favorites') {
                dispatch(setReloadFavoriteStorages(true))
            }

            let title = ''
            if (storage.toggleFavoriteStorage.type != 'Pasta') {
                if (request.action == 'favorited') {
                    title = 'O arquivo foi favoriado'
                } else {
                    title = 'O arquivo foi desfavoritado'
                }
            }

            if (storage.toggleFavoriteStorage.type == 'Pasta') {
                if (request.action == 'favorited') {
                    title = 'A pasta foi favoritada'
                } else {
                    title = 'A pasta foi desfavoritada'
                }
            }

            toast({
                title,
                status: 'info',
                isClosable: true,
                position: 'bottom-left',
                duration: 6000,
            })
        }

        dispatch(setToggleFavoriteStorage(null))
    }

    const handleRenameStorage = async () => {
        if (storage.renameStorage.storage == null || storage.renameStorage.name == null) return;

        const request: Api = await api(`storages/${storage.renameStorage.storage.id}/rename`, 'put', { name: storage.renameStorage.name }, data?.user.jwt)

        if (request.error == "") {
            dispatch(setReloadStorages(true))

            let title = ''
            if (storage.renameStorage.storage.type != 'Pasta') {
                title = 'O arquivo foi renomeado'
            } else {
                title = 'A pasta foi renomeada'
            }

            toast({
                title,
                status: 'success',
                isClosable: true,
                position: 'bottom-left',
                duration: 6000,
            })
        }

        dispatch(setRenameStorage({ storage: null, name: null }))
    }

    useEffect(() => {
        handleOpenDirectory()
    }, [storage.openStorage])

    useEffect(() => {
        handleToggleMoveBinStorage()
    }, [storage.toggleTrashStorage])

    useEffect(() => {
        handleToggleFavoriteStorage()
    }, [storage.toggleFavoriteStorage])

    useEffect(() => {
        handleRenameStorage()
    }, [storage.renameStorage])


    if (status == 'loading') {
        return (
            <div style={{height: '1000px'}}>
                <Loading />
             </div>
        )
    }


    if (status == 'unauthenticated') {
        return (
            <Auth />
        )
    } else {
        return (
            <div id={styles.app}>
                {storage.modePage != 'docs_editor' ?
                    <>
                        <div ref={navBarRef}>
                            <Navbar />
                        </div>

                        <div id={styles.appPage}>
                            <div id={styles.appPageSidebar} ref={sideBarRef}>
                                <Sidebar />
                            </div>

                            <div id={styles.appPageContent}>
                                <PageNavbar />

                                <div className="d-flex">
                                    <div id={styles.page}>
                                        {children}
                                    </div>
                                    <div id={styles.storageDetails} style={{ width: storage.storageDetails ? '22%' : 0 }}>
                                        <StorageDetails />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    children
                }

                {storage.protectStorage &&
                    <ProtectStorage />
                }

                {storage.storageAuthentication &&
                    <StorageAuthentication />
                }

                <ShareStorage />
                <ShareStorageAlert />
            </div>
        )
    }
}

export default Layout