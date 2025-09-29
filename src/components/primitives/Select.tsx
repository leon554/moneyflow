import { useEffect, useRef, useState, type ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";
import React from "react";

export interface dataFormat{
    icon?: ReactNode
    name: string,
    id: number
    data?: string
}

interface SelectProps {
  items: dataFormat[];
  selectedItem: dataFormat | null;
  setSelectedItem: (id: number) => void;
  setText?: string | React.ReactNode
  defaultText?: string
  style?: string
  center?: boolean
  blur?: boolean
  showIcon?: boolean
  largeText?: boolean
  setBlur?: (blur: boolean) => void
  onBtnClick? : () => void
  onInnerClick?: () => void
  dropUp?: boolean
  divStyles?: string            
}
function Select(props: SelectProps) {
    const focusElement = useRef<null|HTMLDivElement>(null)
    const [clicked, setClicked] = useState(false)

    function setItem(id: number) {
        props.setSelectedItem(id);
        if(focusElement.current != null){
            setClicked(false)
            focusElement.current.blur()
        }
    }

    useEffect(() => {
        if(props.blur && props.setBlur && focusElement.current != null){
            setClicked(false)
            focusElement.current.blur()
            props.setBlur(false)
        }
        const onClick = (e: MouseEvent) => {
            if (focusElement.current && !focusElement.current.contains(e.target as Node)) {
                setClicked(false);
            }
        }
        document.addEventListener("click", onClick)

        return () => {
            document.removeEventListener("click", onClick)
        }
    }, [props.blur])

    return (
        <div className={`relative ${props.divStyles}`} ref={focusElement}>
            <button className={`whitespace-nowrap group text-xs relative transition-transform flex justify-between bg-panel2 items-center gap-1  hover:cursor-pointer ${props.style ? props.style : "w-full flex outline-1 px-3 h-7 rounded-md outline-border text-subtext3 "}`}
                onClick={(e) => {
                    setClicked(!clicked)
                    props.onBtnClick?.()
                    e.stopPropagation()
                }}>
                <p>
                    {props.setText 
                        ?? (props.selectedItem == null 
                        ? props.defaultText 
                        : props.selectedItem.name)} 
                </p>
                <p>
                    {props.showIcon ? <IoIosArrowDown className={`mt-0.5 transition-transform duration-300 ${
                        clicked? "rotate-[180deg]" : "rotate-0"
                    }`}/> : null}
                </p>
            </button>
            <div className={`bg-panel2 absolute  mt-2 ${props.center ? "left-1/2 transform -translate-x-1/2" : "right-0 "} rounded-xl p-2.5  overflow-y-scroll no-scrollbar max-h-100 px-1.5 mb-1 ${props.largeText ? "gap-1.5" : "gap-1"} flex flex-col justify-start items-start scale-0 transition-transform duration-200 bg-panel1 text-subtext1  outline-border2  z-20 w-fit outline-1`} style={{
                scale: clicked ? 1 : 0,
                transformOrigin: props.dropUp ? "bottom" : "top"
                }}
                onWheel={e => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                {props.items && props.items.map((h) => {
                    return (
                    <p
                        key={h.id}
                        className={`hover:bg-highlight transition-colors duration-200 ease-in-out gap-1.5 w-full flex items-center justify-start p-1 px-0.5 ${props.largeText ? "" : "text-sm"} rounded-lg transition duration-100 ease-in-out hover:cursor-pointer text-nowrap hover:text-btn-text px-3`}
                        onClick={() => {
                            props.onInnerClick?.()
                            setItem(h.id)
                        }}>
                        {h.icon} {h.name}
                    </p>
                    );
                })}
            </div>
        </div>
    );
}

export default React.memo(Select);