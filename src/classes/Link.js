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
    const { originalName, currentVariableValue, variableValue } =
      this.sourceNode.nodeValue;
    this.targetNode.nodeValue = {
      originalName: this.targetNode.name,
      currentVariableValue: originalName,
      variableValue,
    };
  }
}
