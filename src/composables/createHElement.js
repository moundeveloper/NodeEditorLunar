import { h } from "vue";

export const createHField = (name, props) => {
  return h(name, {
    data: props.data,
    updateHandler: props.updateHandler,
  });
};
