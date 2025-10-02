import { isValid, isAfter, isBefore, add, type Duration} from "date-fns";
import { IncurralFrequency, PaymentType, type IPaymentHistory} from "./types";

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

    const increments: Record<IncurralFrequency, Duration> = {
        [IncurralFrequency.daily]:       { days: 1 },
        [IncurralFrequency.weekly]:      { weeks: 1 },
        [IncurralFrequency.fortnightly]: { weeks: 2 },
        [IncurralFrequency.monthly]:     { months: 1 },
        [IncurralFrequency.quarterly]:   { months: 3 },
        [IncurralFrequency.yearly]:      { years: 1 },
    };
    export function getNextDate(base: Date, freq: IncurralFrequency): Date {
        freq = freq.toLowerCase() as IncurralFrequency
        return add(base, increments[freq]);
    }


    export function getPayPerDay(amount: number, frequency: IncurralFrequency): number {
        frequency = frequency.toLowerCase() as IncurralFrequency
        const divider: Record<IncurralFrequency, number> = {
            [IncurralFrequency.daily]:       1,
            [IncurralFrequency.weekly]:      7,
            [IncurralFrequency.fortnightly]: 14,
            [IncurralFrequency.monthly]:     30,
            [IncurralFrequency.quarterly]:   90,
            [IncurralFrequency.yearly]:      365,
        };
        return amount/divider[frequency];
    }
    export function getInterestRateFromFreq(freq: IncurralFrequency, rate: number){
        freq = freq.toLowerCase() as IncurralFrequency
        const increments: Record<IncurralFrequency, number> = {
            [IncurralFrequency.daily]:       365,
            [IncurralFrequency.weekly]:      52,
            [IncurralFrequency.fortnightly]: 26,
            [IncurralFrequency.monthly]:     12,
            [IncurralFrequency.quarterly]:   4,
            [IncurralFrequency.yearly]:      1,
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
    export function adjustDate(date: Date, incurralFrequency: IncurralFrequency){
        const today = new Date().setHours(0,0,0)
        let depth = 0

        while(isBefore(date, today)){
            date = getNextDate(date, incurralFrequency)
            depth++
            if(depth > 10000) throw new Error("Maximum depth exceeded")
        }
        return date
    }
    export function getMoneyInAndOut(paymentHistory: IPaymentHistory[]){    
        const paymentData = paymentHistory.reduce((a, c) => {
            a.moneyIn += c.payments
                .filter(p => p.paymentType == PaymentType.Incoming)
                .reduce((a1, c1) => a1 += c1.amount, 0)
            a.moneyOut += c.payments
                .filter(p => p.paymentType == PaymentType.Outgoing)
                .reduce((a1, c1) => a1 += c1.amount, 0)
            return a
        }, {moneyIn: 0, moneyOut: 0})

        const round = (num: number) => Math.round(num*100)/100
        return {moneyIn: round(paymentData.moneyIn), moneyOut: round(paymentData.moneyOut)}
    }
    export function formatNum(number: number, isMoney?: boolean){
        const round = (num: number) => Math.round(num*100)/100
        const isNeg = number < 0
        let output = ""
        number = Math.abs(number)

        if(number < 1000){
            output = `${round(number)}`
        }
        else if(number < 1000000){
            output = round(number/1000) + "k"
        }
        else if(number < 1000000000){
            output = round(number/1000000) + "m"
        }
        else if(number < 1_000_000_000_000){
            output = round(number/1000000000) + "b"
        }else{
            output = round(number/1_000_000_000_000) + "t"
        }

        if(isMoney){
            return isNeg ? "-$" + output : "$" + output
        }else{
            return isNeg ? "-" + output : output
        }
    }

    export function getProgress(start: number, current: number, goal: number){
        if(goal == start) return 1
        const adjustedGoal = goal - start
        const adjustedStart = current - start
        return adjustedStart/adjustedGoal
    }

    export const frequencyItems = Object.values(IncurralFrequency).map((v,i) => ({id: i, name: v}))
}