import { useEffect, useState } from "react"
import classNames from "./styles.module.scss"

interface LayersActive {
  regions: boolean,
  municipals: boolean,
  settlement: boolean,
}

export const LayersFilter = (props: { setOpened: { opened: boolean, click: React.MouseEvent<HTMLElement> | undefined }, layersActive: LayersActive, setActive: Function }) => {

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
    let newLayerFilter: LayersActive = Object.assign({},props.layersActive)
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

  return (<>
    {props.setOpened.opened && 
      <><div id='filters' style={{top: (props.setOpened.click?.clientY ? props.setOpened.click?.clientY : 0) + 45 + 'px' }} className={classNames.filters}>
      {buttonsArray.map((button, i) => {
        return <p key={i + 'button'} onClick={() => {
          const newArr = [...buttonsArray];
          newArr.forEach((layer, i2)=>{
            if (i===i2) layer.on = !button.on
            else layer.on = false
          })
          // newArr[i].on = !button.on
          SetButtonsArray(newArr)
        }}
          className={classNames.filtersButton + ' ' + (button.on ? classNames.active : '')}>{button.name}</p>
      })
      }
    </div>
    <div style={{top: (props.setOpened.click?.clientY ? props.setOpened.click?.clientY+10 : 0) + 'px' , left: (props.setOpened.click?.clientX ? props.setOpened.click?.clientX : 0) + 'px' }} className={classNames.triangle}/>
     </>}</>
  );

}