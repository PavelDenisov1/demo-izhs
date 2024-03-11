import { useEffect, useState } from "react"
import classNames from "./styles.module.scss"
import User from '../../../shared/icons/user.svg'

export const GetContact = (props: { opened: boolean, setContactState: Function }) => {

  const [opened, setOpened] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  useEffect(() => {
    setOpened(props.opened)
  }, [props.opened])
  
  function send() {
    console.log(input)
    props.setContactState(false)
  }
  
  return <>{
    opened && <div className={classNames.contact}>
      <p className={classNames.contactTitle}>Настало время получить ваш отчет</p>
      <div className={classNames.formContainer}>
        <p>Мы с вами свяжемся по поводу данного отчета.</p>

        <div className={classNames.inputContainer}>
          <input className={classNames.input} onChange={(e)=>setInput(e.target.value)} placeholder="Почта или телефон" />
          <img src={User} className={classNames.user} alt="user icon"/>
        </div>

        <div className={classNames.send} onClick={()=>send()}> <p>Запросить</p> </div>
      </div>
    </div>}
  </>

}