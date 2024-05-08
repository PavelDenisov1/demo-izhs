import { useContext, useEffect, useState } from "react"
import classNames from "./styles.module.scss"
import { Feature } from "ol"
import Exit from '../../../shared/icons/exitCross.svg'
import Doc from '../../../shared/icons/docImage.svg'
import { UserContext } from "../../../App"
import { sendMetricAction } from "../../../shared/MetricApi"

export const FeatureInfo = (props: { info: { opened: boolean, feature: Feature | null } | null, setContactState: Function }) => {

  const [infoArray, SetInfoArray] = useState<Array<{ name: string, num: number | string, unit: string }> | undefined>()
  const [territoryName, SetTerritoryName] = useState<string>('')
  const [opened, SetOpened] = useState<boolean>(false)
  const id = useContext(UserContext).id
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
      let caption = (properts.level === 2) ? properts.municipalitet :
        (properts.level === 3) ? properts.settlement : properts.region;

      SetTerritoryName(caption)

      array = [
        { name: 'Количество нарушений', num: (properts.count || 0).toFixed(0), unit: "шт" },
        { name: 'Общая площадь', num: (properts.totalSquare || 0).toFixed(0), unit: "м²" },
        { name: 'Налогооблагаемая площадь', num: (properts.taxSquare || 0).toFixed(0), unit: "м²" },
        { name: 'Оценка общей кадастровой стоимости', num: (properts.totalCost / 1000000 || 0).toFixed(0), unit: "млн.руб." },
        { name: 'Оценка дополнительного налога', num: (properts.totalTax / 1000000 || 0).toFixed(3), unit: "млн.руб/год" }
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
          <div className={classNames.infoButtons}><p onClick={() => {
            props.setContactState(true, territoryName)
            id && sendMetricAction(id, 'saveButtonClick', territoryName)
          }} className={classNames.save}>Отчет</p><img className={classNames.exit} alt="close icon" src={Exit} onClick={() => SetOpened(false)} /></div>
        </div>
      }

      {infoArray?.map((line, i) => {
        return <div key={'line' + i} className={classNames.infoElement}>
          <p className={classNames.infoTitle}>{line.name}</p>
          <p className={classNames.infoText}>{line.num + (line.unit ? " " + line.unit : "")}</p>
          <img className={classNames.docIcon + ' ' + (opened ? '' : classNames.noneOpacity)} src={Doc} alt="decorate icon" />
        </div>
      })}
    </div>}
  </>

}