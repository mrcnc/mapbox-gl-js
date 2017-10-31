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

export type LayoutProperties = {|
    "line-cap": DataConstantProperty<"butt" | "round" | "square">,
    "line-join": DataDrivenProperty<"bevel" | "round" | "miter">,
    "line-miter-limit": DataConstantProperty<number>,
    "line-round-limit": DataConstantProperty<number>,
|};

const layout: LayoutProperties = {
    "line-cap": new DataConstantProperty(StringType, "butt"),
    "line-join": new DataDrivenProperty(StringType, "miter"),
    "line-miter-limit": new DataConstantProperty(NumberType, 2),
    "line-round-limit": new DataConstantProperty(NumberType, 1.05),
};

export type PaintProperties = {|
    "line-opacity": DataDrivenProperty<number>,
    "line-color": DataDrivenProperty<Color>,
    "line-translate": DataConstantProperty<[number, number]>,
    "line-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "line-width": DataDrivenProperty<number>,
    "line-gap-width": DataDrivenProperty<number>,
    "line-offset": DataDrivenProperty<number>,
    "line-blur": DataDrivenProperty<number>,
    "line-dasharray": CrossFadedProperty<Array<number>>,
    "line-pattern": CrossFadedProperty<string>,
|};

const paint: PaintProperties = {
    "line-opacity": new DataDrivenProperty(NumberType, 1),
    "line-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "line-translate": new DataConstantProperty(array(NumberType, 2), [0,0]),
    "line-translate-anchor": new DataConstantProperty(StringType, "map"),
    "line-width": new DataDrivenProperty(NumberType, 1),
    "line-gap-width": new DataDrivenProperty(NumberType, 0),
    "line-offset": new DataDrivenProperty(NumberType, 0),
    "line-blur": new DataDrivenProperty(NumberType, 0),
    "line-dasharray": new CrossFadedProperty(array(NumberType)),
    "line-pattern": new CrossFadedProperty(StringType),
};

module.exports = { paint, layout };
