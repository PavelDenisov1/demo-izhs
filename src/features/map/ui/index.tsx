import React, { useRef, useEffect, useState } from 'react';
import classNames from "./styles.module.scss"
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { getMvtLayers } from './../../../shared/MvtLogicFunctios';


interface Layerfilters {
  regions: boolean,
  municipals: boolean,
  settlement: boolean,
}

export const MapModule = (props:{onLayers: Layerfilters}) => {
  const mapElement = React.useRef<HTMLInputElement>(null)
  const mapRef = useRef<Map>();
  const [tiles, setTiles] = useState<any>({
    vectorLayerRegions: {},
    vectorLayerMunicipals: {},
    vectorLayerSettlement: {},
  })

  // useEffect(() => {
  //   console.log(tiles)
    

  //   // props.onLayers.regions && mapRef.current?.addLayer(tile)
  //   // props.onLayers.municipals && mapRef.current?.addLayer(tile)
  //   // props.onLayers.settlement && mapRef.current?.addLayer(tile)
  // }, [tiles])

  function remove(map: Map, name: string) {
    map && map?.getLayers().getArray().forEach(layer =>{
      if(layer.get('name') === name) map.removeLayer(layer)
    })
  }

  function check(map: Map, name: string) {
    let need = true
    map && map?.getLayers().getArray().forEach(layer =>{
      if(layer.get('name') === name) need = false
    })
    return need
  }
  
  useEffect(() => {

    if (tiles && mapRef.current) {
      if (props.onLayers.regions && tiles.vectorLayerRegions.get)
        check(mapRef.current, 'RN_1_143') && mapRef.current.addLayer(tiles.vectorLayerRegions)
      else
        remove(mapRef.current, 'RN_1_143')

      if (props.onLayers.municipals && tiles.vectorLayerMunicipals.get)
        check(mapRef.current, 'RN_1_144') && mapRef.current.addLayer(tiles.vectorLayerMunicipals)
      else
        remove(mapRef.current, 'RN_1_144')

      if (props.onLayers.settlement && tiles.vectorLayerSettlement.get)
        check(mapRef.current, 'RN_1_145') && mapRef.current.addLayer(tiles.vectorLayerSettlement)
      else
        remove(mapRef.current, 'RN_1_145')
     }
  }, [tiles, props, mapRef])
  
  useEffect(() => {
    async function getAsyncTiles() {
      let tilesArray = await getMvtLayers()

      tilesArray.forEach(tile => {

        switch (tile.get('name')) {
          case 'RN_1_143':
            tiles.vectorLayerRegions = tile
            break;

          case 'RN_1_144':
            tiles.vectorLayerMunicipals = tile
            break;

          case 'RN_1_145':
            tiles.vectorLayerSettlement = tile
            break;

          default:
            break;
        }
        setTiles(tiles)

      })
    }
    getAsyncTiles()

  }, [tiles, props])
  
  useEffect(() => {

    if (mapElement.current && !mapRef.current) {

      const osmLayer = new TileLayer({
        preload: Infinity,
        source: new OSM(),
      })

      mapRef.current = new Map({
        target: mapElement.current ? mapElement.current : undefined,
        layers: [osmLayer],
        view: new View({
          center: [5346197.040548416, 7470999.886310182],
          zoom: 6,
        })
      });
      mapRef.current.addEventListener('click', (e)=>console.log(e))
    }
  }, [mapElement, mapRef]);


  return (
    <div ref={mapElement} className={classNames.map} />
  );

}