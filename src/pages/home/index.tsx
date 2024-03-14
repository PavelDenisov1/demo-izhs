import classNames from "./styles.module.scss"
import { useEffect, useState } from 'react';
// import { DeviceContext } from '../../App'
import BackIcon from './../../shared/icons/Back.svg'
import FilterIcon from '../../shared/icons/Filter.svg'
import { MapModule } from "../../features/map/ui";
import { LayersFilter } from "../../features/layers-filter";
import { FeatureInfo } from "../../features/feature-info";
import { Feature } from "ol";
import { GetContact } from "../../features/get-contact";


interface Layerfilters {
  regions: boolean,
  municipals: boolean,
  settlement: boolean,
}

export const Home = () => {
  // const isMobile = useContext(DeviceContext).mobile
  const [mapOpened, SetMapOpened] = useState(false)
  const [drawEnabled, SetDrawEnabled] = useState(false)
  const [contactOpened, SetContactOpened] = useState<boolean|string>(false)
  
  const [onLayers, SetOnLayers] = useState<Layerfilters>({
    regions: true,
    municipals: false,
    settlement: false,
  })
  const [filtersActive, SetfiltersActive] = useState<boolean>(false)
  const [objectClick, SetObjectClick] = useState<{opened: boolean, feature: Feature|null}|null>(null)
  
  function setNewActiveArray(layers:Layerfilters){
    SetOnLayers(layers)
  }

  function setObjectClick(feature:Feature|null){
    SetObjectClick({opened: true, feature: feature})
  }


  function setContactState(state:boolean, info: string|undefined){
    SetfiltersActive(false)
    SetDrawEnabled(false)
    SetObjectClick(null)
    SetContactOpened(info? info : state)
  }

  function mapButtonClick(block:boolean = false) {
    if (!mapOpened || (block && !mapOpened)) {
      SetMapOpened(true)
      setTimeout(()=>SetfiltersActive(true), 1500)
    }
    else if(!block){
      SetContactOpened(false)
      if (!drawEnabled) {
        SetOnLayers({
          regions: false,
          municipals: false,
          settlement: false,
        })

        SetDrawEnabled(true)
        SetfiltersActive(false)
      }
      else {
        SetDrawEnabled(false)
      }
    }
  }

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
              SetfiltersActive(false)
              SetDrawEnabled(false)
              SetObjectClick(null)
            }} /> : ''}
          <p className={classNames.buttonTextPadding}>ИЖС не на кадастре</p>
          {mapOpened ? <img src={FilterIcon} id='FilterIcon' className={classNames.pointer + (filtersActive?(' '+classNames.active):'')} alt="filter button" onClick={(e) => {
            SetfiltersActive(!filtersActive)
          }}
          /> : ''}
        </div>
        <div id='title' className={classNames.title}><p>Повышаем собираемость <br /> земельного налога</p></div>
        <div id='blockMap' className={classNames.blockMap}
          onClick={() => {
            mapButtonClick(true)
          }}
        >
          <div id="mapButton" className={classNames.mapButton}
            onClick={() => {
              mapButtonClick()
            }}
          >
            <p className={classNames.buttonTextPadding}>{mapOpened ? (drawEnabled?'Прекратить рисование':'Указать территорию') : 'Проверить вашу территорию'}</p>
          </div>
          <MapModule onLayers={onLayers} setMapOpened={SetMapOpened} mapOpened={mapOpened} drawEnabled={drawEnabled} setInfoBlock={setObjectClick} setContactState={setContactState}/>
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
        <FeatureInfo info={objectClick} setContactState={setContactState}/>
        <GetContact opened={contactOpened} setContactState={setContactState}/>
      </div>
    </>
  );
}



const textInfos = [
  {
    upper: 'Выгодно',
    title: 'Повышение налогооблагаемой базы',
    text: 'Находим объекты ИЖС, не стоящие на кадастровом учете, засчет которых вы сможете повысить налоговый потенциал своего региона или муниципалитета.'
  },
  {
    upper: 'Эффективно',
    title: 'Данные по вашей территории',
    text: 'Предоставим готовые наборы данных о подозрительных ИЖС в границах регионов, муниципалитетов и поселений, а так же на произвольную территорию.'
  },
  {
    upper: 'Удобно',
    title: 'Инструменты для мониторинга',
    text: 'Кроме набора данных, можем предоставить инструментарий для проведения камеральных и полевых проверок.'
  },
]