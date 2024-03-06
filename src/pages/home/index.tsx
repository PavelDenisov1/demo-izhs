import classNames from "./styles.module.scss"
import { useEffect, useState } from 'react';
// import { DeviceContext } from '../../App'
import BackIcon from './../../shared/icons/Back.svg'
import FilterIcon from '../../shared/icons/Filter.svg'
import { MapModule } from "../../features/map/ui";
import { LayersFilter } from "../../features/layers-filter";


interface OpemedFilters {
  opened: boolean, 
  click: React.MouseEvent<HTMLElement>|undefined
}
interface Layerfilters {
  regions: boolean,
  municipals: boolean,
  settlement: boolean,
}

export const Home = () => {
  // const isMobile = useContext(DeviceContext).mobile
  const [mapOpened, SetMapOpened] = useState(false)
  const [onLayers, SetOnLayers] = useState<Layerfilters>({
    regions: true,
    municipals: false,
    settlement: false,
  })
  const [filtersActive, SetfiltersActive] = useState<OpemedFilters>({opened: false,click: undefined })


  // useEffect(() => {
  //   console.log(onLayers)
  // }, [onLayers])
  
  function setNewActiveArray(layers:Layerfilters){
    SetOnLayers(layers)
  }
  // const [click, setClick] = useState<MouseEvent>()
  // useEffect(() => {
  //   window.addEventListener('click', (e)=>setClick(e))
  //   return () => {
  //     window.removeEventListener('click', (e)=>setClick(e))
  //   }
  // }, [])

  useEffect(() => {

    document.getElementById('topButton')!.className = classNames.topButton + ' ' + (mapOpened ? classNames.topButtonInMap : '')
    document.getElementById('blockMap')!.className = classNames.blockMap + ' ' + (mapOpened ? classNames.blockMapOpened : '')
    document.getElementById('title')!.className = classNames.title + ' ' + (mapOpened ? classNames.titleNone : '')
    document.getElementById('infoContainer')!.className = classNames.infoContainer + ' ' + (mapOpened ? classNames.infoContainerNone : '')
    document.getElementById('mapButton')!.className = classNames.mapButton + ' ' + (mapOpened ? classNames.mapButtonOpened : '')

  }, [mapOpened])

  return (
    <>
      <div className={classNames.contentContainer}>
        <div id='topButton' className={classNames.topButton}>
          {mapOpened ? <img src={BackIcon} className={classNames.pointer} alt="back button"
            onClick={() => {
              SetMapOpened(false)
            }} /> : ''}
          <p className={classNames.buttonTextPadding}>ИЖС не на кадастре</p>
          {mapOpened ? <img src={FilterIcon} className={classNames.pointer + (filtersActive.opened?(' '+classNames.active):'')} alt="filter button" onClick={(e) => {
            SetfiltersActive({
              opened: !filtersActive.opened,
              click: e
            })

          }}
          /> : ''}
        </div>
        <div id='title' className={classNames.title}><p>Повышаем собираемость <br /> земельного налога</p></div>
        <div id='blockMap' className={classNames.blockMap}>
          <div id="mapButton" className={classNames.mapButton}
            onClick={() => {
              !mapOpened && SetMapOpened(true)
            }}
          >
            <p className={classNames.buttonTextPadding}>{mapOpened ? 'Нарисовать фигуру' : 'Проверить вашу территорию'}</p>
          </div>
          <MapModule onLayers={onLayers}/>
        </div>
        <LayersFilter setOpened={filtersActive} layersActive={onLayers} setActive={setNewActiveArray}/>
        <div id='infoContainer' className={classNames.infoContainer}>
          {textInfos.map((article, i) => {
            return <div key={i + 'info'} className={classNames.block}>
              <p className={classNames.blockUpperText}>{article.upper}</p>
              <p className={classNames.blockTitle}>{article.title}</p>
              <p className={classNames.blockText}>{article.text}</p>
            </div>
          })
          }
        </div>
      </div>
    </>
  );
}



const textInfos = [
  {
    upper: 'Выгодно',
    title: 'Повышение налогооблагаемой базы',
    text: 'Regulatory oneven an enterprises such she and the got the did attributing and pushed. We currently have 36 active media campaigns across 24 projects.'
  },
  {
    upper: 'Эффективно',
    title: 'Регионы, муниципалитеты, поселения',
    text: 'A higher spacing and movements through an impactful email campaigns Creating a portfolio budgeting in a real time planning and phasing.'
  },
  {
    upper: 'Удобно',
    title: 'Моментальный отчет с цифрами в деньгах',
    text: 'Making a shor time up to date email campaings to achieve a real impact.Making a shor time up to date email campaings to achieve a real impact.'
  },
]