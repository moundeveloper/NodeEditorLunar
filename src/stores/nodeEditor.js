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
  findLinksConnectedToNode(targetNode) {
    const connectedLinks = [];

    for (const link of this.links) {
      if (link.sourceNode === targetNode || link.targetNode === targetNode) {
        connectedLinks.push(link);
      }
    }

    return connectedLinks;
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
  updateNodeInterface(nodeId, cpId, callback) {
    const node = this.nodes.find((node) => node.id === nodeId);

    if (!node) {
      console.log("Node not found.");
      return;
    }
    let controllPoint = null;
    if (getControllPointType(cpId) === "out") {
      controllPoint = node.outputs.find((cp) => cp.id === cpId);
    } else {
      controllPoint = node.inputs.find((cp) => cp.id === cpId);
    }

    if (!controllPoint) {
      console.log("Controll-point not found.");
      return;
    }
    // Call the callback with the controll-point
    callback(controllPoint, node);
  },
});

const getControllPointType = (id) => {
  const lastDashIndex = id.lastIndexOf("-");
  const lastSubstring = id.slice(lastDashIndex + 1);
  const controllPointType = lastSubstring;

  return controllPointType;
};
