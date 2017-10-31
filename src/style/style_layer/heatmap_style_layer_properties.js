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
    "heatmap-radius": DataConstantProperty<number>,
    "heatmap-weight": DataDrivenProperty<number>,
    "heatmap-intensity": DataConstantProperty<number>,
    "heatmap-color": HeatmapColorProperty,
    "heatmap-opacity": DataConstantProperty<number>,
|};

const paint: PaintProperties = {
    "heatmap-radius": new DataConstantProperty(NumberType, 30),
    "heatmap-weight": new DataDrivenProperty(NumberType, 1),
    "heatmap-intensity": new DataConstantProperty(NumberType, 1),
    "heatmap-color": new HeatmapColorProperty(["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"]),
    "heatmap-opacity": new DataConstantProperty(NumberType, 1),
};

module.exports = { paint };
