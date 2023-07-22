import { genId } from "../utils/utility";

export class LinkC {
  constructor(id, sourceNode, targetNode, controllPoints) {
    this.id = id;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.controllPoints = controllPoints;
  }

  processNodeValue() {
    this.targetNode.value = this.sourceNode.runProcess();
  }
}
