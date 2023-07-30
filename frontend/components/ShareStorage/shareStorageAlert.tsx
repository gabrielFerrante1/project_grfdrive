import { useState } from "react"
import { useDispatch, } from "react-redux"
import { Button, useToast } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { setReloadStorages, setShareStorage } from "../../redux/reducers/storageReducer"
import { Api } from "../../types/Api"
import { api } from "../../utils/api"
import { useSession } from "next-auth/react"
import { AxiosError } from "axios"

import socketClient from 'socket.io-client';
import { EventStorageSocketUserReceiveShare } from "../../types/StorageSocket"


const socket = socketClient(process.env.NEXT_PUBLIC_BASE_URL as string);

const ShareStorageAlert = () => {
    const toast = useToast()

    const dispatch = useDispatch()

    const [info, setInfo] = useState<EventStorageSocketUserReceiveShare>()
    const [modal, setModal] = useState(false)
    const { data } = useSession()


    const handleCloseModal = () => {
        setModal(false)
    }

    const handleResponseShare = async (type_response: string) => {
        try {
            await api(`storages/shares/${info?.data.share_id}`, 'post', {
                type_response
            }, data?.user.jwt)

            toast({
                title: 'Os arquivos ou pastas foram destinados a sua pasta raiz',
                status: 'success',
                position: 'bottom-left',
                isClosable: true,
                duration: 6000,
            })
            dispatch(setReloadStorages(true))
        } catch (error) {
            const e = error as AxiosError<Api>
            toast({
                title: e.response?.data.message,
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
        }

        handleCloseModal()
    }


    //Sockets
    socket.on(`user-${data?.user.id}-received-share`, (data: EventStorageSocketUserReceiveShare) => {
        setInfo(data)
        setModal(true)
    })


    return (
        <div>
            <Modal isOpen={modal} onClose={handleCloseModal} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Você recebeu um compartilhamento </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {info?.data.from_user.name} enviou um compartilhamento para você
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' variant='outline' mr={3} onClick={() => handleResponseShare('refused')}>
                            Recusar
                        </Button>
                        <Button colorScheme='green' onClick={() => handleResponseShare('accepted')} >Aceitar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ShareStorageAlert