// @flow


const assert = require('assert');
const {extend, sphericalToCartesian} = require('../util/util');
const interpolate = require('../style-spec/util/interpolate');
const {RGBAImage} = require('../util/image');

import type {Type} from '../style-spec/expression/types';
import type Color from '../style-spec/util/color';
import type {CrossFaded} from './cross_faded';
import type {ZoomHistory} from './style';

import type {
    Feature,
    GlobalProperties,
    StylePropertyExpression,
    SourceExpression,
    CompositeExpression
} from '../style-spec/expression';

type TimePoint = number;

type TransitionParameters = {
    now: TimePoint,
    transition: TransitionSpecification
};

export type EvaluationParameters = GlobalProperties & {
    now: TimePoint,
    defaultFadeDuration: number,
    zoomHistory: ZoomHistory
};

export interface Property<T, R> {
    possiblyEvaluate(value: PropertyValue<T>, parameters: EvaluationParameters): R;
    interpolate(a: R, b: R, t: number): R;
}

// function normalizeToExpression(parameters, propertySpec, name): StylePropertyExpression {
//     if (isFunction(parameters)) {
//         return createFunction(parameters, propertySpec, name);
//     } else if (isExpression(parameters)) {
//         const expression = createPropertyExpression(parameters, propertySpec);
//         if (expression.result === 'error') {
//             // this should have been caught in validation
//             throw new Error(expression.errors.map(err => `${err.key}: ${err.message}`).join(', '));
//         }
//         return expression;
//     } else {
//         if (typeof parameters === 'string' && propertySpec.type === 'color') {
//             parameters = Color.parse(parameters);
//         }
//         return {
//             result: 'constant',
//             evaluate: () => parameters
//         };
//     }
// }

class PropertyValue<T> {
    value: mixed;
    expression: StylePropertyExpression;

    constructor(value: mixed) {
        this.value = value;
    }

    isUndefined(): boolean {
        return this.value === undefined;
    }

    isDataDriven(): boolean {
        return this.expression.kind === 'source' || this.expression.kind === 'composite';
    }
}

// ------- Transitionable -------

class TransitionablePropertyValue<T, R> {
    property: Property<T, R>;
    value: PropertyValue<T>;
    transition: TransitionSpecification | void;

    constructor(property: Property<T, R>) {
        this.property = property;
        this.value = new PropertyValue(undefined);
    }

    transitioned(parameters: TransitionParameters,
                 prior: TransitioningPropertyValue<T, R>): TransitioningPropertyValue<T, R> {
        return new TransitioningPropertyValue(this.property, this.value, prior, extend({}, this.transition, parameters.transition), parameters.now);
    }

    untransitioned(): TransitioningPropertyValue<T, R> {
        return new TransitioningPropertyValue(this.property, this.value, null, {}, 0);
    }
}

type TransitionablePropertyValues<Properties: Object>
    = $Exact<$ObjMap<Properties, <T, R>(p: Property<T, R>) => TransitionablePropertyValue<T, R>>>

class Transitionable<Properties: Object> {
    _values: TransitionablePropertyValues<Properties>;

    constructor(properties: Properties) {
        const values = this._values = ({}: any);
        for (const property in properties) {
            values[property] = new TransitionablePropertyValue(properties[property]);
        }
    }

    getValue<S: string>(name: S) {
        return this._values[name].value;
    }

    setValue<S: string>(name: S, value: mixed) {
    }

    getTransition<S: string>(name: S) {
        return this._values[name].transition;
    }

    setTransition<S: string>(name: S, value: mixed) {
    }

    serialize() {
        const result: any = {};
        for (const property in this._values) {
            const value = this.getValue(property);
            if (value !== undefined) {
                result[property] = value;
            }

            const transition = this.getTransition(property);
            if (transition !== undefined) {
                result[`${property}-transition`] = transition;
            }
        }
        return result;
    }

    transitioned(parameters: TransitionParameters, prior: Transitioning<Properties>): Transitioning<Properties> {
        const result: any = {};
        for (const property in this._values) {
            result[property] = this._values[property].transitioned(parameters, prior.get(property));
        }
        return new Transitioning(result);
    }

    untransitioned(): Transitioning<Properties> {
        const result: any = {};
        for (const property in this._values) {
            result[property] = this._values[property].untransitioned();
        }
        return new Transitioning(result);
    }
}

// ------- Transitioning -------

class TransitioningPropertyValue<T, R> {
    property: Property<T, R>;
    value: PropertyValue<T>;
    prior: ?TransitioningPropertyValue<T, R>;
    begin: TimePoint;
    end: TimePoint;

    constructor(property: Property<T, R>,
                value: PropertyValue<T>,
                prior: ?TransitioningPropertyValue<T, R>,
                transition: TransitionSpecification,
                now: TimePoint) {
        this.property = property;
        this.value = value;
        this.begin = now + transition.delay || 0;
        this.end = this.begin + transition.duration || 0;
        if (transition.delay || transition.duration) {
            this.prior = prior;
        }
    }

