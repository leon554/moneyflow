

export enum IncurralFrequency {
    OneTime ="oneTime",
    Daily = "daily",
    Weekly =  "weekly",
    Fortnightly = "fortnightly",
    Monthly = "monthly",
    Quarterly = "quarterly",
    Yearly = "yearly"
}
export enum AccountType  {
    CashAccount = "Cash",
    SavingsAccount = "Savings",
    DeptAccount = "Debt",
}



interface BaseBucket<T extends AccountType>{
    name: string
    sourceName: string
    amount: number
    allocation: number
    percentageAllocation: boolean
    target: number
    accountType: T
}
interface Interest{
    interest: number
    compoundFrequency: IncurralFrequency
    nextIncurralDate: Date
}
type NonInterestAccount = BaseBucket<AccountType.CashAccount>
type SavingsAccount = BaseBucket<AccountType.SavingsAccount> & Interest
type DeptAccount = BaseBucket<AccountType.DeptAccount> & Interest
export type BucketType = NonInterestAccount | SavingsAccount | DeptAccount


interface Bill{
    name: string
    sourceName: string
    amount: string
    frequency: IncurralFrequency
    nextIncurralDay: Date
}

export interface ISimulatable{
    step: (date: Date) => IPayment[]
}
export interface IPayment{
    source: string
    destination: string
    amount: number
}