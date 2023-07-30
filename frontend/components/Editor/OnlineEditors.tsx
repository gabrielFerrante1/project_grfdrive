import { Avatar, Button, Divider, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from '@chakra-ui/react';
import styles from './DocsEditor.module.scss';
import { UserEditor } from '../../types/StorageSocket';
import { BiExit, BiUserX } from 'react-icons/bi'
import { OneStorage } from '../../types/Storage';
import { useSession } from 'next-auth/react';
import socketClient from 'socket.io-client';

type Props = {
    editors: UserEditor[],
    storage: OneStorage
}

export const OnlineEditors = ({ editors, storage }: Props) => {
    const { data } = useSession()

    const socket = socketClient(process.env.NEXT_PUBLIC_BASE_URL as string);
    const is_owner = storage.owner.id == data?.user.id

    const kickEditor = (userId: number) => {
        socket.emit(`kick_editing_room`, { userId, storageId: storage.id })
    }

    const removeAccess = (userId: number) => {
        socket.emit(`revoke_file_access`, { userId, storageId: storage.id })
    }

    return (
        <div className={styles.onlineEditors}>
            {editors.filter((fU) => fU.id != data?.user.id).map((user, key) => (
                <Popover placement='top-start' key={key}>
                    <PopoverTrigger>
                        <Avatar name={user.name} size='sm' cursor='pointer' />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader className={styles.editorPopoverHeader}>
                            <Avatar name={user.name} size='sm' cursor='pointer' />
                            <div className={styles.editorInfo}>
                                <Text fontWeight='semibold'>{user.name}</Text>
                                {is_owner && <small>{user.email}</small>}
                            </div>
                        </PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        {is_owner &&
                            <PopoverBody p={0}  >
                                <div className={styles.editorOption} onClick={() => removeAccess(user.id)}>
                                    <BiUserX className={styles.editorOptionIcon} />
                                    <span className={styles.editorOptionTitle}>Remover acesso ao arquivo</span>
                                </div>
                                <Divider />
                                <div className={styles.editorOption} onClick={() => kickEditor(user.id)}>
                                    <BiExit className={styles.editorOptionIcon} />
                                    <span className={styles.editorOptionTitle}>Expulsar editor</span>
                                </div>
                            </PopoverBody>
                        }
                    </PopoverContent>
                </Popover>

            ))}


        </div>
    )
}