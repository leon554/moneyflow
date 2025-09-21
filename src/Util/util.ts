import { isValid, isAfter, isBefore, add} from "date-fns";
import { IncurralFrequency } from "./types";

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
    export function updateMap<K, V>(originalMap: Map<K, V>, key: K, newItem: V): Map<K, V> {
        const newMap = new Map(originalMap);
        newMap.set(key, newItem);
        return newMap;
    }
    export function getNextDate(base: Date, freq: IncurralFrequency): Date {
        freq = freq.toLowerCase() as IncurralFrequency
        const increments: Record<IncurralFrequency, Parameters<typeof add>[1]> = {
            [IncurralFrequency.OneTime]:       { days: 0 },
            [IncurralFrequency.Daily]:       { days: 1 },
            [IncurralFrequency.Weekly]:      { weeks: 1 },
            [IncurralFrequency.Fortnightly]: { weeks: 2 },
            [IncurralFrequency.Monthly]:     { months: 1 },
            [IncurralFrequency.Quarterly]:   { months: 3 },
            [IncurralFrequency.Yearly]:      { years: 1 },
        };
        return add(base, increments[freq]);
    }
    export function getInterestRateFromFreq(freq: IncurralFrequency, rate: number){
        freq = freq.toLowerCase() as IncurralFrequency
        const increments: Record<IncurralFrequency, number> = {
            [IncurralFrequency.OneTime]:      0,
            [IncurralFrequency.Daily]:       365,
            [IncurralFrequency.Weekly]:      52,
            [IncurralFrequency.Fortnightly]: 26,
            [IncurralFrequency.Monthly]:     12,
            [IncurralFrequency.Quarterly]:   4,
            [IncurralFrequency.Yearly]:      1,
        };
        return rate/increments[freq];
    }
    export function capFirst(value: string){
        return value.slice(0, 1).toUpperCase() + value.slice(1)
    }
    export function stringToDate(date: string){
        const componets = date.split("/").map(c => Number(c)).filter(c => !isNaN(c))
        return new Date(`${componets[2]}-${String(componets[1]).padStart(2, "0")}-${String(componets[0]).padStart(2, "0")}`)
    }
}