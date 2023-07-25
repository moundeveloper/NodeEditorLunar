export function generateJavaScriptCode(
  links,
  initialNode,
  nodesConnectedToMoreThanOneNode
) {
  function generateCodeDFS(node, codeMap) {
    if (codeMap.has(node)) {
      return;
    }

    const { sources, targets } = nodesConnectedToMoreThanOneNode.get(node);

    for (const sourceNode of sources) {
      generateCodeDFS(sourceNode, codeMap);
    }

    const currentNode = codeMap.get(node);
    if (!currentNode) {
      throw new Error(`Node '${node}' not found in codeMap.`);
    }

    if (currentNode.nodeType === "variable") {
      const code = `const ${
        currentNode.name
      } = ${currentNode.getVariableValue()}`;
      codeMap.set(node, { ...currentNode, code });
    } else if (currentNode.nodeType === "print") {
      const connectedSourceNode = sources.find(
        (source) => codeMap.get(source).nodeType === "variable"
      );
      if (connectedSourceNode) {
        const code = `console.log(${codeMap.get(connectedSourceNode).name})`;
        codeMap.set(node, { ...currentNode, code });
      }
    }
  }

  const codeMap = new Map();
  codeMap.set(initialNode, { ...initialNode });
  generateCodeDFS(initialNode, codeMap);

  return Array.from(codeMap.values())
    .map((node) => node.code)
    .join("\n");
}
