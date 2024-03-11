import MVT from 'ol/format/MVT.js';
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from 'ol/source/VectorTile';


export function getMvtLayers() {

    let tilesArray = {
        vectorLayerRegions: {
            tilesUrl: "https://rk.geosamara.ru/mvtserver/RN_1_143/{z}/{x}/{y}.pbf",
            name: 'RN_1_143'
        },
        vectorLayerMunicipals: {
            tilesUrl: "https://rk.geosamara.ru/mvtserver/RN_1_144/{z}/{x}/{y}.pbf",
            name: 'RN_1_144'
        },
        vectorLayerSettlement: {
            tilesUrl: "https://rk.geosamara.ru/mvtserver/RN_1_145/{z}/{x}/{y}.pbf",
            name: 'RN_1_145'
        }
    }

    let vectorLayers = []

    for (let layer in tilesArray) {
        const vector = new VectorTileLayer({
            declutter: true,
            source: new VectorTileSource({
                format: new MVT(),
                url: tilesArray[layer].tilesUrl,
            }),
        });
        vector.set('name', tilesArray[layer].name)
        vectorLayers.push(vector)
    }
    return vectorLayers
}