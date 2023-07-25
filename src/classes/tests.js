import { NodeVariableC, NodePrintC } from "./Node.js";
import { LinkC } from "./Link.js";
import { genId } from "../utils/utility.js";
import {
  getMappedConnectedNodes,
  getMappedConnectedNodesSourceTarget,
} from "../utils/nodeConnections.js";
import { ControllPointC } from "./ControllPoint.js";
import { TypesEnum } from "./Types.js";

const variable = new NodeVariableC("something");
const variable2 = new NodeVariableC("crazy");
variable2.updateInputValue(variable.getVariableValue());
const print = new NodePrintC();

const link = new LinkC(
  genId(),
  variable.getOutputControllPointId(),
  variable2.getInputControllPointId(),
  variable,
  variable2
);

const link2 = new LinkC(
  genId(),
  variable2.getOutputControllPointId(),
  print.getInputControllPointId(),
  variable2,
  print
);

const links = [link, link2];

const executeParsedCode = (parsedCode) => {
  // Executes the parsed code from the linked nodes
  new Function(parsedCode)();
};

const variableTemplate = (name, value) => {
  if (!name || !value) return null;
  const template = `const ${name} = ${value}`;
  return template;
};
const printTemplate = (value) => {
  if (!value) return null;
  const template = `print(${value})`;
  return template;
};

const connectedNodesMap = getMappedConnectedNodesSourceTarget(links);

connectedNodesMap.forEach((connectedNodesArray, node) => {
  const codeListRaw = [];
  const sourceNode = connectedNodesArray.sources[0];
  const targetNode = connectedNodesArray.targets[0];

  // Source nodes
  if (connectedNodesArray.sources.length) {
    switch (sourceNode.nodeType) {
      case "print":
        codeListRaw.push(printTemplate(sourceNode.name));
        break;
      case "variable":
        codeListRaw.push(
          `const ${sourceNode.name} = ${sourceNode.getVariableValue()}`
        );
        break;

      default:
        break;
    }
  }
  // Node in between
  switch (node.nodeType) {
    case "print":
      codeListRaw.push(printTemplate(targetNode.name));
      break;
    case "variable":
      codeListRaw.push(`const ${node.name} = ${sourceNode.name}`);
      break;

    default:
      break;
  }
  // Target nodes
  if (connectedNodesArray.targetNode.length) {
    switch (targetNode.nodeType) {
      case "print":
        codeListRaw.push(printTemplate(node.name));
        break;
      case "variable":
        codeListRaw.push(
          `const ${node.name} = ${targetNode.getVariableValue()}`
        );
        break;

      default:
        break;
    }
  }

  console.log(codeListRaw.join("\n"));
});
