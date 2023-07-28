export class LinkC {
  constructor(
    id,
    sourceControllPoint,
    targetControllPoint,
    sourceNode,
    targetNode
  ) {
    this.id = id;
    this.sourceControllPoint = sourceControllPoint;
    this.targetControllPoint = targetControllPoint;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.updateNodeValues();
  }

  // Update nodes values
  updateNodeValues() {
    const { originalName, currentVariableReference, variableValue } =
      this.sourceNode.nodeValue;
    this.targetNode.nodeValue = {
      originalName: this.targetNode.name,
      currentVariableReference: originalName,
      variableValue,
    };
  }
}
