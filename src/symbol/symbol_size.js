// @flow

const interpolate = require('../style-spec/util/interpolate');
const util = require('../util/util');

import type {PropertyValue, PossiblyEvaluatedPropertyValue} from '../style/properties';

module.exports = {
    getSizeData,
    evaluateSizeForFeature,
    evaluateSizeForZoom
};

export type SizeData = {
    functionType: 'constant',
    layoutSize: number
} | {
    functionType: 'camera',
    layoutSize: number,
    coveringZoomRange: [number, number],
    coveringStopValues: [number, number]
} | {
    functionType: 'source'
} | {
    functionType: 'composite',
    coveringZoomRange: [number, number]
};

// For {text,icon}-size, get the bucket-level data that will be needed by
// the painter to set symbol-size-related uniforms
function getSizeData(tileZoom: number, value: PropertyValue<number>): SizeData {
    if (value.expression.kind === 'constant') {
        return {
            functionType: 'constant',
            layoutSize: value.expression.evaluate({zoom: tileZoom + 1})
        };
    } else if (value.expression.kind === 'source') {
        return {
            functionType: 'source'
        };
    } else {
        // calculate covering zoom stops for zoom-dependent values
        const levels = value.expression.zoomStops;

        let lower = 0;
        while (lower < levels.length && levels[lower] <= tileZoom) lower++;
        lower = Math.max(0, lower - 1);
        let upper = lower;
        while (upper < levels.length && levels[upper] < tileZoom + 1) upper++;
        upper = Math.min(levels.length - 1, upper);

        const coveringZoomRange: [number, number] = [levels[lower], levels[upper]];

        if (value.expression.kind === 'composite') {
            return {
                functionType: 'composite',
                coveringZoomRange
            };
        } else {
            // for camera functions, also save off the function values
            // evaluated at the covering zoom levels
            return {
                functionType: 'camera',
                layoutSize: value.expression.evaluate({zoom: tileZoom + 1}),
                coveringZoomRange,
                coveringStopValues: [
                    value.expression.evaluate({zoom: levels[lower]}),
                    value.expression.evaluate({zoom: levels[upper]})
                ]
            };
        }
    }
}

function evaluateSizeForFeature(sizeData: SizeData,
                                partiallyEvaluatedSize: { uSize: number, uSizeT: number },
                                symbol: { lowerSize: number, upperSize: number}) {
    const part = partiallyEvaluatedSize;
    if (sizeData.functionType === 'source') {
        return symbol.lowerSize / 10;
    } else if (sizeData.functionType === 'composite') {
        return interpolate.number(symbol.lowerSize / 10, symbol.upperSize / 10, part.uSizeT);
    } else {
        return part.uSize;
    }
}

function evaluateSizeForZoom(sizeData: SizeData,
                             tr: { zoom: number },
                             currentValue: PossiblyEvaluatedPropertyValue<number>) {
    const sizeUniforms = {};
    if (sizeData.functionType === 'composite') {
        const t = currentValue.interpolationFactor(
            tr.zoom,
            sizeData.coveringZoomRange[0],
            sizeData.coveringZoomRange[1]);
        sizeUniforms.uSizeT = util.clamp(t, 0, 1);
    } else if (sizeData.functionType === 'camera') {
        // Even though we could get the exact value of the camera function
        // at z = tr.zoom, we intentionally do not: instead, we interpolate
        // between the camera function values at a pair of zoom stops covering
        // [tileZoom, tileZoom + 1] in order to be consistent with this
        // restriction on composite functions
        const t = currentValue.interpolationFactor(
            tr.zoom,
            sizeData.coveringZoomRange[0],
            sizeData.coveringZoomRange[1]);

        const lowerValue = sizeData.coveringStopValues[0];
        const upperValue = sizeData.coveringStopValues[1];
        sizeUniforms.uSize = lowerValue + (upperValue - lowerValue) * util.clamp(t, 0, 1);
    } else if (sizeData.functionType === 'constant') {
        sizeUniforms.uSize = sizeData.layoutSize;
    }
    return sizeUniforms;
}
