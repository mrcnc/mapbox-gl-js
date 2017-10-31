// @flow

const styleSpec = require('../style-spec/reference/latest');
const util = require('../util/util');
const Evented = require('../util/evented');
const validateStyle = require('./validate_style');
const {sphericalToCartesian} = require('../util/util');
const Color = require('../style-spec/util/color');
const interpolate = require('../style-spec/util/interpolate');

const {
    Transitionable,
    Transitioning,
    PossiblyEvaluated,
    DataConstantProperty
} = require('./properties');

const {
    NumberType,
    StringType,
    ColorType
} = require('../style-spec/expression/types');

import type {Property, PropertyValue, EvaluationParameters} from './properties';

type LightPosition = {
    x: number,
    y: number,
    z: number
};

class LightPositionProperty implements Property<[number, number, number], LightPosition> {
    defaultValue: [number, number, number];

    constructor(defaultValue: [number, number, number]) {
        this.defaultValue = defaultValue;
    }

    possiblyEvaluate(value: PropertyValue<[number, number, number]>, parameters: EvaluationParameters): LightPosition {
        return sphericalToCartesian(value.expression.evaluate(parameters));
    }

    interpolate(a: LightPosition, b: LightPosition, t: number): LightPosition {
        return {
            x: interpolate.number(a.x, b.x, t),
            y: interpolate.number(a.y, b.y, t),
            z: interpolate.number(a.z, b.z, t),
        };
    }
}

type Properties = {|
    "anchor": DataConstantProperty<"map" | "viewport">,
    "position": LightPositionProperty,
    "color": DataConstantProperty<Color>,
    "intensity": DataConstantProperty<number>,
|};

const properties: Properties = {
    "anchor": new DataConstantProperty(StringType, "viewport"),
    "position": new LightPositionProperty([1.15, 210, 30]),
    "color": new DataConstantProperty(ColorType, Color.white),
    "intensity": new DataConstantProperty(NumberType, 0.5),
};

const TRANSITION_SUFFIX = '-transition';

/*
 * Represents the light used to light extruded features.
 */
class Light extends Evented {
    _transitionable: Transitionable<Properties>;
    _transitioning: Transitioning<Properties>;
    properties: PossiblyEvaluated<Properties>;

    constructor(lightOptions?: LightSpecification) {
        super();
        this._transitionable = new Transitionable(properties);
        this.setLight(lightOptions);
    }

    getLight() {
        return this._transitionable.serialize();
    }

    setLight(options?: LightSpecification) {
        if (this._validate(validateStyle.light, options)) {
            return;
        }

        for (const name in options) {
            const value = options[name];
            if (util.endsWith(name, TRANSITION_SUFFIX)) {
                this._transitionable.setTransition(name, value);
            } else {
                this._transitionable.setValue(name, value);
            }
        }
    }

    updateTransitions(options: {transition?: boolean}, transition: TransitionSpecification) {
        if (options.transition === false) {
            this._transitioning = this._transitionable.untransitioned();
        } else {
            this._transitioning = this._transitionable.transitioned({
                now: Date.now(),
                transition
            }, this._transitioning);
        }
    }

    recalculate(parameters: EvaluationParameters) {
        this.properties = this._transitioning.possiblyEvaluate(parameters);
    }

    _validate(validate, value: mixed) {
        return validateStyle.emitErrors(this, validate.call(validateStyle, util.extend({
            value: value,
            // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/2407
            style: {glyphs: true, sprite: true},
            styleSpec: styleSpec
        })));
    }
}

module.exports = Light;
