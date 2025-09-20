

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
    nextIncurralDate: string
    incomeFrequency: IncurralFrequency
}
export interface Source{
    sourceName: string
    allocation: number
    isPercentage: boolean
}
export type Allocation = Pick<Source, "allocation" | "isPercentage">

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



export interface BillData{
    name: string
    sourceBucketName: string
    amount: number
    balance: number
    frequency: IncurralFrequency
    nextIncurralDate: string
}

export interface ISimulatable{
    step: (date: Date, ...arg: any) => IPayment[]
}
export interface IPayment{
    source: string
    destination: string
    paymentType: PaymentType
    amount: number
}
export enum PaymentType{
    Incoming = "Incoming",
    Outgoing = "Outgoing"
}
export interface IPaymentHistory{
    date: Date
    payments: IPayment[]
}