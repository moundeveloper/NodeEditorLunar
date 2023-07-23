import { NodeVariableC } from "./Node.js";
import { LinkC } from "./Link.js";
import { genId } from "../utils/utility.js";
import { ControllPointC } from "./ControllPoint.js";
import { TypesEnum } from "./Types.js";

const variable = new NodeVariableC("something");
const variable2 = new NodeVariableC("crazy");

variable2.updateInputValue(10);

const convertNodeToCode = (node) => {
  if (node.nodeType === "variable") {
    const codeResult = `const ${
      node.name
    } = ${node.getVariableValue()}\nconsole.log(${node.name}+3)`;
    return codeResult;
  }
};

const parsedCode = convertNodeToCode(variable);

/* console.log(convertNodeToCode(variable)); */

const executeParsedCode = (parsedCode) => {
  new Function(parsedCode)();
};

executeParsedCode(parsedCode);
