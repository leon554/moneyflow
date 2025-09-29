

export enum IncurralFrequency {
    OneTime ="onetime",
    Daily = "daily",
    Weekly =  "weekly",
    Fortnightly = "fortnightly",
    Monthly = "monthly",
    Quarterly = "quarterly",
    Yearly = "yearly"
}

export interface IncomeDataType{
    id?: string
    name: string
    incomeAmount: number
    nextIncurralDate: string
    incomeFrequency: IncurralFrequency
}
export interface Source{
    id: string
    incomeSourceId: string
    bucketTargetId: string
    allocation: number
    isPercentage: boolean
}


export enum AccountType  {
    CashAccount = "Cash",
    SavingsAccount = "Savings",
    DeptAccount = "Debt",
}
interface BaseBucket<T extends AccountType>{
    id?: string
    name: string    
    sources: Source[]
    balance: number
    startBalance: number
    targetBalance: number
    accountType: T
}
interface Interest{
    interest: number
    compoundFrequency: IncurralFrequency
    nextIncurralDate: string
}
export type NonInterestAccount = BaseBucket<AccountType.CashAccount>
export type SavingsAccount = BaseBucket<AccountType.SavingsAccount> & Interest
export type DeptAccount = BaseBucket<AccountType.DeptAccount> & Interest
export type BucketDataType = NonInterestAccount | SavingsAccount | DeptAccount



export interface BillData{
    id?: string
    name: string
    sourceBucketId: string
    amount: number
    balance: number
    frequency: IncurralFrequency
    nextIncurralDate: string
}

export interface ISimulatable{
    step: (date: Date, ...arg: any) => IPayment[]
}
export interface IPayment{
    sourceId: string
    destinationId: string
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

export interface SimulationType{
    running: boolean;
    setRunning: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    reset: () => void;
    paymentHistory: IPaymentHistory[];
}

export interface RecurringPayment{
    amount: number
    frequency: IncurralFrequency
    nextIncurralDate: Date
}
export interface LoanInfo{
    principal: number
    annualInterest: number
    compoundFrequency: IncurralFrequency
    nextCompoundDate: Date
}
export interface SavingsInfo{
    currentBalance: number
    targetBalance: number
    annualInterest: number
    compoundFrequency: IncurralFrequency
    nextCompoundDate: Date
}