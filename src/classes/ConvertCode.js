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
  // Store the original console.log function
  const originalConsoleLog = console.log;

  // Variable to capture the output
  let capturedOutput = "";

  // Replace console.log with a custom function that captures the output
  console.log = (...args) => {
    capturedOutput += args.map((arg) => String(arg)).join(" ") + "\n";
  };

  // Execute the parsed code
  const result = new Function(parsedCode)();

  // Restore the original console.log function
  console.log = originalConsoleLog;

  // Return the captured output as a string
  return capturedOutput;
};
