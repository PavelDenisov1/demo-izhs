import { useEffect, useState } from "react"
import classNames from "./styles.module.scss"
import User from '../../../shared/icons/user.svg'

export const GetContact = (props: { opened: boolean|string, setContactState: Function }) => {

  const [opened, setOpened] = useState<boolean|string>(false)
  const [input, setInput] = useState<string>('')
  const [name, setName] = useState<string>('')
  useEffect(() => {
    setOpened(props.opened)
    //@ts-ignore
    if(typeof(props.opened.valueOf())==="string") setName(props.opened.valueOf())
  }, [props.opened])
  
  function send() {
    console.log(input)
    props.setContactState(false)
  }
  
  return <>{
    opened && <div className={classNames.contact}>
      <p className={classNames.contactTitle}>Отчет по территории <br/>{name?name:'выбранной на карте'}</p>
      <div className={classNames.formContainer}>
        <p>Оставьте свои контакты, мы свяжемся с вами</p>

        <div className={classNames.inputContainer}>
          <input className={classNames.input} onChange={(e)=>setInput(e.target.value)} placeholder="Почта или телефон" />
          <img src={User} className={classNames.user} alt="user icon"/>
        </div>

        <div className={classNames.send} onClick={()=>send()}> <p>Запросить отчет</p> </div>
      </div>
    </div>}
  </>

}