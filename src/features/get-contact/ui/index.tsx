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

  useEffect(() => {
    if(opened) window.addEventListener("click", close)
    else window.removeEventListener("click", close)
    function close(e:MouseEvent) {
      console.log(e)
      //@ts-ignore
      if (!e.target?.classList.contains('contactModal')) {
        props.setContactState(false)
        window.removeEventListener("click", close)
      }
    }
  }, [opened])
  
  
  function send() {
    console.log(input)
    let ya = window.ya
    ya && ya(96713796, 'getClientID', function (clientID:number) {
      let link = 'https://rk.geosamara.ru/geosamara-demo-services/1.0.0/contact?metricID='
      link = link + clientID + '&contact=' + input
      link = link.replace('@', "%")
      console.log(clientID, link)
      fetch(link, {mode: "no-cors",method: 'POST'})
          .then(r => {
            console.log('Отправлено'); 
          })
    })
    
    props.setContactState(false)
  }
  
  return <>{
    opened && <div className={classNames.contact + ' contactModal'}>
      <p className={classNames.contactTitle + ' contactModal'}>Отчет по территории <br/>{name?name:'выбранной на карте'}</p>
      <div className={classNames.formContainer + ' contactModal'}>
        <p className="contactModal">Оставьте свои контакты, мы свяжемся с вами</p>

        <div className={classNames.inputContainer + ' contactModal'}>
          <input className={classNames.input + ' contactModal'} onChange={(e)=> setInput(e.target.value)} placeholder="Почта или телефон" />
          <img src={User} className={classNames.user + ' contactModal'} alt="user icon"/>
        </div>

        <div className={classNames.send + ' ' + ((input.length<1)?classNames.nonactive:'') + ' contactModal'} onClick={()=>input.length>0 && send()}> <p>Запросить отчет</p> </div>
      </div>
    </div>}
  </>

}