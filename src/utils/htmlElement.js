export const getElementByID = (id) => {
  return document.getElementById(id);
};
export const getElementPosition = (element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left, y: rect.top };
};

export const getElementPositionCentered = (element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

export const setPathDByID = (id, d) => {
  const path = document.querySelector(`#${id}`);
  path.setAttribute("d", d);
};

export const getElementPositionOffset = (id) => {
  const { element, parent, grandparent } = findGrandparentElementById(id);

  return {
    x:
      grandparent.offsetLeft +
      parent.offsetLeft +
      element.offsetLeft +
      element.clientWidth / 2,
    y:
      grandparent.offsetTop +
      parent.offsetTop +
      element.offsetTop +
      element.clientHeight / 2,
  };
};

export const findGrandparentElementById = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found.`);
    return null;
  }

  const parent = element.parentElement;
  if (!parent) {
    console.error(`Parent of element with ID '${elementId}' not found.`);
    return null;
  }

  const grandparent = parent.parentElement;
  if (!grandparent) {
    console.error(`Grandparent of element with ID '${elementId}' not found.`);
    return null;
  }

  return { element, parent, grandparent };
};
