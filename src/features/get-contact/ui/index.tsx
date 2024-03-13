import { useContext, useEffect, useState } from "react"
import classNames from "./styles.module.scss"
import User from '../../../shared/icons/user.svg'
import { sendMetricContacts } from "../../../shared/MetricApi"
import { UserContext } from "../../../App"

export const GetContact = (props: { opened: boolean|string, setContactState: Function }) => {

  const [opened, setOpened] = useState<boolean|string>(false)
  const [input, setInput] = useState<string>('')
  const [name, setName] = useState<string>('')
  const user = useContext(UserContext).user
  const id = useContext(UserContext).id
  

  useEffect(() => {
    setOpened(props.opened)
    //@ts-ignore
    if(typeof(props.opened.valueOf())==="string") setName(props.opened.valueOf())
  }, [props.opened])

  useEffect(() => {
    if(opened) window.addEventListener("click", close)
    else window.removeEventListener("click", close)
    function close(e:MouseEvent) {
      //@ts-ignore
      if (!e.target?.classList.contains('GetContact')) {
        props.setContactState(false)
        window.removeEventListener("click", close)
      }
    }
  // eslint-disable-next-line
  }, [opened])
  
  
  function send() {
    console.log(user, id)
    id && sendMetricContacts(id, input)
    props.setContactState(false)
  }
  
  return <>{
    opened && <div className={classNames.contact + ' GetContact'}>
      <p className={classNames.contactTitle + ' GetContact'}>Отчет по территории <br/>{name?name:'выбранной на карте'}</p>
      <div className={classNames.formContainer + ' GetContact'}>
        <p className="GetContact">Оставьте свои контакты, мы свяжемся с вами</p>

        <div className={classNames.inputContainer + ' GetContact'}>
          <input className={classNames.input + ' GetContact'} onChange={(e)=> setInput(e.target.value)} placeholder="Почта или телефон" />
          <img src={User} className={classNames.user + ' GetContact'} alt="user icon"/>
        </div>

        <div className={classNames.send + ' ' + ((input.length<1)?classNames.nonactive:'') + ' GetContact'} onClick={()=>input.length>0 && send()}> <p>Запросить отчет</p> </div>
      </div>
    </div>}
  </>

}