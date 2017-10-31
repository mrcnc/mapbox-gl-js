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
    "symbol-placement": DataConstantProperty<"point" | "line">,
    "symbol-spacing": DataConstantProperty<number>,
    "symbol-avoid-edges": DataConstantProperty<boolean>,
    "icon-allow-overlap": DataConstantProperty<boolean>,
    "icon-ignore-placement": DataConstantProperty<boolean>,
    "icon-optional": DataConstantProperty<boolean>,
    "icon-rotation-alignment": DataConstantProperty<"map" | "viewport" | "auto">,
    "icon-size": DataDrivenProperty<number>,
    "icon-text-fit": DataConstantProperty<"none" | "width" | "height" | "both">,
    "icon-text-fit-padding": DataConstantProperty<[number, number, number, number]>,
    "icon-image": DataDrivenProperty<string>,
    "icon-rotate": DataDrivenProperty<number>,
    "icon-padding": DataConstantProperty<number>,
    "icon-keep-upright": DataConstantProperty<boolean>,
    "icon-offset": DataDrivenProperty<[number, number]>,
    "icon-anchor": DataDrivenProperty<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">,
    "icon-pitch-alignment": DataConstantProperty<"map" | "viewport" | "auto">,
    "text-pitch-alignment": DataConstantProperty<"map" | "viewport" | "auto">,
    "text-rotation-alignment": DataConstantProperty<"map" | "viewport" | "auto">,
    "text-field": DataDrivenProperty<string>,
    "text-font": DataConstantProperty<Array<string>>,
    "text-size": DataDrivenProperty<number>,
    "text-max-width": DataDrivenProperty<number>,
    "text-line-height": DataConstantProperty<number>,
    "text-letter-spacing": DataDrivenProperty<number>,
    "text-justify": DataDrivenProperty<"left" | "center" | "right">,
    "text-anchor": DataDrivenProperty<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">,
    "text-max-angle": DataConstantProperty<number>,
    "text-rotate": DataDrivenProperty<number>,
    "text-padding": DataConstantProperty<number>,
    "text-keep-upright": DataConstantProperty<boolean>,
    "text-transform": DataDrivenProperty<"none" | "uppercase" | "lowercase">,
    "text-offset": DataDrivenProperty<[number, number]>,
    "text-allow-overlap": DataConstantProperty<boolean>,
    "text-ignore-placement": DataConstantProperty<boolean>,
    "text-optional": DataConstantProperty<boolean>,
|};

const layout: LayoutProperties = {
    "symbol-placement": new DataConstantProperty(StringType, "point"),
    "symbol-spacing": new DataConstantProperty(NumberType, 250),
    "symbol-avoid-edges": new DataConstantProperty(BooleanType, false),
    "icon-allow-overlap": new DataConstantProperty(BooleanType, false),
    "icon-ignore-placement": new DataConstantProperty(BooleanType, false),
    "icon-optional": new DataConstantProperty(BooleanType, false),
    "icon-rotation-alignment": new DataConstantProperty(StringType, "auto"),
    "icon-size": new DataDrivenProperty(NumberType, 1),
    "icon-text-fit": new DataConstantProperty(StringType, "none"),
    "icon-text-fit-padding": new DataConstantProperty(array(NumberType, 4), [0,0,0,0]),
    "icon-image": new DataDrivenProperty(StringType, undefined),
    "icon-rotate": new DataDrivenProperty(NumberType, 0),
    "icon-padding": new DataConstantProperty(NumberType, 2),
    "icon-keep-upright": new DataConstantProperty(BooleanType, false),
    "icon-offset": new DataDrivenProperty(array(NumberType, 2), [0,0]),
    "icon-anchor": new DataDrivenProperty(StringType, "center"),
    "icon-pitch-alignment": new DataConstantProperty(StringType, "auto"),
    "text-pitch-alignment": new DataConstantProperty(StringType, "auto"),
    "text-rotation-alignment": new DataConstantProperty(StringType, "auto"),
    "text-field": new DataDrivenProperty(StringType, ""),
    "text-font": new DataConstantProperty(array(StringType), ["Open Sans Regular","Arial Unicode MS Regular"]),
    "text-size": new DataDrivenProperty(NumberType, 16),
    "text-max-width": new DataDrivenProperty(NumberType, 10),
    "text-line-height": new DataConstantProperty(NumberType, 1.2),
    "text-letter-spacing": new DataDrivenProperty(NumberType, 0),
    "text-justify": new DataDrivenProperty(StringType, "center"),
    "text-anchor": new DataDrivenProperty(StringType, "center"),
    "text-max-angle": new DataConstantProperty(NumberType, 45),
    "text-rotate": new DataDrivenProperty(NumberType, 0),
    "text-padding": new DataConstantProperty(NumberType, 2),
    "text-keep-upright": new DataConstantProperty(BooleanType, true),
    "text-transform": new DataDrivenProperty(StringType, "none"),
    "text-offset": new DataDrivenProperty(array(NumberType, 2), [0,0]),
    "text-allow-overlap": new DataConstantProperty(BooleanType, false),
    "text-ignore-placement": new DataConstantProperty(BooleanType, false),
    "text-optional": new DataConstantProperty(BooleanType, false),
};

export type PaintProperties = {|
    "icon-opacity": DataDrivenProperty<number>,
    "icon-color": DataDrivenProperty<Color>,
    "icon-halo-color": DataDrivenProperty<Color>,
    "icon-halo-width": DataDrivenProperty<number>,
    "icon-halo-blur": DataDrivenProperty<number>,
    "icon-translate": DataConstantProperty<[number, number]>,
    "icon-translate-anchor": DataConstantProperty<"map" | "viewport">,
    "text-opacity": DataDrivenProperty<number>,
    "text-color": DataDrivenProperty<Color>,
    "text-halo-color": DataDrivenProperty<Color>,
    "text-halo-width": DataDrivenProperty<number>,
    "text-halo-blur": DataDrivenProperty<number>,
    "text-translate": DataConstantProperty<[number, number]>,
    "text-translate-anchor": DataConstantProperty<"map" | "viewport">,
|};

const paint: PaintProperties = {
    "icon-opacity": new DataDrivenProperty(NumberType, 1),
    "icon-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "icon-halo-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 0)),
    "icon-halo-width": new DataDrivenProperty(NumberType, 0),
    "icon-halo-blur": new DataDrivenProperty(NumberType, 0),
    "icon-translate": new DataConstantProperty(array(NumberType, 2), [0,0]),
    "icon-translate-anchor": new DataConstantProperty(StringType, "map"),
    "text-opacity": new DataDrivenProperty(NumberType, 1),
    "text-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 1)),
    "text-halo-color": new DataDrivenProperty(ColorType, new Color(0, 0, 0, 0)),
    "text-halo-width": new DataDrivenProperty(NumberType, 0),
    "text-halo-blur": new DataDrivenProperty(NumberType, 0),
    "text-translate": new DataConstantProperty(array(NumberType, 2), [0,0]),
    "text-translate-anchor": new DataConstantProperty(StringType, "map"),
};

module.exports = { paint, layout };
