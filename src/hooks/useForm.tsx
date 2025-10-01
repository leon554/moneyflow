import { useState } from "react";


export default function useForm<T>(initialFormData: T) {
    const [form, updateForm] = useState<T>(initialFormData)

    function setForm<K extends keyof T>(key: K, value: T[K]){
        updateForm(prev => ({...prev, [key]: value}))
    }

    function setWholeForm(formData: T){
        updateForm(formData)
    }
    function resetForm(){
        updateForm(initialFormData)
    }

    return {form, setForm, setWholeForm, resetForm}
}
