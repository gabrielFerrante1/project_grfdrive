import { useState, MutableRefObject, useImperativeHandle, forwardRef } from "react"
import {
    BiUndo,
    BiRedo,
    BiBold,
    BiItalic,
    BiEraser,
    BiFontColor,
    BiBrush,
    BiRightIndent,
    BiLeftIndent,
    BiFontSize,
    BiFontFamily,
    BiSave
} from 'react-icons/bi'
import { ImStrikethrough, ImUnderline } from 'react-icons/im'
import { MdOutlineFormatAlignJustify, MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md'
import { Menu, MenuButton, MenuItem, MenuList, Select, useToast } from "@chakra-ui/react"
import InputColor, { Color } from 'react-input-color';
import styles from './DocsEditor.module.scss';
import { Api } from "../../types/Api"
import { api } from "../../utils/api"
import { useSession } from "next-auth/react"

type Props = {
    editorRef: MutableRefObject<HTMLDivElement | null>,
    storageId: number
}

export type IRef = {
    checkOptionsActivy: () => void,
    setRequiredSave: (status: boolean) => void
}

export const HeaderOptions = forwardRef<IRef, Props>(({ editorRef, storageId }, ref) => {
    const { data } = useSession()
    const toast = useToast()

    const [requiredSave, setRequiredSave] = useState(false)
    const [color, setColor] = useState<Color>({ h: 0, s: 0, v: 0, r: 0, g: 0, b: 0, a: 100, hex: "#000000", rgba: "rgba(0, 0, 0, 1)" })
    const [enabledOptions, setEnabledOptions] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        insertOrderedList: false,
        insertUnorderedList: false,
    })

    const checkOptionsActivy = () => {
        setEnabledOptions({
            ...enabledOptions,
            bold: document.queryCommandState("bold"),
            italic: document.queryCommandState("italic"),
            underline: document.queryCommandState("underline"),
            strikeThrough: document.queryCommandState("strikeThrough"),
            insertOrderedList: document.queryCommandState("insertOrderedList"),
            insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        })
    }

    const dcExecComand = (command: string, argument?: string) => {
        document.execCommand(command, false, argument)

        if (!editorRef.current) return;

        if (['insertOrderedList', 'insertUnorderedList'].includes(command)) {
            editorRef.current.style.paddingLeft = '25px'
        } else {
            editorRef.current.style.padding = '10px'
        }

        checkOptionsActivy();
        setRequiredSave(true)
    }

    const zoomEditor = (pct: string) => {
        if (!editorRef.current) return;

        const percentual = parseInt(pct)

        editorRef.current.style.transform = `scale(${percentual}%)`

        if (percentual > 100) {
            const marginPct = percentual == 125 ? 5 : percentual == 150 ? 10 : percentual == 175 ? 16 : 21

            editorRef.current.style.margin = `${marginPct}% 0 ${marginPct + 3}% 0`
        } else {
            editorRef.current.style.margin = '0'
        }
    }

    const handleSaveFile = async () => {
        const storages: Api = await api(`storages/${storageId}/edit`, 'put', { body: editorRef.current?.innerHTML }, data?.user.jwt)
        
        setRequiredSave(false)
        toast({
            title: 'Arquivo salvo com sucesso',
            status: 'success',
            isClosable: true,
            position: 'bottom-left',
            duration: 4000,
        })
    }

    useImperativeHandle(ref, () => ({
        checkOptionsActivy,
        setRequiredSave
    }));


    return (
        <div className={styles.headerEditorOptions}>

            <div className={styles.headerOptionsIcon}>
                <BiUndo onClick={() => dcExecComand('undo')} />
            </div>
            <div className={styles.headerOptionsIcon}>
                <BiRedo onClick={() => dcExecComand('redo')} />
            </div>
            <div className={styles.headerOptionsZoomSelect}>
                <Select variant='unstyled' onChange={e => zoomEditor(e.target.value)}  >
                    <option value='50'>50%</option>
                    <option value='75'>75%</option>
                    <option value='90'>90%</option>
                    <option value='100' selected>100%</option>
                    <option value='125'>125%</option>
                    <option value='150'>150%</option>
                    <option value='175'>175%</option>
                    <option value='200'>200%</option>
                </Select>
            </div>

            <div className={styles.headerOptionsDivider} />

            <div className={`${styles.headerOptionsIcon} ${requiredSave ? styles.headerOptionsSaveIcon : styles.headerOptionsSaveIconDisabled}`} >
                <BiSave onClick={handleSaveFile} />
            </div>

            <div className={styles.headerOptionsDivider} />

            <div className={`${styles.headerOptionsIcon} ${enabledOptions.bold ? styles.headerOptionsIconActive : ''}`}>
                <BiBold onClick={() => dcExecComand('bold')} />
            </div>
            <div className={`${styles.headerOptionsIcon} ${enabledOptions.italic ? styles.headerOptionsIconActive : ''}`}>
                <BiItalic onClick={() => dcExecComand('italic')} />
            </div>
            <div className={`${styles.headerOptionsIcon} ${enabledOptions.underline ? styles.headerOptionsIconActive : ''}`} style={{ fontSize: 19, marginTop: 1.5 }}>
                <ImUnderline onClick={() => dcExecComand('underline')} />
            </div>

            <div className={`${styles.headerOptionsIcon} ${enabledOptions.strikeThrough ? styles.headerOptionsIconActive : ''}`} style={{ fontSize: 18 }}>
                <ImStrikethrough onClick={() => dcExecComand('strikeThrough')} />
            </div>

            <div className={styles.headerOptionsDivider} />

            <Menu>
                <MenuButton>
                    <div className={styles.headerOptionsIcon}>
                        <BiFontFamily />
                    </div>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => dcExecComand('fontName', 'Arial')} >
                        <span style={{ fontFamily: 'Arial' }}>Arial</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'Times New Roman')}>
                        <span style={{ fontFamily: 'Times New Roman' }}  >Times New Roman</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'sans-serif')}>
                        <span style={{ fontFamily: 'sans-serif' }} >Sans Serif</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'Verdana')}>
                        <span style={{ fontFamily: 'Verdana' }} >Verdana</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'Impact')}>
                        <span style={{ fontFamily: 'Impact' }}>Impact</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'monospace')}>
                        <span style={{ fontFamily: 'monospace' }}>Monospace</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'serif')}>
                        <span style={{ fontFamily: 'serif' }}>Serif</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontName', 'Tahoma')}>
                        <span style={{ fontFamily: 'Tahoma' }}>Tahoma</span>
                    </MenuItem>
                </MenuList>
            </Menu>

            <Menu>
                <MenuButton>
                    <div className={styles.headerOptionsIcon}>
                        <BiFontSize />
                    </div>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => dcExecComand('fontSize', '1')} >
                        <span style={{ fontSize: 10.5 }}>"Texto"</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontSize', '3')}>
                        <span style={{ fontSize: 15 }}>"Texto"</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontSize', '5')}>
                        <span style={{ fontSize: 24 }}>"Texto"</span>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('fontSize', '7')}>
                        <span style={{ fontSize: 47 }}>"Texto"</span>
                    </MenuItem>
                </MenuList>
            </Menu>
            <div className={styles.headerOptionsDivider} />
            <div className={styles.headerOptionsIcon}>
                <BiFontColor onClick={() => dcExecComand('foreColor', color.hex)} />
            </div>
            <div className={styles.headerOptionsIcon}>
                <BiBrush onClick={() => dcExecComand('hiliteColor', color.hex)} />
            </div>
            <InputColor
                initialValue={color.hex}
                onChange={setColor}
                placement="right"
            />

            <div className={styles.headerOptionsDivider} />

            <Menu>
                <MenuButton>
                    <div className={styles.headerOptionsIcon} style={{ fontSize: 21 }}>
                        <MdOutlineFormatAlignJustify />
                    </div>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => dcExecComand('justifyFull')} >
                        <div style={{ fontFamily: 'monospace' }}>
                            Justificado
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('justifyCenter')}>
                        <div style={{ fontFamily: 'monospace' }}>
                            Centralizado
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('justifyLeft')}>
                        <div style={{ fontFamily: 'monospace' }}>
                            À esquerda
                        </div>
                    </MenuItem>
                    <MenuItem onClick={() => dcExecComand('justifyRight')}>
                        <div style={{ fontFamily: 'monospace' }}>
                            À direita
                        </div>
                    </MenuItem>
                </MenuList>
            </Menu>

            <div className={`${styles.headerOptionsIcon} ${enabledOptions.insertOrderedList ? styles.headerOptionsIconActive : ''}`}>
                <MdFormatListNumbered onClick={() => dcExecComand('insertOrderedList')} />
            </div>
            <div className={`${styles.headerOptionsIcon} ${enabledOptions.insertUnorderedList ? styles.headerOptionsIconActive : ''}`}>
                <MdFormatListBulleted onClick={() => dcExecComand('insertUnorderedList')} />
            </div>
            <div className={styles.headerOptionsIcon}>
                <BiLeftIndent onClick={() => dcExecComand('outdent')} />
            </div>
            <div className={styles.headerOptionsIcon}>
                <BiRightIndent onClick={() => dcExecComand('indent')} />
            </div>

            <div className={styles.headerOptionsDivider} />

            <div className={styles.headerOptionsIcon}>
                <BiEraser onClick={() => dcExecComand('removeFormat')} />
            </div>
        </div>
    )
})