

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

export interface IncomeDataType{
    name: string
    incomeAmount: number
    nextIncurralData: string
    incomeFrequency: IncurralFrequency
}
export interface Source{
    sourceName: string
    allocation: number
    isPercentage: boolean
}
interface BaseBucket<T extends AccountType>{
    name: string
    sources: Source[]
    balance: number
    targetBalance: number
    accountType: T
}
interface Interest{
    interest: number
    compoundFrequency: IncurralFrequency
    nextIncurralDate: string
}
type NonInterestAccount = BaseBucket<AccountType.CashAccount>
type SavingsAccount = BaseBucket<AccountType.SavingsAccount> & Interest
type DeptAccount = BaseBucket<AccountType.DeptAccount> & Interest
export type BucketDataType = NonInterestAccount | SavingsAccount | DeptAccount


export interface Bill{
    name: string
    sourceName: string
    amount: string
    frequency: IncurralFrequency
    nextIncurralDay: string
}

export interface ISimulatable{
    step: (date: Date) => IPayment[]
}
export interface IPayment{
    source: string
    destination: string
    amount: number
}
export interface IPaymentHistory{
    date: Date
    payments: IPayment[]
}