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
    "fill-antialias": DataConstantProperty<boolean>,
    "fill-opacity": DataDrivenProperty<number>,
    "fill-color": DataDrivenProperty<Color>,
    "fill-outline-color": DataDrivenProperty<Color>,
    "fill-translate": DataConstantProperty<[number, number]>,
    "fill-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "fill-pattern": CrossFadedProperty<string>,
|};

const paint: PaintProperties = {
    "fill-antialias": new DataConstantProperty(BooleanType, true),
    "fill-opacity": new DataDrivenProperty(NumberType, 1),
    "fill-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "fill-outline-color": new DataDrivenProperty(ColorType, undefined),
    "fill-translate": new DataConstantProperty(array(NumberType, 2), [0,0]),
    "fill-translate-anchor": new DataConstantProperty(StringType, "map"),
    "fill-pattern": new CrossFadedProperty(StringType),
};

module.exports = { paint };
