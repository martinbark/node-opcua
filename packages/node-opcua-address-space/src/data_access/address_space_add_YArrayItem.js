"use strict";
/*jslint bitwise: true */

const _ = require("underscore");
const DataValue =  require("node-opcua-data-value").DataValue;
const Variant = require("node-opcua-variant").Variant;
const DataType = require("node-opcua-variant").DataType;
const NodeId = require("node-opcua-nodeid").NodeId;
const StatusCodes = require("node-opcua-status-code").StatusCodes;
const AttributeIds = require("node-opcua-data-model").AttributeIds;
const BaseNode = require("../base_node").BaseNode;


const part8 = require("node-opcua-data-access");

const AxisInformation = part8.AxisInformation;
const AxisScale       = part8.AxisScale;
const Range           = part8.Range;

const utils = require("node-opcua-utils");
const assert = require("node-opcua-assert");
const VariantArrayType = require("node-opcua-variant").VariantArrayType;
const coerceLocalizedText = require("node-opcua-data-model").coerceLocalizedText;


module.exports.install = function(AddressSpace) {
    /**
     *
     * @method addYArrayItem
     * @param options
     * @param options.componentOf {NodeId}
     * @param options.browseName {String}
     * @param options.title {String}
     * @param [options.instrumentRange]
     * @param [options.instrumentRange.low] {Double}
     * @param [options.instrumentRange.high] {Double}
     * @param options.engineeringUnitsRange.low {Double}
     * @param options.engineeringUnitsRange.high {Double}
     * @param options.engineeringUnits {String}
     * @param [options.nodeId = {NodeId}]
     * @param options.accessLevel
     * @param options.userAccessLevel
     * @param options.title {String}
     * @param options.axisScaleType {AxisScaleEnumeration}
     *
     * @param options.xAxisDefinition {AxisInformation}
     * @param options.xAxisDefinition.engineeringUnits {EURange}
     * @param options.xAxisDefinition.range
     * @param options.xAxisDefinition.range.low
     * @param options.xAxisDefinition.range.high
     * @param options.xAxisDefinition.title  {LocalizedText}
     * @param options.xAxisDefinition.axisScaleType {AxisScaleEnumeration}
     * @param options.xAxisDefinition.axisSteps = <null>  {Array<Double>}
     * @param options.value
     */
    AddressSpace.prototype.addYArrayItem = function (options) {

        assert(options.hasOwnProperty("engineeringUnitsRange"), "expecting engineeringUnitsRange");
        assert(options.hasOwnProperty("axisScaleType"), "expecting axisScaleType");
        assert(_.isObject(options.xAxisDefinition), "expecting a xAxisDefinition");

        const addressSpace = this;

        const YArrayItemType = addressSpace.findVariableType("YArrayItemType");
        assert(YArrayItemType, "expecting YArrayItemType to be defined , check nodeset xml file");

        const dataType = options.dataType || "Float";

        const optionals = [];
        if (options.hasOwnProperty("instrumentRange")) {
            optionals.push("InstrumentRange");
        }
        const variable = YArrayItemType.instantiate({
            componentOf: options.componentOf,
            browseName: options.browseName,
            dataType: dataType,
            optionals: optionals
        });

        function coerceAxisScale(value) {
            const ret = AxisScale.get(value);
            assert(!utils.isNullOrUndefined(ret));
            return ret;
        }

        variable.setValueFromSource(options.value, StatusCodes.Good);


        variable.euRange.setValueFromSource(new Variant({
            dataType: DataType.ExtensionObject, value: new Range(options.engineeringUnitsRange)
        }));

        if (options.hasOwnProperty("instrumentRange")) {
            variable.instrumentRange.setValueFromSource(new Variant({
                dataType: DataType.ExtensionObject, value: new Range(options.instrumentRange)
            }));
        }

        variable.title.setValueFromSource(new Variant({
            dataType: DataType.LocalizedText, value: coerceLocalizedText(options.title || "")
        }));

        // Linear/Log/Ln
        variable.axisScaleType.setValueFromSource(new Variant({
            dataType: DataType.Int32, value: coerceAxisScale(options.axisScaleType)
        }));

        variable.xAxisDefinition.setValueFromSource(new Variant({
            dataType: DataType.ExtensionObject, value: new AxisInformation(options.xAxisDefinition)
        }));

        return variable;


    };

};