    possiblyEvaluate(parameters: EvaluationParameters): R {
        const now = parameters.now;
        const finalValue = this.property.possiblyEvaluate(this.value, parameters);
        const prior = this.prior;
        if (!prior) {
            // No prior value.
            return finalValue;
        } else if (now > this.end) {
            // Transition from prior value is now complete.
            this.prior = null;
            return finalValue;
        } else if (this.value.isDataDriven()) {
            // Transitions to data-driven properties are not supported.
            // We snap immediately to the data-driven value so that, when we perform layout,
            // we see the data-driven function and can use it to populate vertex buffers.
            this.prior = null;
            return finalValue;
        } else if (now < this.begin) {
            // Transition hasn't started yet.
            return prior.possiblyEvaluate(parameters);
        } else {
            // Interpolate between recursively-calculated prior value and final.
            const t = (now - this.begin) / (this.end - this.begin);
            return this.property.interpolate(prior.possiblyEvaluate(parameters), finalValue, t /* TODO: DEFAULT_TRANSITION_EASE.solve(t, 0.001) */);
        }
    }
}

type TransitioningPropertyValues<Properties: Object>
    = $Exact<$ObjMap<Properties, <T, R>(p: Property<T, R>) => TransitioningPropertyValue<T, R>>>

class Transitioning<Properties: Object> {
    _values: TransitioningPropertyValues<Properties>;

    constructor(values: TransitioningPropertyValues<Properties>) {
        this._values = values;
    }

    get<S: string>(name: S): $ElementType<TransitioningPropertyValues<Properties>, S> {
        return this._values[name];
    }

    possiblyEvaluate(parameters: EvaluationParameters): PossiblyEvaluated<Properties> {
        const result: any = {};
        for (const property in this._values) {
            result[property] = this._values[property].possiblyEvaluate(parameters);
        }
        return new PossiblyEvaluated(result);
    }
}

// ------- Layout -------

type LayoutPropertyValues<Properties: Object>
    = $Exact<$ObjMap<Properties, <T, R>(p: Property<T, R>) => PropertyValue<T, R>>>

class Layout<Properties: Object> {
    _values: LayoutPropertyValues<Properties>;

    constructor(values: LayoutPropertyValues<Properties>) {
        this._values = values;
    }

    getValue<S: string>(name: S) {
        return this._values[name].value;
    }

    setValue<S: string>(name: S, value: mixed) {
    }

    serialize() {
        const result: any = {};
        for (const property in this._values) {
            const value = this.getValue(property);
            if (value !== undefined) {
                result[property] = value;
            }
        }
        return result;
    }

    possiblyEvaluate(parameters: EvaluationParameters): PossiblyEvaluated<Properties> {
        const result: any = {};
        for (const property in this._values) {
            result[property] = this._values[property].possiblyEvaluate(parameters);
        }
        return new PossiblyEvaluated(result);
    }
}

// ------- PossiblyEvaluated -------

type PossiblyEvaluatedValue<T> =
    | {kind: 'constant', value: T}
    | SourceExpression
    | CompositeExpression;

class PossiblyEvaluatedPropertyValue<T> {
    value: PossiblyEvaluatedValue<T>;

    constructor(value: PossiblyEvaluatedValue<T>) {
        this.value = value;
    }

    isConstant(): boolean {
        return this.value.kind === 'constant';
    }

    constantOr(value: T): T {
        if (this.value.kind === 'constant') {
            return this.value.value;
        } else {
            return value;
        }
    }

    evaluate(globals: GlobalProperties, feature: Feature): T {
        if (this.value.kind === 'constant') {
            return this.value.value;
        } else {
            return this.value.evaluate(globals, feature);
        }
    }
}

type PossiblyEvaluatedPropertyValues<Properties: Object>
    = $Exact<$ObjMap<Properties, <T, R>(p: Property<T, R>) => R>>

class PossiblyEvaluated<Properties: Object> {
    _values: PossiblyEvaluatedPropertyValues<Properties>;

    constructor(values: PossiblyEvaluatedPropertyValues<Properties>) {
        this._values = values;
    }

    get<S: string>(name: S): $ElementType<PossiblyEvaluatedPropertyValues<Properties>, S> {
        return this._values[name];
    }
}

class DataConstantProperty<T> implements Property<T, T> {
    type: Type;
    defaultValue: T;

    constructor(type: Type, defaultValue: T) {
        this.type = type;
        this.defaultValue = defaultValue;
    }

    possiblyEvaluate(value: PropertyValue<T>, parameters: EvaluationParameters): T {
        assert(!value.isDataDriven());
        return value.expression.evaluate(parameters);
    }

