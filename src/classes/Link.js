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
    if (
      (this.targetNode.variableType === this.sourceNode.variableType) ===
      "variable"
    ) {
      if (this.targetNode.variableType !== this.sourceNode.variableType) {
        console.log(
          "Variable types do not match so the value will not be updated!"
        );
        return;
      }
    }
    if (!this.sourceNode.nodeValue) {
      this.targetNode.nodeValue = this.sourceNode.nodeValue;
      return;
    }

    const { originalName, currentVariableValue, variableValue } =
      this.sourceNode.nodeValue;
    this.targetNode.nodeValue = {
      originalName: this.targetNode.name,
      currentVariableValue: originalName,
      variableValue,
    };
  }
}
