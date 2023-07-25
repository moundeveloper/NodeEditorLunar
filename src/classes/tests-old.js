import { NodeVariableC, NodePrintC } from "./Node.js";
import { LinkC } from "./Link.js";
import { genId } from "../utils/utility.js";
import {
  getMappedConnectedNodes,
  getMappedConnectedNodesSourceTarget,
} from "../utils/nodeConnections.js";
import { ControllPointC } from "./ControllPoint.js";
import { TypesEnum } from "./Types.js";

const nodeLinks = [
  new LinkC(1, "cp1", "cp2", "NodeA", "NodeB"),
  new LinkC(2, "cp3", "cp4", "NodeA", "NodeD"),
  new LinkC(3, "cp5", "cp6", "NodeB", "NodeC"),
  new LinkC(4, "cp7", "cp8", "NodeD", "NodeE"),
  new LinkC(5, "cp9", "cp10", "NodeD", "NodeG"),
  new LinkC(6, "cp11", "cp12", "NodeE", "NodeF"),
  new LinkC(7, "cp13", "cp14", "NodeG", "NodeH"),
  new LinkC(8, "cp15", "cp16", "NodeI", "NodeJ"),
  new LinkC(9, "cp17", "cp18", "NodeJ", "NodeK"),
  new LinkC(10, "cp19", "cp20", "NodeI", "NodeL"),
];

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

const convertLinkedNodesToCode = (link) => {
  const linkedNodes = [link.sourceNode, link.targetNode];
  const codeListRaw = [];
  linkedNodes.forEach((node) => {
    switch (node.nodeType) {
      case "print":
        codeListRaw.push(`console.log(${linkedNodes[0].name})`);
        break;
      case "variable":
        codeListRaw.push(`const ${node.name} = ${node.getVariableValue()}`);
        break;

      default:
        break;
    }
  });

  const codeResult = codeListRaw.join("\n");
  return codeResult;
};

const convertNodeToCode = (node) => {
  if (node.nodeType === "variable") {
    const codeResult = `const ${
      node.name
    } = ${node.getVariableValue()}\nconsole.log(${node.name}+3)`;
    return codeResult;
  }
};

const parsedCode = convertLinkedNodesToCode(link);
const parsedCode2 = convertLinkedNodesToCode(link2);

const finalCode = parsedCode + "\n" + parsedCode2;

const executeParsedCode = (parsedCode) => {
  new Function(parsedCode)();
};

/* executeParsedCode(finalCode);
 */
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
  switch (targetNode.nodeType) {
    case "print":
      codeListRaw.push(printTemplate(node.name));
      break;
    case "variable":
      codeListRaw.push(`const ${node.name} = ${targetNode.getVariableValue()}`);
      break;

    default:
      break;
  }
  console.log(codeListRaw.join("\n"));
});
