import { useEffect, useState } from "react"
import classNames from "./styles.module.scss"

interface LayersActive {
  regions: boolean,
  municipals: boolean,
  settlement: boolean,
}

export const LayersFilter = (props: { setOpened: boolean, layersActive: LayersActive, setActive: Function }) => {

  const [top, setTop] = useState<number>(0)
  const [left, setLeft] = useState<number>(0)
  const [buttonsArray, SetButtonsArray] = useState([
    {
      name: 'Регионы',
      on: props.layersActive.regions
    },
    {
      name: 'Муниципалитеты',
      on: props.layersActive.municipals
    },
    {
      name: 'Поселения',
      on: props.layersActive.settlement
    }
  ])
  useEffect(() => {
    let newLayerFilter: LayersActive = Object.assign({}, props.layersActive)
    buttonsArray.forEach((layer) => {

      switch (layer.name) {
        case 'Регионы':
          newLayerFilter.regions = layer.on
          break;

        case 'Муниципалитеты':
          newLayerFilter.municipals = layer.on
          break;
        case 'Поселения':
          newLayerFilter.settlement = layer.on
          break;
        default:
          break;
      }

    })
    props.setActive(newLayerFilter)
    // eslint-disable-next-line
  }, [buttonsArray])

  useEffect(() => {
    let icon = document.getElementById('FilterIcon')
    if (icon) {
      icon.offsetTop && setTop(icon.offsetTop)
      icon.offsetLeft && setLeft(icon.offsetLeft + 18)
    }
  }, [props.setOpened])

  return <>
    {props.setOpened && top>0 && left>0 && 
      <>
        <div id='filters' style={{ top: top + 50 + 'px' }} className={classNames.filters}>
          {buttonsArray.map((button, i) => {
            return <p key={i + 'button'} onClick={() => {
              const newArr = [...buttonsArray];
              newArr.forEach((layer, i2) => {
                if (i === i2) layer.on = !button.on
                else layer.on = false
              })
              SetButtonsArray(newArr)
            }}
              className={classNames.filtersButton + ' ' + (button.on ? classNames.active : '')}>{button.name}</p>
          })
          }
        </div>
        <div style={{ top: top + 15 + 'px', left: left + 'px' }} className={classNames.triangle} />
      </>}
  </>

}