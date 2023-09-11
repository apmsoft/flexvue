import { Loader } from '@googlemaps/js-api-loader';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class GoogleMap {
    initMap(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._loadJSAPI(options);
            const mapDiv = this._getMapDiv(options);
            // Initialize the map
            const map = new google.maps.Map(mapDiv, options.mapOptions);
            return map;
        });
    }
    _getMapDiv(options) {
        // Get the div to load the map into
        let mapDiv = document.getElementById(options.divId);
        if (options.append) {
            mapDiv = this._appendMapDiv(mapDiv);
        }
        return mapDiv;
    }
    _appendMapDiv(mapDiv) {
        const appendDivId = 'google_map_appended';
        const appendDiv = document.createElement('div');
        appendDiv.setAttribute('id', appendDivId);
        mapDiv.appendChild(appendDiv);
        return appendDiv;
    }
    _loadJSAPI(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.apiOptions) {
                options.apiOptions = {};
            }
            const loaderOptions = Object.assign(options.apiOptions, { apiKey: options.apiKey });
            const loader = new Loader(loaderOptions);
            // Load the Maps JS API
            return loader.load();
        });
    }
}

export { GoogleMap };
//# sourceMappingURL=map-loader.esm.js.map
