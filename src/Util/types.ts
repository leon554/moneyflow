

export enum IncurralFrequency {
    OneTime ="one-time",
    Daily = "daily",
    Weekly =  "weekly",
    Fortnightly = "fortnightly",
    Monthly = "monthly",
    Quarterly = "quarterly",
    Yearly = "yearly"
}
export enum AccountType  {
    CashAccount,
    SavingsAccount,
    DeptAccount,
}



interface BaseBucket<T extends AccountType>{
    name: string
    sourceName: string
    amount: number
    allocation: number
    percentageAllocation: boolean
    target: number
    bucketType: T
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