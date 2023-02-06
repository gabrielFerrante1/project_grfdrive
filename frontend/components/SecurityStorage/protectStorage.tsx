
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
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setProtectStorage, setReloadStorages } from "../../redux/reducers/storageReducer"
import { RootState } from "../../redux/store"
import { Api } from "../../types/Api"
import { api } from "../../utils/api"


export const ProtectStorage = () => {
    const [inputPassword, setInputPassword] = useState('')

    const toast = useToast()
    const { data } = useSession()

    const storage = useSelector((state: RootState) => state.storage)
    const dispatch = useDispatch()

    const closeModalProtectStorage = () => dispatch(setProtectStorage(null))

    const handleSetPasswordOnStorage = async () => {
        if (!inputPassword) {
            toast({
                title: `Crie uma senha para ${storage.protectStorage?.type == 'Pasta' ? 'a pasta' : 'o arquivo'}`,
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
            return;
        }

        const request: Api = await api(`storages/${storage.protectStorage?.id}/password`, 'post', {
            password: inputPassword
        }, data?.user.jwt)

        if (request.error == "") {
            dispatch(setReloadStorages(true))

            toast({
                title: `Agora ${storage.protectStorage?.type == 'Pasta' ? 'a pasta' : 'o arquivo'} está protegido`,
                status: 'success',
                isClosable: true,
                position: 'bottom-left',
                duration: 6000,
            })

            closeModalProtectStorage()
        }
    }

    return (
        <Modal isOpen={storage.protectStorage != null} onClose={closeModalProtectStorage} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Proteger {storage.protectStorage?.type == 'Pasta' ? 'a pasta' : 'o arquivo'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Configurar um senha para {storage.protectStorage?.type == 'Pasta' ? 'a pasta' : 'o arquivo'}:
                    <Input
                        value={inputPassword}
                        className="mt-2"
                        onChange={(e) => setInputPassword(e.target.value)}
                    />

                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={closeModalProtectStorage}>
                        Fechar
                    </Button>
                    <Button colorScheme='blue' onClick={handleSetPasswordOnStorage} >Configurar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}