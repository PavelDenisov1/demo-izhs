import React, { useRef, useEffect, useState, useContext } from 'react';
import classNames from "./styles.module.scss"
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { getMvtLayers } from './../../../shared/MvtLogicFunctios';
import Draw from 'ol/interaction/Draw';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import RegularShape from 'ol/style/RegularShape';
import Interaction from 'ol/interaction/Interaction';
import { sendMetricAction } from '../../../shared/MetricApi';
import { UserContext } from '../../../App';
import { useParams, useNavigate } from 'react-router-dom';
import { getCenterCoordinates } from '../../../shared/RKApi';
import { transform } from 'ol/proj';
import VectorTileLayer from 'ol/layer/VectorTile';

interface Layerfilters {
  regions: boolean,
  municipals: boolean,
  settlement: boolean,
}

export const MapModule = (props: { onLayers: Layerfilters, setMapOpened:Function, mapOpened: boolean, drawEnabled: boolean, setInfoBlock: Function, setContactState: Function }) => {
  const mapElement = React.useRef<HTMLInputElement>(null)
  const mapRef = useRef<Map>();
  const [tiles, setTiles] = useState<any>({
    vectorLayerRegions: {},
    vectorLayerMunicipals: {},
    vectorLayerSettlement: {},
  })
  const [draw, setDraw] = useState<Interaction | undefined>()
  const [drawLayer, setDrawLayer] = useState<VectorLayer<VectorSource> | undefined>()
  const id = useContext(UserContext).id
  let { location } = useParams();
  const [selectionLayer, setSelectionLayer] = useState<VectorTileLayer>();
  const [locations, setLocations] = useState<[]|null>(null)
  const [featureClicked, setFeatureClicked] = useState<any>(null)
  const navigate = useNavigate()
  

  let remove = (map: Map, name: string) => {
    map && map?.getLayers().getArray().forEach(layer => {
      if (layer.get('name') === name) {
        map.removeLayer(layer)
      }
    })
  }

  function stopDrawing(draw: Interaction | undefined, drawlayer: VectorLayer<VectorSource> | undefined) {
    draw && mapRef.current?.removeInteraction(draw)
    drawlayer && drawlayer.getSource()?.clear()
  }

  function check(map: Map, name: string) {
    let need = true
    map && map?.getLayers().getArray().forEach(layer => {
      if (layer.get('name') === name) need = false
    })
    return need
  }

  useEffect(() => {
    getCenterCoordinates(setLocations)
  }, [])

  useEffect(() => {
    if(locations && locations.length>0) {
      locations.forEach(loc => {
        //@ts-ignore
        if (loc.urlpart === location && mapRef.current) {
          //@ts-ignore
          mapRef.current.getView().setCenter(transform([loc.lon, loc.lat], 'EPSG:4326', 'EPSG:3857'));
           //@ts-ignore
          mapRef.current.getView().setZoom(loc.zoom)

          props.setMapOpened(true)
        }
      });
    }
  // eslint-disable-next-line
  }, [locations, location])

  useEffect(() => {
    if(featureClicked && locations) {
      locations.forEach(loc => {
         //@ts-ignore
        if(loc.name===featureClicked.getGeometry().getProperties().territory_id) navigate('/product/izhsnotcadaster/'+loc.urlpart+'/')
        // console.log(loc.name)
      })
    }
  }, [locations, featureClicked, navigate])

  useEffect(() => {
    if(featureClicked && id) {
      let title = ''
      if(featureClicked.getGeometry()) title = featureClicked.getGeometry().getProperties().territory_id
      sendMetricAction(id, 'featureClick', title)
    }
  }, [id, featureClicked])
  
  useEffect(() => {
    if (draw) {
      // mapRef.current.removeInteraction(draw)
      props.drawEnabled ? mapRef.current?.addInteraction(draw) : stopDrawing(draw, drawLayer)
    }
    // eslint-disable-next-line
  }, [props.drawEnabled])

  useEffect(() => {
    if (selectionLayer) {
      selectionLayer.changed()
    }
  }, [selectionLayer])

  useEffect(() => {

    if (tiles && mapRef.current) {
      const selectedStyle = new Style({
        stroke: new Stroke({
            width: 3,
            color: "#00FF00"
        }),
        fill: new Fill({
            color: "#00FF0020"
        })
      });

      const styleFunction = (feature: any) => {
        if(featureClicked){
          if((feature.get('level') === featureClicked.get('level'))
            && (feature.get('count') === featureClicked.get('count'))
            && (feature.get('extraTax') === featureClicked.get('extraTax'))
            && (feature.get('totalCost') === featureClicked.get('totalCost'))
            && (feature.get('totalSquare') === featureClicked.get('totalSquare'))){ 
            return selectedStyle;
          }
        }
      }

      if (props.onLayers.regions && tiles.vectorLayerRegions.get)
        check(mapRef.current, 'regions') && mapRef.current.addLayer(tiles.vectorLayerRegions)
      else{
        remove(mapRef.current, 'regions')
        setFeatureClicked(undefined)
      }

      if (props.onLayers.municipals && tiles.vectorLayerMunicipals.get)
        check(mapRef.current, 'municipalitets') && mapRef.current.addLayer(tiles.vectorLayerMunicipals)
      else{
        remove(mapRef.current, 'municipalitets')
        setFeatureClicked(undefined)
      }

      if (props.onLayers.settlement && tiles.vectorLayerSettlement.get)
        check(mapRef.current, 'settlements') && mapRef.current.addLayer(tiles.vectorLayerSettlement)
      else{
        remove(mapRef.current, 'settlements')
        setFeatureClicked(undefined)
      }

      selectionLayer?.setStyle(styleFunction)

      if(!selectionLayer){
        const newLayer = new VectorTileLayer({ 
          map: mapRef.current,
          renderMode: 'vector',
          source: tiles.vectorLayerRegions.getSource(),
          style: styleFunction
        })
        
        setSelectionLayer(newLayer)
      }
    }
  }, [tiles, props, mapRef])

  useEffect(() => {
    let layers = getMvtLayers()
    layers.forEach(layer => {
      switch (layer.get('name')) {
        case 'regions':
          tiles.vectorLayerRegions = layer
          layer.setZIndex(5)         
          break;
        case 'municipalitets':
          tiles.vectorLayerMunicipals = layer
          layer.setZIndex(5)
          break;
        case 'settlements':
          tiles.vectorLayerSettlement = layer
          layer.setZIndex(5)
          break;
        default:
          break;
      }

      setTiles(tiles)

    })
  // eslint-disable-next-line
  }, [])

  useEffect(() => {

    if (mapElement.current && !mapRef.current) {

      const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
      })

      const sourceDraw = new VectorSource({ wrapX: false });

      const vectorDraw = new VectorLayer({
        source: sourceDraw,
        zIndex: 100,
        style: new Style({
          stroke: new Stroke({
            color: "black",
            width: 3
          }),
          fill: new Fill({
            color: [255, 255, 255, 0]
          }),
        })
      });

      vectorDraw.set('name', 'draw')

      // console.log(locations, location)

      mapRef.current = new Map({
        target: mapElement.current ? mapElement.current : undefined,
        layers: [osmLayer, vectorDraw],
        view: new View({
          center: [5346197.040548416, 7470999.886310182],
          zoom: 6,
        })
      });

      mapRef.current.addEventListener('click', (e: any) => {
        
        let drawing = false
        
          e.map.getInteractions().getArray().forEach((inter:any) => {
            if(inter.get('name')==='draw') drawing = true
          });
        if (!drawing) {
          const pixel = e.map.getEventPixel(e.originalEvent);
          let features = e.map.getFeaturesAtPixel(pixel);
          if (features.length === 1) {
            setFeatureClicked(features[0])
            props.setInfoBlock(features[0])
          }
        }
      })

      let draw = new Draw({
        source: sourceDraw,
        type: "Polygon",
        freehand: true,
        style: new Style({
          stroke: new Stroke({
            color: "black",
            width: 3
          }),
          fill: new Fill({
            color: [255, 255, 255, 0]
          }),

          image: new RegularShape({
            fill: new Fill({ color: 'black' }),
            stroke: new Stroke({ color: 'black', width: 1 }),
            points: 100,
            radius: 5,
            rotation: 0,
            angle: 0
          }),
        })
      });
      draw.on('drawend', function (e) {
        props.setContactState(true)
        // const boxExtent = e.feature.getGeometry()?.getExtent();
        // console.log(boxExtent, e)
        // let arrayLayer = mapRef.current?.getAllLayers()
      });

      draw.on('drawstart', function (e) {
        sourceDraw && sourceDraw.clear()
      });

      draw.set('name', 'draw')
      setDraw(draw)
      setDrawLayer(vectorDraw)
    }
   //eslint-disable-next-line
  }, [mapElement, mapRef]);


  return (
    <div ref={mapElement} style={{pointerEvents: props.mapOpened?'unset':'none'}} className={classNames.map} />
  );

}


