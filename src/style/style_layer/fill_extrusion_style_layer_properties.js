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
    "fill-extrusion-opacity": DataConstantProperty<number>,
    "fill-extrusion-color": DataDrivenProperty<Color>,
    "fill-extrusion-translate": DataConstantProperty<[number, number]>,
    "fill-extrusion-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "fill-extrusion-pattern": CrossFadedProperty<string>,
    "fill-extrusion-height": DataDrivenProperty<number>,
    "fill-extrusion-base": DataDrivenProperty<number>,
|};

const paint: PaintProperties = {
    "fill-extrusion-opacity": new DataConstantProperty(NumberType, 1),
    "fill-extrusion-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "fill-extrusion-translate": new DataConstantProperty(array(NumberType, 2), [0,0]),
    "fill-extrusion-translate-anchor": new DataConstantProperty(StringType, "map"),
    "fill-extrusion-pattern": new CrossFadedProperty(StringType),
    "fill-extrusion-height": new DataDrivenProperty(NumberType, 0),
    "fill-extrusion-base": new DataDrivenProperty(NumberType, 0),
};

module.exports = { paint };
