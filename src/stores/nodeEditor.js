export const nodeEditor = reactive({
  scale: 1,
  nodes: [],
  links: [],
  preventZooming: false,
  panningPos: { x: 0, y: 0 },
  addNode(node) {
    this.nodes.push(node);
  },
  addLink(link) {
    this.links.push(link);
  },
  getNodeById(id) {
    return this.nodes.find((node) => node.id === id);
  },
  checkSourceLink(cpId) {
    return this.links.find((link) => link.sourceInterface.id === cpId);
  },
  checkTargetLink(cpId) {
    return this.links.find((link) => link.targetInterface.id === cpId);
  },
  removeConnectedTargetLink(removeLink) {
    const path = document.getElementById(removeLink.id);
    this.links = this.links.filter((link) => {
      if (link.id !== removeLink.id) {
        return link;
      }
      link.targetNode.nodeReference.currentVariableReference =
        link.targetNode.name;
    });
    console.log("Link deleted successfully!");
    return path;
  },
  updateScale(scale) {
    this.scale = scale;
  },
  updatePanningPos(pos) {
    this.panningPos = pos;
  },
  isInterfaceConnected(interfaceC) {
    const link = this.links.find(
      (link) =>
        link.sourceInterface === interfaceC ||
        link.targetInterface === interfaceC
    );
    if (link) return true;
    return false;
  },
  findLinksConnectedToNode(targetNode) {
    const connectedLinks = [];

    for (const link of this.links) {
      if (link.sourceNode === targetNode || link.targetNode === targetNode) {
        connectedLinks.push(link);
      }
    }

    return connectedLinks;
  },
  findLinkConnectedByInterface(interfaceC) {
    const link = this.links.find(
      (link) =>
        link.sourceInterface === interfaceC ||
        link.targetInterface === interfaceC
    );
    return link;
  },
  findNodeByInterface(interfaceId) {
    const node = this.nodes.find((node) => {
      let resultNode = null;
      resultNode = node.inputs.find((input) => input.id === interfaceId);
      if (resultNode) return resultNode;

      resultNode = node.outputs.find((output) => output.id === interfaceId);
      if (resultNode) return resultNode;

      resultNode = node.options.find((option) => option.id === interfaceId);
      if (resultNode) return resultNode;
    });
    return node;
  },
  findInterfaceById(node, interfaceId) {
    if (getControllPointType(interfaceId) === "out") {
      return node.outputs.find((cp) => cp.id === interfaceId);
    } else {
      return node.inputs.find((cp) => cp.id === interfaceId);
    }
  },
});

const getControllPointType = (id) => {
  const lastDashIndex = id.lastIndexOf("-");
  const lastSubstring = id.slice(lastDashIndex + 1);
  const controllPointType = lastSubstring;

  return controllPointType;
};
