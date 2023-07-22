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
