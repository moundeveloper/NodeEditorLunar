import { reactive } from "vue";

export const nodeEditor = reactive({
  scale: 1,
  nodes: [],
  links: [],
  panningPos: { x: 0, y: 0 },
  addNode(node) {
    this.nodes.push(node);
  },
  addLink(link) {
    this.links.push(link);
  },
  checkSourceLink(cpId) {
    return this.links.find((link) => link.sourceNode === cpId);
  },
  checkTargetLink(cpId) {
    return this.links.find((link) => link.targetNode === cpId);
  },
  removeConnectedTargetControllPoint(removeLink, pathWraper) {
    const path = document.getElementById(removeLink.id);
    pathWraper.removeChild(path);
    this.links = this.links.filter((link) => link.id !== removeLink.id);
    console.log("Link deleted successfully!");
  },
  updateScale(scale) {
    this.scale = scale;
  },
  updatePanningPos(pos) {
    this.panningPos = pos;
  },
  updateNodeControllPoint(nodeId, cpId, callback) {
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
    callback(controllPoint);
  },
});

const getControllPointType = (id) => {
  const lastDashIndex = id.lastIndexOf("-");
  const lastSubstring = id.slice(lastDashIndex + 1);
  const controllPointType = lastSubstring;

  return controllPointType;
};
