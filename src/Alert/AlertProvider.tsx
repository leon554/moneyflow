import { createContext, useState } from "react"

interface AlertType{
  showing: boolean
  setShowing: (showing: boolean) => void
  title: string
  setTitle: (title: string) => void
  message: string
  setMessage: (message: string) => void
  alert: (message: string) => void
}
const initialAlertValues = {
  showing: false,
  setShowing: () => null,
  title: "",
  setTitle: () => null,
  message: "",
  setMessage: () => null,
  alert: () => null
}

export const AlertContext = createContext<AlertType>(initialAlertValues)

interface Props {
  children: React.ReactNode;
}
export default function AlertProvider(props: Props) {
  const [showing, setShowing] = useState(false)
  const [message, setMessage] = useState("")
  const [title, setTitle] = useState("")

  function alert( message: string){
    setShowing(true)
    setMessage(message)
    setTitle("MoneyFlow Says")
  }
  return (
    <AlertContext.Provider value={{
      showing: showing,
      setShowing: setShowing,
      message: message,
      setMessage: setMessage,
      title: title,
      setTitle: setTitle,
      alert: alert
    }}>
          
        {props.children}
    </AlertContext.Provider>
  )
}
