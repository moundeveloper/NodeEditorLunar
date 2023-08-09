import { NodeVariableC, NodePrintC } from "./Node.js";
import { LinkC } from "./Link.js";
import { genId } from "../utils/utility.js";

const billy = new NodeVariableC("billy");
billy.position.x = 800;
billy.position.y = 200;
const frank = new NodeVariableC("frank");
frank.position.x = 400;
frank.position.y = 400;
const joel = new NodeVariableC("joel");
joel.position.x = 40;
joel.position.y = 40;

console.log(billy);
