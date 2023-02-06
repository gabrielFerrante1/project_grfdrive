import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { Button, Input, useToast } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { setShareStorage } from "../../redux/reducers/storageReducer"
import { Api } from "../../types/Api"
import { api } from "../../utils/api"
import { useSession } from "next-auth/react"
import { AxiosError } from "axios"

const ShareStorage = () => {
    const toast = useToast()

    const { data } = useSession()

    const dispatch = useDispatch()

    const [inputEmail, setInputEmail] = useState('')
    const [modal, setModal] = useState(false)

    const storage = useSelector((state: RootState) => state.storage)

    const handleCloseModal = () => {
        setInputEmail('')
        setModal(false)
        dispatch(setShareStorage(null))
    }


    const handleShareStorage = async () => {
        if (storage.shareStorage == null) return;

        if (inputEmail == "") {
            toast({
                title: 'Preencha um email',
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
        }

        try {
            await api(`storages/${storage.shareStorage.id}/shares`, 'post', {
                user_email: inputEmail
            }, data?.user.jwt)

            toast({
                title: `O pedido de compartilhamento foi enviado ao email ${inputEmail}`,
                status: 'success',
                position: 'bottom-left',
                isClosable: true,
                duration: 6000,
            })

            handleCloseModal()
        } catch (error) {
            const e = error as AxiosError<Api>
            toast({
                title: e.response?.data.message,
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
        }
    }


    useEffect(() => {
        if (storage.shareStorage != null) {
            setModal(true)
        }
    }, [storage.shareStorage])


    return (
        <div>
            <Modal isOpen={modal} onClose={handleCloseModal} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Novo compartilhamento</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Compartilhar {storage.shareStorage?.type == 'Pasta' ? 'pasta' : 'arquivo'}: {storage.shareStorage?.name}
                        <hr className="mt-1 mb-1" />
                        Digite o email com quem você quer compartilhar
                        <Input
                            value={inputEmail}
                            className="mt-2"
                            onChange={(e) => setInputEmail(e.target.value)}
                            type='email'
                        />

                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' mr={3} onClick={handleCloseModal}>
                            Fechar
                        </Button>
                        <Button colorScheme='blue' onClick={handleShareStorage} >Compartilhar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ShareStorage