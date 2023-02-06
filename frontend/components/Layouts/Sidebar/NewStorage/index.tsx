import styles from '../Sidebar.module.scss'
import {
    useState,
    useEffect,
    useRef
} from 'react'
import Zoom from '@mui/material/Zoom';
import {
    AiOutlineFolderAdd,
    AiOutlineFileAdd
} from 'react-icons/ai'
import {
    MdOutlineDriveFolderUpload
} from 'react-icons/md'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    ToastId
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import { ApiCreateStorage } from '../../../../types/Storage';
import { api } from '../../../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { AxiosError } from 'axios';
import { Api } from '../../../../types/Api';
import { setReloadStorages } from '../../../../redux/reducers/storageReducer';
import { useRouter } from 'next/router';

type Props = {
    id_higher: string,
    visible: boolean,
    setVisible: (v: boolean) => void
}

export const NewStorage = ({ id_higher, visible, setVisible }: Props) => {
    const router = useRouter()

    const storageReducer = useSelector((state: RootState) => state.storage)
    const dispatch = useDispatch()

    const toast = useToast()
    const toastIdRef = useRef<null | ToastId>(null)

    const { data: user } = useSession()

    const [inputName, setInputName] = useState('')
    const [inputExtension, setInputExtension] = useState('')
    const [modalNewStorage, setModalNewStorage] = useState<{ mode: string }>()

    const last_length = storageReducer.pathCurrent.length - 1
    const path_current = storageReducer.pathCurrent[last_length]

    const handleOpenModal = (mode: string) => {
        setModalNewStorage({ mode })
        setVisible(false)
    }

    const handleCloseModal = () => {
        setModalNewStorage(undefined)
        setInputName('')
        setInputExtension('')
    }

    const handleCloseMenuNewStorage = (e: MouseEvent) => {
        let stopLoop = false

        e.composedPath().map((v: any) => {
            if (!stopLoop) {
                if (v.id == id_higher) {
                    stopLoop = true
                    setVisible(true)
                }


                if (v.id != id_higher) {
                    setVisible(false)
                }
            }
        })
    }

    const handleCreateStorage = async () => {
        if (
            modalNewStorage?.mode == 'add_directory' ?
                (inputName != '') : true &&
                    modalNewStorage?.mode == 'add_file' ?
                    (inputName != '' && inputExtension != '') : true
        ) {
            try {
                var request: ApiCreateStorage = await api('storages/', 'post', {
                    name: inputName,
                    extension: inputExtension,
                    storage_higher_level_id: path_current.id.toString()
                }, user?.user.jwt)

                toast({
                    title: request.storage?.type == 'Pasta' ? 'Pasta criada com sucesso' : 'Arquivo criado com sucesso',
                    status: 'success',
                    isClosable: true,
                    position: 'bottom-left',
                    duration: 6000,
                })

                handleCloseModal()

                dispatch(setReloadStorages(true)) 
                if (storageReducer.modePage != 'home') router.push('/')
            } catch (error) {
                const e = error as AxiosError<Api>

                toast({
                    title: e.response?.data.message,
                    status: 'error',
                    position: 'bottom-left',
                    duration: 8000,
                })
            }
        } else {
            toast({
                title: 'Preencha todos os campos',
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
        } 

       
    }

    const handleUpload = () => {
        let input = document.createElement('input');

        input.type = 'file';
        input.onchange = async _this => {
            let file = input.files?.item(0)
            if (file) {
                try {
                    toastIdRef.current = toast({
                        title: 'O upload do arquivo está sendo feito...',
                        status: 'info',
                        position: 'bottom-left',
                        duration: 100 * 1000000
                    })

                    await api('storages/upload', 'post', {
                        file: input.files?.item(0),
                        storage_higher_level_id: path_current.id.toString()
                    },
                        user?.user.jwt,
                        { "Content-Type": "multipart/form-data" }
                    )

                    if (toastIdRef.current) {
                        toast.update(toastIdRef.current, {
                            title: 'Upload do arquivo foi realizado com sucesso',
                            status: 'success',
                            isClosable: true,
                            duration: 5000,
                        })

                        if (storageReducer.modePage != 'home') router.push('/')
                    }


                    handleCloseModal()

                    dispatch(setReloadStorages(true))
                } catch (error) {
                    const e = error as AxiosError<Api>

                    if (toastIdRef.current) {
                        toast.update(toastIdRef.current, {
                            title: e.response?.data.message,
                            status: 'error',
                            duration: 8000,
                        })
                    }
                }
            }

        };
        input.click();
 
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleCloseMenuNewStorage)

        return () => {
            document.removeEventListener('mousedown', handleCloseMenuNewStorage)
        }
    }, [])


    return (
        <>
            <Zoom in={visible} id={styles.newStorageApp} >
                <div>
                    <ul className={styles.newStorageOptions}>
                        <li onClick={() => handleOpenModal('add_directory')}>
                            <AiOutlineFolderAdd className={styles.iconAddDirectory} />

                            <span>Nova pasta</span>
                        </li>
                        <li onClick={() => handleOpenModal('add_file')}>
                            <AiOutlineFileAdd className={styles.iconAddFile} />

                            <span>Novo Arquivo</span>
                        </li>
                        <hr style={{ margin: '10px 0' }} />
                        <li onClick={handleUpload}>
                            <AiOutlineFileAdd className={styles.iconUploadFile} />

                            <span>Upload de arquivo</span>
                        </li>
                    </ul>
                </div>
            </Zoom >


            <Modal isOpen={modalNewStorage != undefined} onClose={handleCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {modalNewStorage?.mode == 'add_directory' ?
                            'Nova pasta'
                            : modalNewStorage?.mode == 'add_file' ?
                                'Novo arquivo'
                                : ''}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className='d-flex'>
                        <Input
                            placeholder={
                                modalNewStorage?.mode == 'add_directory' ?
                                    'Pasta sem nome'
                                    : modalNewStorage?.mode == 'add_file' ?
                                        'Arquivo sem nome'
                                        : ''
                            }
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                        />
                        {modalNewStorage?.mode == 'add_file' &&
                            <Input
                                placeholder='.txt'
                                width='30%'
                                value={inputExtension}
                                onChange={(e) => setInputExtension(e.target.value)}
                            />
                        }

                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={handleCloseModal} size='sm'>
                            Cancelar
                        </Button>
                        <Button colorScheme='blue' size='sm' onClick={handleCreateStorage}>Criar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}