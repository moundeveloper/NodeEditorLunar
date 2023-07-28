const variableTemplate = (keyword, name, value) => {
  if (!name || !value) return null;
  const template = `${keyword} ${name} = ${value}`;
  return template;
};
const printTemplate = (value) => {
  if (!value) return null;
  const template = `console.log(${value})`;
  return template;
};

export const convertNodeToCode = (node, codeListRaw) => {
  const {
    variableBehaviour,
    name,
    value: { originalName, currentVariableReference, variableValue },
  } = node.getData();

  console.log(node.getData());
  switch (node.nodeType) {
    case "print":
      codeListRaw.push(printTemplate(currentVariableReference));
      break;
    case "variable":
      if (currentVariableReference === name) {
        codeListRaw.push(
          variableTemplate(variableBehaviour, name, variableValue)
        );
      } else {
        codeListRaw.push(
          variableTemplate(variableBehaviour, name, currentVariableReference)
        );
      }
      break;

    default:
      break;
  }
};

export const executeParsedCode = (parsedCode) => {
  // Executes the parsed code from the linked nodes
  new Function(parsedCode)();
};
