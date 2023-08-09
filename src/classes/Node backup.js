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

  addInputInterface(type = null, value = null) {
    const newInterface = new InterfaceC(genId("in"), type, value);
    this.inputs.push(newInterface);
  }
  addOutputInterface(type = null, value = null) {
    const newInterface = new InterfaceC(genId("out"), type, value);
    this.outputs.push(newInterface);
  }
  addOptions(type = null, value = null) {
    const newInterface = new InterfaceC(genId(), type, value);
    this.inputs.push(newInterface);
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

export class NodeVariableC extends NodeC {
  constructor(name) {
    super(name);
    this.addInputInterface("number", 3.2);

    this.nodeType = "variable";
    this.variableType = TypesEnum.Number;
    this.variableBehaviour = "const";
    this.nodeReference = {
      originalName: this.name,
      currentVariableReference: this.name,
    };
  }
  addInputInterfaceArray(type = null, value = null) {
    const newInterface = new InterfaceC(genId("in"), type, value);
    this.inputs.unshift(newInterface);
  }

  getOutputInterface() {
    return this.outputs[0];
  }
  getVariableType() {
    return this.variableType;
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
