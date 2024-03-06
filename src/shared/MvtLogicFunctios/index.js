import Hash from "../Hash";
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from 'ol/source/VectorTile';

export function unpackJSONPropertiesRecursive(properties) {
    for (let fieldName in properties) {
        if (typeof properties[fieldName] === 'string') {
            if ((("" + properties[fieldName])[0] === "{") || (("" + properties[fieldName])[0] === "[")) {
                try {
                    properties[fieldName] = JSON.parse(properties[fieldName]);
                } catch (error) {
                    console.log("unpackJSONPropertiesRecursive error", properties, fieldName, error);
                }
            }
        }
        if (typeof properties[fieldName] === 'object') {
            if (Array.isArray(properties[fieldName])) {
                for (let i = 0; i < properties[fieldName].length; i++) {
                    if (typeof properties[fieldName][i] === 'object') {
                        properties[fieldName][i] = this.unpackJSONPropertiesRecursive(properties[fieldName][i]);
                    }
                }
            }
            else {
                if ((fieldName !== "mvt_source") && (fieldName !== "mvt_layer")) {
                    properties[fieldName] = this.unpackJSONPropertiesRecursive(properties[fieldName]);
                }
            }
        }
    }
    return properties;
}




export async function getMvtLayers() {

    let response = await fetch("https://rk.geosamara.ru/mvtserver/sources.json", {
        credentials: 'same-origin',
        // mode: "no-cors",
    });
    let mvtiles = await response.json()

    let tilesArray = {
        vectorLayerRegions: mvtiles['RN_1_143'].sources,
        vectorLayerMunicipals: mvtiles['RN_1_144'].sources,
        vectorLayerSettlement: mvtiles['RN_1_145'].sources,

    }

    let vectorLayers = []

    for (let layer in tilesArray) {
        const vector = new VectorTileLayer({
            declutter: true,
            source: new VectorTileSource({
                format: new MVT(),
                url: "https://rk.geosamara.ru" + tilesArray[layer][0]?.tilesUrl,
                tileLoadFunction: (tile, url) => {
                    tile.setLoader(function (extent, resolution, projection) {
                        fetch(url).then(function (response) {
                            response.arrayBuffer().then(function (data) {
                                const format = tile.getFormat();
                                const features = format.readFeatures(data, {
                                    extent: extent,
                                    featureProjection: projection
                                });

                                features.forEach((feature) => {
                                    feature.properties = feature.properties_;
                                    feature.properties.mvt_id = feature.id || feature.id_ || feature.properties.id || feature.properties.ID || feature.properties.Id || feature.properties.objectId || feature.properties.GlobalID || Hash.SHA1(JSON.stringify(feature.properties));
                                    feature.properties.mvt_source = tilesArray[layer][0]?.originSource;
                                    feature.properties.mvt_layer = tilesArray[layer][0]?.originLayer;
                                    if (feature.properties) {
                                        feature.properties = unpackJSONPropertiesRecursive(feature.properties);
                                    }
                                });

                                tile.setFeatures(features);
                            });
                        });
                    });
                }
            }),
        });
        vector.set('name', tilesArray[layer][0]?.styleClassId)

        vectorLayers.push(vector)
    }
    return vectorLayers
}