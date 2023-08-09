export class InterfaceC {
  constructor(id, type = null, value = null, component = null, options = null) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.component = component;
    this.options = options;
  }

  setInterfaceValue(value) {
    this.value = value;
  }
  setInterfaceType(type) {
    this.type = type;
  }
}
