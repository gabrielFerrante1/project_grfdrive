
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
import { setOpenStorage, setReloadStorages, setStorageAuthentication, setStorageSelected } from "../../redux/reducers/storageReducer"
import { RootState } from "../../redux/store"
import { Api } from "../../types/Api"
import { api } from "../../utils/api"


export const StorageAuthentication = () => {
    const [inputPassword, setInputPassword] = useState('')

    const toast = useToast()
    const { data } = useSession()

    const storage = useSelector((state: RootState) => state.storage)
    const dispatch = useDispatch()

    const closeModalProtectStorage = () => {
        dispatch(setStorageAuthentication(null))
        dispatch(setStorageSelected([]))
        dispatch(setOpenStorage(null))
    }

    const handleSetPasswordOnStorage = async () => {
        if (!inputPassword || storage.storageAuthentication == null) {
            toast({
                title: `Senha inválida para ${storage.storageAuthentication?.type == 'Pasta' ? 'a pasta' : 'o arquivo'}`,
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
            return;
        }

        let open_storage = Object.assign({}, storage.storageAuthentication)
        open_storage.is_protected = false

        const request: Api = await api(`storages/${storage.storageAuthentication?.id}/password`, 'get', `password=${inputPassword}`, data?.user.jwt)

        if (request.error == "") {
            dispatch(setOpenStorage(
                open_storage
            ))

            dispatch(setStorageAuthentication(null))
        } else {
            toast({
                title: `Senha inválida para ${storage.storageAuthentication?.type == 'Pasta' ? 'a pasta' : 'o arquivo'}`,
                status: 'error',
                position: 'bottom-left',
                duration: 6000,
            })
        }

    }

    return (
        <Modal isOpen={storage.storageAuthentication != null} onClose={closeModalProtectStorage} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{storage.storageAuthentication?.type == 'Pasta' ? 'A pasta' : 'O arquivo'} é protegido por senha</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Digite a senha {storage.storageAuthentication?.type == 'Pasta' ? 'da pasta' : 'do arquivo'} para acessá-l{storage.storageAuthentication?.type == 'Pasta' ? 'a' : 'o'}:
                    <Input
                        value={inputPassword}
                        className="mt-2"
                        onChange={(e) => setInputPassword(e.target.value)}
                    />

                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={closeModalProtectStorage}>
                        Cancelar
                    </Button>
                    <Button colorScheme='blue' onClick={handleSetPasswordOnStorage} >Abrir</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}