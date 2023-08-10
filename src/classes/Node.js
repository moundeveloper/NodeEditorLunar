import { genId } from "../utils/utility.js";
import { ArrayItem, InterfaceC } from "./Interface.js";
import { TypesEnum, variableTypes } from "./Types.js";
export class NodeC {
  nodeType;
  constructor(
    name,
    inputs = [],
    outputs = [],
    options = [],
    position = { x: 0, y: 0 }
  ) {
    this.id = genId();
    this.name = name;
    this.inputs = inputs;
    this.outputs = outputs;
    this.options = options;
    this.position = position;
  }

  addInputInterface(newInterface) {
    this.inputs.push(newInterface);
  }
  addOutputInterface(newInterface) {
    this.outputs.push(newInterface);
  }
  addOptionInterface(newInterface) {
    this.options.push(newInterface);
  }

  setInterfaceInputValue(id, newValue) {
    const input = this.inputs.find((input) => input.id === id);
    if (input) {
      input.value = newValue;
    }
  }
  setInterfaceOutputType(id, newType) {
    const output = this.outputs.find((output) => output.id === id);
    if (output) {
      output.type = newType;
    }
  }
  getInterfaceOutputType(id) {
    const output = this.outputs.find((output) => output.id === id);
    return output;
  }
  getInterfaceInputValue(id) {
    const input = this.inputs.find((input) => input.id === id);
    return input;
  }
}

export class VariableState {
  constructor(type, inputs) {
    this.type = type;
    this.inputs = inputs;
  }
}

export class NodeVariableC extends NodeC {
  constructor(name) {
    super(name);
    this.nodeType = "variable";
    this.variableType = TypesEnum.Number;
    this.variableBehaviour = "const";
    this.addOutputInterface(
      new InterfaceC(genId("out"), "number", null, "DropDown", {
        label: "type",
        values: variableTypes,
      })
    );
    this.addOptionInterface(
      new InterfaceC(genId(), null, null, "DropDown", {
        label: "behaviour",
        values: ["const", "let"],
      })
    );
    this.states = [
      new VariableState("number", [
        new InterfaceC(genId("in"), "number", 3.4, "NumberInput", {
          label: "value",
          defaultValue: 3.4,
        }),
      ]),
      new VariableState("string", [
        new InterfaceC(genId("in"), "string", "hello", "TextInput"),
      ]),
      new VariableState("boolean", [
        new InterfaceC(genId("in"), "boolean", false, "DropDown", {
          label: "value",
          values: [true, false],
        }),
      ]),
      new VariableState("array", [
        new InterfaceC(genId("in"), "array", null, "DefaultTemplate", {
          label: "array",
        }),
        new ArrayItem(genId("in")),
      ]),
    ];
    this.setCurrentState("number");
    this.nodeReference = {
      originalName: this.name,
      currentVariableReference: this.name,
    };
  }
  setCurrentState(type) {
    this.getOutputInterface().type = type;
    this.inputs = this.getStateByType(type).inputs;
  }
  getStateByType(type) {
    return this.states.find((state) => state.type === type);
  }
  getOutputInterface() {
    return this.outputs[0];
  }
  getVariableType() {
    return this.outputs[0].type;
  }

  getData() {
    // Update return value & and return updated value
    return {
      variableBehaviour: this.variableBehaviour,
      name: this.name,
      value: this.nodeValue,
    };
  }
}

export class NodePrintC extends NodeC {
  constructor() {
    super("print", [new InterfaceC(genId("in"))]);
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

export class NodeFuncC extends NodeC {
  constructor() {
    super(
      "add",
      [new InterfaceC(genId("in")), new InterfaceC(genId("in"))],
      [new InterfaceC(genId("out"))]
    );
    super.nodeType = "function";
    this.nodeValue = {
      originalName: this.name,
      currentVariableReference: this.name,
      variableValue: 4,
    };
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
