import { ControllPointC } from "./ControllPoint.js";
import { genId } from "../utils/utility.js";
import { TypesEnum } from "./Types.js";

export class NodeC {
  nodeType;
  constructor(name, inputs = [], outputs = [], fields = []) {
    this.id = genId();
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.fields = fields;
  }
}

export class NodeVariableC extends NodeC {
  constructor(name) {
    super(
      name,
      [new ControllPointC(genId("in"))],
      [new ControllPointC(genId("out"), TypesEnum.Number)]
    );
    super.nodeType = "variable";
    this.variableType = TypesEnum.Number;
    this.nodeValue = {
      originalName: this.name,
      currentVariableValue: 4,
      variableValue: 4,
    };
  }
  getInputControllPointId() {
    const [input] = this.inputs;
    return input.id;
  }
  getOutputControllPointId() {
    const [output] = this.outputs;
    return output.id;
  }
  getVariableType() {
    return this.variableType;
  }
  getData() {
    // Update return value & and return updated value
    return { name: this.name, value: this.nodeValue };
  }
}

export class NodePrintC extends NodeC {
  constructor() {
    super("print", [new ControllPointC(genId("in"))]);
    super.nodeType = "print";
    this.nodeValue = null;
  }
  getInputControllPointId() {
    const [input] = this.inputs;
    return input.id;
  }
  getData() {
    // Update return value & and return updated value
    return { name: this.name, value: this.nodeValue };
  }
}
