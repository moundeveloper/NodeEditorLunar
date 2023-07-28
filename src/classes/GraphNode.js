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
