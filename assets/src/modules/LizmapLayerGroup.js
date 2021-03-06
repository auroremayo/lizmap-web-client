import {MainEventDispatcher} from './LizmapGlobals.js';

// attribut selected
export default class LizmapLayerGroup {
    /**
     * @param {String} mapId
     * @param {LizmapLayer[]} layers
     * @param {Object} opt_options
     */
    constructor(mapId, layers, opt_options) {
        this._mapId = mapId;
        this._mutuallyExclusive = opt_options.mutuallyExclusive;

        this._lizmapLayers = layers;
    }

    // Make class iterable
    [Symbol.iterator]() {
        let index = -1;

        return {
            next: () => ({value: this._lizmapLayers[++index], done: !(index in this._lizmapLayers)})
        };
    }

    get layers() {
        return this._lizmapLayers;
    }

    set layerVisible(layerId) {
        for (let i = 0; i < this._lizmapLayers.length; i++) {
            // Set visibility to false when mutually exclusive
            if (this._mutuallyExclusive) {
                this._lizmapLayers[i].visible = false;
            }
            if (this._lizmapLayers[i].layerId === layerId) {
                this._lizmapLayers[i].visible = true;
            }
        }
        MainEventDispatcher.dispatch({
            type: 'map-base-layers-visibility',
            mapId: this._mapId,
            layers: this._lizmapLayers
        });
    }
}
