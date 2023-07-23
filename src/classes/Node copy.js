export class NodeC {
  processFunction;

  constructor(id, name, value, inputs, outputs) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.inputs = inputs;
    this.outputs = outputs;
  }

  setProcess(fun) {
    this.processFunction = fun;
  }

  runProcess() {
    this.value = this.processFunction(this.value);
    return this.value;
  }

  getControllPointById(id) {
    const lastDashIndex = id.lastIndexOf("-");
    const lastSubstring = inputString.slice(lastDashIndex + 1);
    const controllPointType = lastSubstring;

    return controllPointType;
  }
}

class NodeCVariable extends NodeC {
  constructor(id, name, value, inputs, outputs) {
    super(id, name, value, inputs, outputs);
    this.nodeType = "Variable"; // Additional property to identify the node type
  }
}

const variable = new NodeCVariable("dsadasdasdasewq-in", "add", 23);
variable.setProcess((value) => {
  return value + 5;
});

console.log(variable.runProcess());
