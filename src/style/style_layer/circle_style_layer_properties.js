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
    "circle-radius": DataDrivenProperty<number>,
    "circle-color": DataDrivenProperty<Color>,
    "circle-blur": DataDrivenProperty<number>,
    "circle-opacity": DataDrivenProperty<number>,
    "circle-translate": DataConstantProperty<[number, number]>,
    "circle-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "circle-pitch-scale": DataConstantProperty<"map" | "viewport">,
    "circle-pitch-alignment": DataConstantProperty<"map" | "viewport">,
    "circle-stroke-width": DataDrivenProperty<number>,
    "circle-stroke-color": DataDrivenProperty<Color>,
    "circle-stroke-opacity": DataDrivenProperty<number>,
|};

const paint: PaintProperties = {
    "circle-radius": new DataDrivenProperty(NumberType, 5),
    "circle-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "circle-blur": new DataDrivenProperty(NumberType, 0),
    "circle-opacity": new DataDrivenProperty(NumberType, 1),
    "circle-translate": new DataConstantProperty(array(NumberType, 2), [0,0]),
    "circle-translate-anchor": new DataConstantProperty(StringType, "map"),
    "circle-pitch-scale": new DataConstantProperty(StringType, "map"),
    "circle-pitch-alignment": new DataConstantProperty(StringType, "viewport"),
    "circle-stroke-width": new DataDrivenProperty(NumberType, 0),
    "circle-stroke-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "circle-stroke-opacity": new DataDrivenProperty(NumberType, 1),
};

module.exports = { paint };
