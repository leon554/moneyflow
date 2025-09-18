import { useState, useLayoutEffect } from "react";


export default function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`useLocalStorage: Error reading key "${key}"`, error);
            return initialValue;
        }
    });

    useLayoutEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`useLocalStorage: Error setting key "${key}"`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}
