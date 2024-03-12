import { useEffect, useState } from "react"
import classNames from "./styles.module.scss"
import { Feature } from "ol"
import Exit from '../../../shared/icons/exitCross.svg'
import Doc from '../../../shared/icons/docImage.svg'

export const FeatureInfo = (props: { info: { opened: boolean, feature: Feature | null } | null, setContactState: Function }) => {

  const [infoArray, SetInfoArray] = useState<Array<{ name: string, num: number|string }> | undefined>()
  const [territoryName, SetTerritoryName] = useState<String>('')
  const [opened, SetOpened] = useState<boolean>(false)
  function getRandomArbitrary(min: number, max: number) {
    return (Math.random() * (max - min) + min).toFixed(0);
  }

  useEffect(() => {
    SetOpened(props.info?.opened ? props.info?.opened : false)
  }, [props.info])

  useEffect(() => {
    
    document.getElementById('infoFeatureContainer') && (document.getElementById('infoFeatureContainer')!.className = classNames.infoContainer + ' ' + (opened ? classNames.opened : ''))

  }, [opened])
  

  useEffect(() => {
    let properts = props.info?.feature?.getGeometry()?.getProperties()
    let array = []
    if (properts) {
      SetTerritoryName(properts.territory_id)
      array = [
        { name: 'Налогооблагаемая площадь', num: properts.area_tax.toFixed(0) },
        { name: 'Общая площадь', num: properts.area_total.toFixed(0) },
        { name: 'Количество построек', num: properts.count.toFixed(0) },
        { name: 'Оценка собираемого налога', num: properts.tax_extimate.toFixed(0) },
        { name: 'Будут платить налоги', num: getRandomArbitrary(70, 95)+'%' },
        { name: 'Ожидаемый доход в бюджет', num: getRandomArbitrary(1, 100) + ' тыщ мульонов' },
      ]
      SetInfoArray(array)
    }
  }, [props])

  return <>
    {<div id='infoFeatureContainer' className={classNames.infoContainer + (props.info?.opened ? ' ' + classNames.opened : '')}>
      {
        territoryName && <div className={classNames.titleContainer}>
          <div className={classNames.cityElement}>
            <p className={classNames.infoTitle}>Выбранная территория</p>
            <p className={classNames.cityTitle}> {territoryName}</p>
          </div>
          <div className={classNames.infoButtons}><p onClick={()=>props.setContactState(true, territoryName)} className={classNames.save}>Отчет</p><img className={classNames.exit} alt="close icon" src={Exit} onClick={() => SetOpened(false)} /></div>
        </div>
      }
      
      {infoArray?.map((line, i) => {
        return <div key={'line' + i} className={classNames.infoElement}> <p className={classNames.infoTitle}>{line.name}</p> <p className={classNames.infoText}>{line.num}</p><img className={classNames.docIcon  + ' ' + (opened ? '' : classNames.noneOpacity )} src={Doc} alt="decorate icon"/></div>
      })}
    </div>}
  </>

}