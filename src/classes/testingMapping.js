import { LinkC } from "./Link.js";
import { NodeVariableC, NodePrintC } from "./Node.js";
import { genId } from "../utils/utility.js";
import { generateJavaScriptCode } from "./something.js";
import {
  getMappedConnectedNodes,
  getMappedConnectedNodesSourceTarget,
} from "../utils/nodeConnections.js";

// Testing node links
const nodeLinks = [
  new LinkC(1, "cp1", "cp2", "NodeA", "NodeB"),
  new LinkC(2, "cp3", "cp4", "NodeA", "NodeD"),
  new LinkC(3, "cp5", "cp6", "NodeB", "NodeC"),
  new LinkC(4, "cp7", "cp8", "NodeH", "NodeD"),
  new LinkC(4, "cp7", "cp8", "NodeD", "NodeE"),
  new LinkC(5, "cp9", "cp10", "NodeD", "NodeG"),
  new LinkC(6, "cp11", "cp12", "NodeE", "NodeF"),
  new LinkC(6, "cp11", "cp12", "NodeC", "NodeI"),
];

const variable = new NodeVariableC("something");
const variable2 = new NodeVariableC("crazy");
const variable3 = new NodeVariableC("pattume");
const print = new NodePrintC();
const variable4 = new NodeVariableC("another");
const print2 = new NodePrintC();

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
  variable3.getInputControllPointId(),
  variable2,
  variable3
);

const link3 = new LinkC(
  genId(),
  variable3.getOutputControllPointId(),
  print.getInputControllPointId(),
  variable3,
  print
);

const link4 = new LinkC(
  genId(),
  variable3.getOutputControllPointId(),
  variable4.getInputControllPointId(),
  variable3,
  variable4
);
const link5 = new LinkC(
  genId(),
  variable4.getOutputControllPointId(),
  print2.getInputControllPointId(),
  variable4,
  print2
);

const links = [link, link2, link3, link4, link5];

const getGraph_old = (links) => {
  // Create an adjacency list representation of the graph
  const adjacencyList = {};

  for (const link of links) {
    const { sourceNode, targetNode } = link;

    if (!adjacencyList[sourceNode]) {
      adjacencyList[sourceNode] = [];
    }
    adjacencyList[sourceNode].push(targetNode);

    // Add target node to the list even if it doesn't have any outgoing edges
    if (!adjacencyList[targetNode]) {
      adjacencyList[targetNode] = [];
    }
  }
  return adjacencyList;
};

const getGraph = (links) => {
  // Create an adjacency list representation of the graph
  const adjacencyList = new Map();

  for (const link of links) {
    const { sourceNode, targetNode } = link;

    if (!adjacencyList.has(sourceNode)) {
      adjacencyList.set(sourceNode, []);
    }
    adjacencyList.get(sourceNode).push(targetNode);

    // Add target node to the list even if it doesn't have any outgoing edges
    if (!adjacencyList.has(targetNode)) {
      adjacencyList.set(targetNode, []);
    }
  }
  return adjacencyList;
};
const getGraphSourcesTargets = (links) => {
  // Create an adjacency list using a Map with objects containing sources and targets
  const adjacencyList = new Map();

  for (const link of links) {
    const { sourceNode, targetNode } = link;

    // Update or create an entry for the source node
    if (!adjacencyList.has(sourceNode)) {
      adjacencyList.set(sourceNode, { sources: [], targets: [] });
    }
    adjacencyList.get(sourceNode).targets.push(targetNode);

    // Update or create an entry for the target node
    if (!adjacencyList.has(targetNode)) {
      adjacencyList.set(targetNode, { sources: [], targets: [] });
    }
    adjacencyList.get(targetNode).sources.push(sourceNode);
  }

  return adjacencyList;
};

const adjacencyList = getGraphSourcesTargets(nodeLinks);

const traverseGraph = (
  nodeKey,
  adjacencyList,
  callback,
  visited = new Set()
) => {
  if (visited.has(nodeKey)) {
    // Node visited, no need to explore further
    return;
  }

  visited.add(nodeKey); // Mark the current node as visited

  const currentNode = adjacencyList.get(nodeKey);

  // Do Stuff with the currentNode here
  callback(nodeKey, currentNode, visited);

  // Traverse sources
  for (const prevNode of currentNode.sources) {
    traverseGraph(prevNode, adjacencyList, callback, visited);
  }

  // Traverse targets
  for (const nextNode of currentNode.targets) {
    traverseGraph(nextNode, adjacencyList, callback, visited);
  }
};

const variableTemplate = (name, value) => {
  if (!name || !value) return null;
  const template = `const ${name} = ${value}`;
  return template;
};
const printTemplate = (value) => {
  if (!value) return null;
  const template = `console.log(${value})`;
  return template;
};

const codeListRaw = [];

const convertNodeToCode = (node) => {
  console.log("from converting: " + JSON.stringify(node.getData()));
  const {
    name,
    value: { originalName, currentVariableReference, variableValue },
  } = node.getData();

  switch (node.nodeType) {
    case "print":
      codeListRaw.push(printTemplate(currentVariableReference));
      break;
    case "variable":
      if (currentVariableReference === name) {
        codeListRaw.push(variableTemplate(name, variableValue));
      } else {
        codeListRaw.push(variableTemplate(name, currentVariableReference));
      }
      break;

    default:
      break;
  }
};

/* traverseGraph(variable, adjacencyList, (nodeKey, currentNode, visited) => {
   convertNodeToCode(nodeKey);
});
 */
const executeParsedCode = (parsedCode) => {
  // Executes the parsed code from the linked nodes
  new Function(parsedCode)();
};

/* console.log(codeListRaw); */
/* executeParsedCode(codeListRaw.join("\n")); */

function findLeftmostSourceElement(map) {
  // Function to check if a node has sources
  function hasSources(node) {
    return map.get(node).sources.length === 0;
  }

  // Find all nodes with no sources
  const nodesWithNoSources = Array.from(map.keys()).filter(hasSources);

  // Find the leftmost node with no sources
  let leftmostNode = nodesWithNoSources[0];
  for (let i = 1; i < nodesWithNoSources.length; i++) {
    if (map.get(nodesWithNoSources[i]).targets.includes(leftmostNode)) {
      leftmostNode = nodesWithNoSources[i];
    }
  }

  return leftmostNode;
}

console.log(adjacencyList);
console.log(findLeftmostSourceElement(adjacencyList));
