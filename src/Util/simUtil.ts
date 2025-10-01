import type { LoanInfo, RecurringPayment, SavingsInfo } from "./types";
import { Util } from "./util";
import { isSameDay, add } from "date-fns";

export namespace simUtil{

    export function simulateLoanPayoff(loanInfo: LoanInfo, inPayments: RecurringPayment[], outPayments: RecurringPayment[], date: Date){
        console.time("loanCalculation");

        let simDate = new Date(date)
        const loanData = {...loanInfo}
        const interestPerPeriod = Util.getInterestRateFromFreq(loanData.compoundFrequency, loanData.annualInterest/100)

        const loanPaymentInfo = {interestPaid: 0, days: 0, amountPaid: 0, payOffDate: simDate}
        let message: string | null = null;

        if(loanData.principal >= 0) return {...loanPaymentInfo, message: "Loan has already been paid off"}
        loanData.principal = Math.abs(loanData.principal)

        while(loanData.principal > 0){
            if(isSameDay(simDate, loanData.nextCompoundDate)){
                const interestToBePaid = loanData.principal * interestPerPeriod
                loanPaymentInfo.interestPaid += interestToBePaid
                loanData.principal += interestToBePaid
                loanData.nextCompoundDate = Util.getNextDate(loanData.nextCompoundDate, loanData.compoundFrequency)
            }
            outPayments.forEach(payment => {
                if(!isSameDay(payment.nextIncurralDate, simDate)) return
                loanData.principal += payment.amount
                payment.nextIncurralDate = Util.getNextDate(payment.nextIncurralDate, payment.frequency)
            })
            inPayments.forEach(payment => {
                if(!isSameDay(payment.nextIncurralDate, simDate)) return
                if(loanData.principal <= payment.amount) payment.amount = loanData.principal
                loanData.principal -= payment.amount
                loanPaymentInfo.amountPaid += payment.amount
                payment.nextIncurralDate = Util.getNextDate(payment.nextIncurralDate, payment.frequency)
            })
            simDate = add(simDate, {days: 1})
            loanPaymentInfo.days++
            if(loanPaymentInfo.days > 36_524/2) { message = "Loan will take more than 50 years to pay off"; break}
        }

        loanData.principal = Math.max(0, loanData.principal);
        console.timeEnd("loanCalculation");
        return {...loanPaymentInfo, message, payOffDate: simDate}
    }

    export function simulateSavingsTarget(savingInfo: SavingsInfo, inPayments: RecurringPayment[], outPayments: RecurringPayment[], date: Date){
        console.time("savingsCalculations");

        let simDate = new Date(date)
        const savingsData = {...savingInfo}
        const interestPerPeriod = Util.getInterestRateFromFreq(savingsData.compoundFrequency, savingsData.annualInterest/100)

        const savingsPaymentInfo = {interestPaid: 0, days: 0, amountPaid: 0, payOffDate: simDate}
        let message: string | null = null;

        if(savingsData.targetBalance <= savingsData.currentBalance) return {...savingsPaymentInfo, message: "Goal has already been reached"}

        while(savingsData.currentBalance < savingsData.targetBalance){
            if(isSameDay(simDate, savingsData.nextCompoundDate)){
                const interestToBePaid = savingsData.currentBalance * interestPerPeriod
                savingsPaymentInfo.interestPaid += interestToBePaid
                savingsData.currentBalance += interestToBePaid
                savingsData.nextCompoundDate = Util.getNextDate(savingsData.nextCompoundDate, savingsData.compoundFrequency)
            }
            outPayments.forEach(payment => {
                if(!isSameDay(payment.nextIncurralDate, simDate)) return
                savingsData.currentBalance -= payment.amount
                payment.nextIncurralDate = Util.getNextDate(payment.nextIncurralDate, payment.frequency)
            })
            inPayments.forEach(payment => {
                if(!isSameDay(payment.nextIncurralDate, simDate)) return
                if((savingsData.targetBalance - savingsData.currentBalance) <= payment.amount) payment.amount = (savingsData.targetBalance - savingsData.currentBalance)
                savingsData.currentBalance += payment.amount
                savingsPaymentInfo.amountPaid += payment.amount
                payment.nextIncurralDate = Util.getNextDate(payment.nextIncurralDate, payment.frequency)
            })
            simDate = add(simDate, {days: 1})
            savingsPaymentInfo.days++
            if(savingsPaymentInfo.days > 36_524/2) { message = "Savings goal will take more than 50 years reach"; break}
        }
        
        console.timeEnd("savingsCalculations");
        return {...savingsPaymentInfo, message, payOffDate: simDate}
    }
}