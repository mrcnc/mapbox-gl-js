// This file is generated. Edit build/generate-style-code.js, then run `node build/generate-style-code.js`.
// @flow

const {
    NumberType,
    BooleanType,
    StringType,
    ColorType,
    array
} = require('../../style-spec/expression/types');

const {
    DataConstantProperty,
    DataDrivenProperty,
    CrossFadedProperty,
    HeatmapColorProperty
} = require('../properties');

const Color = require('../../style-spec/util/color');


export type PaintProperties = {|
    "raster-opacity": DataConstantProperty<number>,
    "raster-hue-rotate": DataConstantProperty<number>,
    "raster-brightness-min": DataConstantProperty<number>,
    "raster-brightness-max": DataConstantProperty<number>,
    "raster-saturation": DataConstantProperty<number>,
    "raster-contrast": DataConstantProperty<number>,
    "raster-fade-duration": DataConstantProperty<number>,
|};

const paint: PaintProperties = {
    "raster-opacity": new DataConstantProperty(NumberType, 1),
    "raster-hue-rotate": new DataConstantProperty(NumberType, 0),
    "raster-brightness-min": new DataConstantProperty(NumberType, 0),
    "raster-brightness-max": new DataConstantProperty(NumberType, 1),
    "raster-saturation": new DataConstantProperty(NumberType, 0),
    "raster-contrast": new DataConstantProperty(NumberType, 0),
    "raster-fade-duration": new DataConstantProperty(NumberType, 300),
};

module.exports = { paint };
