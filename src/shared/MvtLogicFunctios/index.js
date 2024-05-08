import MVT from 'ol/format/MVT.js';
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from 'ol/source/VectorTile';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';


export function getMvtLayers() {

    let defaultStyle = new Style({
        stroke: new Stroke({
            color: "#6666F9",
            width: 1
        }),
        fill: new Fill({
            color: [255, 255, 255, 0.5]
        }),
    });

    let tilesArray = {
        vectorLayerRegions: {
            tilesUrl: "https://rk.geosamara.ru/mvtserver/RN_1_143/{z}/{x}/{y}.pbf",
            name: 'regions',
            style: (p) => {            
                return (p.properties_.level === 1)&&(p.properties_.count > 0) ? defaultStyle : null;
            }
        },
        vectorLayerMunicipals: {
            tilesUrl: "https://rk.geosamara.ru/mvtserver/RN_1_143/{z}/{x}/{y}.pbf",
            name: 'municipalitets',
            style: (p) => {
                return (p.properties_.level === 2)&&(p.properties_.count > 0) ? defaultStyle : null;
            }
        },
        vectorLayerSettlement: {
            tilesUrl: "https://rk.geosamara.ru/mvtserver/RN_1_143/{z}/{x}/{y}.pbf",
            name: 'settlements',
            style: (p) => {
                return (p.properties_.level === 3)&&(p.properties_.count > 0) ? defaultStyle : null;
            }
        }
    }

    let vectorLayers = [];

    for (let layer in tilesArray) {
        const vector = new VectorTileLayer({
            declutter: true,
            source: new VectorTileSource({
                format: new MVT(),
                url: tilesArray[layer].tilesUrl,
            }),
        });
        vector.set('name', tilesArray[layer].name)
        vector.setStyle(tilesArray[layer].style || defaultStyle)
        vectorLayers.push(vector)
    }
    return vectorLayers
}