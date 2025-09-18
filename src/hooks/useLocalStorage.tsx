import { useEffect, useState } from "react"


export default function useLocalStorage(key: string, value?: string) {
    value ? setValue(key, value) : null
    const [valueState, setValueState] = useState(value ?? getValue(key))
    
    useEffect(() => {
        setValueState(getValue(key))
    }, [])

    return {getValue, setValue, valueState}
}

const getValue = (key: string) => {
    return localStorage.getItem(key)
}
const setValue = (key: string, value: string | number) => {
    return localStorage.setItem(key, `${value}`)
}