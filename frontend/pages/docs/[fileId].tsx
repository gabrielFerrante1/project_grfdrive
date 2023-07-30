import { useEffect, useRef, useState } from "react"
import { Navbar } from "../../components/Layouts/Navbar"
import { useDispatch } from "react-redux"
import { setModePage } from "../../redux/reducers/storageReducer"
import styles from '../../styles/Editor.module.scss'
import { Heading, Progress } from "@chakra-ui/react"
import { ApiGetOneStorage, OneStorage } from "../../types/Storage"
import { api } from "../../utils/api"
import { useSession } from "next-auth/react"
import { HeaderOptions, IRef as HeaderOptionsIRef } from "../../components/Editor/HeaderOptions"
import socketClient from 'socket.io-client';
import { UserEditor } from "../../types/StorageSocket"
import { OnlineEditors } from "../../components/Editor/OnlineEditors"

const DocsEditor = () => {
    //Auth
    const { data } = useSession();
    const dispatch = useDispatch();

    const socket = socketClient(process.env.NEXT_PUBLIC_BASE_URL as string);

    const editorRef = useRef<HTMLDivElement | null>(null)
    const headerOptionsRef = useRef<HeaderOptionsIRef | null>(null)

    const [onlineEditors, setOnlineEditors] = useState<UserEditor[]>([])
    const [loading, setLoading] = useState(true)
    const [fileBody, setFileBody] = useState('')
    const [storage, setStorage] = useState<OneStorage>()
    const [kicked, setKicked] = useState(false)

    // Sockets receiver
    socket.on('recevie_file_body', (data: string) => {
        if (!editorRef.current) return

        editorRef.current.innerHTML = data
    })

    socket.on('online_editors', (data: UserEditor[]) => setOnlineEditors(data))

    socket.on(`kick_${data?.user.id}_editing_room_${storage?.id}`, () => {
        setKicked(true)
    })

    const getFileBody = async () => {
        const urlSearchParams = new URLSearchParams(window.location.search)
        const storage_id = urlSearchParams.get('storageId')

        if (urlSearchParams.has('storageId') && storage_id != null) {
            try {
                const r: ApiGetOneStorage = await api(`storages/${storage_id}`, 'get', '', data?.user.jwt);

                if (r.file_body) {
                    setFileBody(r.file_body);
                    setLoading(false);
                    setStorage(r.storage);

                    socket.emit('enter_editing_room', {
                        storageId: storage_id,
                        userId: data?.user.id
                    });

                    return;
                }

            } catch (error) { }
        }

        window.close()
    }

    useEffect(() => {
        dispatch(setModePage('docs_editor'))

        getFileBody();
    }, [])


    return (
        <div className={styles.container}>
            {!kicked ?
                <>
                    <div className={styles.header}>
                        <Navbar />

                        {loading ?
                            <Progress size='xs' isIndeterminate />
                            :
                            <HeaderOptions
                                editorRef={editorRef}
                                storageId={storage?.id as number}
                                ref={headerOptionsRef}
                            />}
                    </div>

                    <div
                        className={styles.editorBody}
                        onMouseUp={headerOptionsRef.current?.checkOptionsActivy}
                        style={{ height: onlineEditors.length > 1 ? '' : '100%' }}
                    >
                        <div
                            className={styles.editorPage}
                            contentEditable
                            ref={editorRef}
                            dangerouslySetInnerHTML={{ __html: fileBody }}
                            onKeyDown={() => headerOptionsRef.current?.setRequiredSave(true)}
                        />
                    </div>

                    {onlineEditors.length > 1 &&
                        <div className={styles.editors}>
                            <OnlineEditors
                                editors={onlineEditors}
                                storage={storage as OneStorage}
                            />
                        </div>
                    }
                </>
                :
                <div className={styles.kickedEditingRoom}>
                    <Heading as='h3' size='lg' color='red'>
                        Você foi expulso da sala de edição
                    </Heading>
                </div>
            }
        </div>
    )
}


export default DocsEditor;