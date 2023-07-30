import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import styles from '../styles/StorageShares.module.scss'
import { ApiGetStorageShares, StorageShare } from '../types/Storage'
import { api } from '../utils/api'

const Shares = () => {
    const { data } = useSession()

    const [storageShares, setStorageShares] = useState<StorageShare[]>()


    useEffect(() => {
        const getStorageShares = async () => {
            const r: ApiGetStorageShares = await api('storages/shares', 'get', '', data?.user.jwt)

            if (r.error == "") {
                setStorageShares(r.storage_shares)
            }
        }

        getStorageShares()
    }, [])

    return (
        <div id={styles.container}>
            <div id={styles.containerTable}>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>#ID</Th>
                                <Th>Para quem compartilhei</Th>
                                <Th>Status</Th>
                                <Th isNumeric>Data</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {storageShares?.map((v, k) => (
                                <Tr key={k}>
                                    <Td>{v.id}</Td>
                                    <Td>{v.to_user}</Td>
                                    <Td>{v.status}</Td>
                                    <Td isNumeric>{v.date.toString()}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}


export default Shares