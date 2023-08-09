export class LinkC {
  constructor(id, sourceInterface, targetInterface, sourceNode, targetNode) {
    this.id = id;
    this.sourceInterface = sourceInterface;
    this.targetInterface = targetInterface;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.updateNodeValues();
  }

  // Update nodes values
  updateNodeValues() {}
}