    interpolate(a: T, b: T, t: number): T {
        // TODO: typecheck
        const interp: ?(a: T, b: T, t: number) => T = (interpolate: any)[this.type.kind];
        if (interp) {
            return interp(a, b, t);
        } else {
            return a;
        }
    }
}

class DataDrivenProperty<T> implements Property<T, PossiblyEvaluatedPropertyValue<T>> {
    type: Type;
    defaultValue: T;

    constructor(type: Type, defaultValue: T) {
        this.type = type;
        this.defaultValue = defaultValue;
    }

    possiblyEvaluate(value: PropertyValue<T>, parameters: EvaluationParameters): PossiblyEvaluatedPropertyValue<T> {
        if (value.isUndefined()) {
            return new PossiblyEvaluatedPropertyValue({kind: 'constant', value: this.defaultValue});
        } else if (value.expression.kind === 'constant' || value.expression.kind === 'camera') {
            return new PossiblyEvaluatedPropertyValue({kind: 'constant', value: value.expression.evaluate(parameters)});
        } else {
            return new PossiblyEvaluatedPropertyValue(value.expression);
        }
    }

    interpolate(a: PossiblyEvaluatedPropertyValue<T>,
                b: PossiblyEvaluatedPropertyValue<T>,
                t: number): PossiblyEvaluatedPropertyValue<T> {
        if (a.value.kind !== 'constant' || b.value.kind !== 'constant') {
            return a;
        }
        // TODO: typecheck
        const interp: ?(a: T, b: T, t: number) => T = (interpolate: any)[this.type.kind];
        if (interp) {
            return new PossiblyEvaluatedPropertyValue({kind: 'constant', value: interp(a.value.value, b.value.value, t)});
        } else {
            return a;
        }
    }
}

class CrossFadedProperty<T> implements Property<T, ?CrossFaded<T>> {
    type: Type;

    constructor(type: Type) {
        this.type = type;
    }

    possiblyEvaluate(value: PropertyValue<T>, parameters: EvaluationParameters): ?CrossFaded<T> {
        if (value.isUndefined()) {
            return undefined;
        } else if (value.expression.kind === 'constant') {
            const value = value.expression.evaluate(parameters);
            return this._calculate(value, value, value, parameters);
        } else {
            assert(!value.isDataDriven());
            return this._calculate(
                value.expression.evaluate({zoom: parameters.zoom - 1.0}),
                value.expression.evaluate({zoom: parameters.zoom}),
                value.expression.evaluate({zoom: parameters.zoom + 1.0}),
                parameters);
        }
    }

    _calculate(min: T, mid: T, max: T, parameters: EvaluationParameters): ?CrossFaded<T> {
        const z = parameters.zoom;
        const fraction = z - Math.floor(z);
        const d = parameters.defaultFadeDuration;
        const t = d !== 0 ? Math.min((parameters.now - parameters.zoomHistory.lastIntegerZoomTime) / d, 1) : 1;
        return z > parameters.zoomHistory.lastIntegerZoom
            ? { from: min, to: mid, fromScale: 2, toScale: 1, t: fraction + (1 - fraction) * t }
            : { from: max, to: mid, fromScale: 0.5, toScale: 1, t: 1 - (1 - t) * fraction };
    }

    interpolate(a: ?CrossFaded<T>): ?CrossFaded<T> {
        return a;
    }
}

class HeatmapColorProperty implements Property<Color, RGBAImage> {
    defaultValue: ExpressionSpecification;

    constructor(defaultValue: ExpressionSpecification) {
        this.defaultValue = defaultValue;
    }

    possiblyEvaluate(value: PropertyValue<Color>, parameters: EvaluationParameters): RGBAImage {
        const colorRampData = new Uint8Array(256 * 4);
        const len = colorRampData.length;
        for (let i = 4; i < len; i += 4) {
            const pxColor = value.expression.evaluate(extend({heatmapDensity: i / len}, parameters));
            // the colors are being unpremultiplied because Color uses
            // premultiplied values, and the Texture class expects unpremultiplied ones
            colorRampData[i + 0] = Math.floor(pxColor.r * 255 / pxColor.a);
            colorRampData[i + 1] = Math.floor(pxColor.g * 255 / pxColor.a);
            colorRampData[i + 2] = Math.floor(pxColor.b * 255 / pxColor.a);
            colorRampData[i + 3] = Math.floor(pxColor.a * 255);
        }
        return RGBAImage.create({width: 256, height: 1}, colorRampData);
    }

    interpolate(a: RGBAImage): RGBAImage {
        return a;
    }
}

module.exports = {
    PropertyValue,
    Transitionable,
    Transitioning,
    Layout,
    PossiblyEvaluatedPropertyValue,
    PossiblyEvaluated,
    DataConstantProperty,
    DataDrivenProperty,
    CrossFadedProperty,
    HeatmapColorProperty
};
