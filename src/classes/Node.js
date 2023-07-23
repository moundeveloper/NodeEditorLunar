import { ControllPointC } from "./ControllPoint.js";
import { genId } from "../utils/utility.js";
import { TypesEnum } from "./Types.js";

export class NodeC {
  nodeType;
  constructor(name, inputs, outputs, fields = []) {
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
      [new ControllPointC(genId("in"), TypesEnum.Number, 4)],
      [new ControllPointC(genId("out"), TypesEnum.Number, 4)]
    );
    super.nodeType = "variable";
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
    const [output] = this.outputs;
    return output.type;
  }
  getVariableValue() {
    // Update return value & and return updated value
    const [input] = this.inputs;
    const [output] = this.outputs;
    output.value = input.value;
    return output.value;
  }
  setVariableType(newType) {
    const [output] = this.outputs;
    output.type = newType;
    return output.type;
  }
  updateInputValue(newValue) {
    if (typeof newValue !== this.getVariableType()) {
      console.log(
        "The provided value does not match the type of the variable."
      );
      return;
    }
    const [input] = this.inputs;
    input.value = newValue;
    return input.value;
  }
}
