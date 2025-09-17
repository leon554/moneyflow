import { isValid, isAfter, isBefore} from "date-fns";

export namespace Util{
    export function setValueLim(setFunc: (value: string) => void, value: string, lim: number){
        if(value.length <= lim){
            setFunc(value)
        }
    }
    export function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    export function formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    export function isStringValidDate(date: string, minDate?: Date, maxDate? : Date){
        const maxTimeNum = 8640000000000000

        const components = date.split("/").map(c => Number(c)).filter(c => !isNaN(c))
        if(components.length != 3) return false
        if(components[1] > 12) return false
        if(components[0] > 31) return false

        const selectedDate = new Date(`${components[2]}-${String(components[1]).padStart(2, "0")}-${String(components[0]).padStart(2, "0")}T${getCurrentTime()}`)
       
        if(!isAfter(selectedDate, minDate ?? new Date(0))) return false
        if(!isBefore(selectedDate, maxDate ?? new Date(maxTimeNum))) return false

        return isValid(selectedDate)
    }
}