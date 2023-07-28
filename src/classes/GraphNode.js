export const getGraphSourcesTargets = (links) => {
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

export const findLeftmostSourceElement = (map) => {
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
};

export const traverseGraph = (
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
