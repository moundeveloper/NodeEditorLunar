export class ControllPointC {
  constructor(id, type = "null", value = null, to = "") {
    this.id = id;
    this.type = type;
    this.value = value;
    this.to = to;
  }
  clearTo() {
    this.to = "";
  }
}
