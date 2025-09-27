import type { ReactNode } from "react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

interface Props{
    open: boolean
    onClose: () => void
    children: ReactNode
}
export default function Modal({open, onClose, children}: Props) {

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflowY = 'auto';
        return () => {
            document.body.style.overflowY = 'auto'
        };
    }, [open]);

    return createPortal(
        <div className={`fixed z-20 inset-0  ${open ? "visible bg-black/60 overflow-hidden" : "invisible"} `}
            onClick={onClose}>
            <div className={` fixed  rounded-md flex w-screen justify-center  items-center left-1/2 top-1/3  -translate-y-1/2 transform -translate-x-1/2`}
                onClick={e =>{
                     e.stopPropagation()
                     onClose()
                }}>
                {children}  
            </div>
        </div>,
        document.getElementById("modal-root")!
    )
}
