import * as React from "react";
import { useDispatch } from "react-redux";
import { setSelectorAreaActive, setStorageSelected } from "../../redux/reducers/storageReducer";
import styles from "./selectorArea.module.scss";

type Coordinates = {
    x: number,
    y: number
}

type Props = {
    children: React.ReactNode[],
    id?: string,
    className?: string
}

interface PointerEventCustom extends React.PointerEvent<HTMLDivElement> { 
}

export default ({ children, id, className }: Props) => {
    const dispatch = useDispatch()

    const [origin, setOrigin] = React.useState<Coordinates>()
    const selectorRef = React.useRef<HTMLDivElement>(null)

    const handleMoveMouse = (event: PointerEventCustom) => {
      
        const [mxy1, mxy2] = [event.clientX, event.clientY];

        if (selectorRef.current == null || !origin) return;
        if (mxy1 - origin.x < 0) {
            selectorRef.current.style.left = mxy1 + "px";

        }
        if (mxy2 - origin.y < 0) {
            selectorRef.current.style.top = mxy2 + "px";
        }

        selectorRef.current.style.display = 'block'
        selectorRef.current.style.width = Math.abs(mxy1 - origin.x) + "px";
        selectorRef.current.style.height = Math.abs(mxy2 - origin.y) + "px";
    }

    const handleMoveMouseInsideSelector = (event: PointerEventCustom) => { 
        handleMoveMouse(event)
    }

    const createRectangle = (event: PointerEventCustom) => {
        if (selectorRef.current == null || event.buttons != 1) return;

        dispatch(setStorageSelected([]))

        dispatch(setSelectorAreaActive(true))

        const [mxy1, mxy2] = [event.nativeEvent.clientX, event.nativeEvent.clientY];

        setOrigin({
            x: mxy1,
            y: mxy2
        })

        selectorRef.current.style.left = `${mxy1}px`
        selectorRef.current.style.top = `${mxy2}px`
    }

    const deleteRectangle = (_event: MouseEvent) => {

        dispatch(setSelectorAreaActive(false))

        if (selectorRef.current == null) return;

        setOrigin(undefined)

        selectorRef.current.style.display = 'none'
        selectorRef.current.style.width = '0px'
        selectorRef.current.style.height = '0px'
    }

    React.useEffect(() => {
        document.body.addEventListener('mouseup', deleteRectangle)

        return () => {
            document.removeEventListener('mouseup', deleteRectangle)
        }
    }, [])


    return (
        <div
            onPointerMoveCapture={handleMoveMouse}
            onPointerDown={createRectangle}
            id={id}
            className={className}
        >

            <div
                className={styles.selector}
                ref={selectorRef}
                onMouseMove={handleMoveMouseInsideSelector}
            ></div>


            <div id={styles.rootSelect} onPointerDown={createRectangle}>
                {children}
            </div>
        </div>
    )
}