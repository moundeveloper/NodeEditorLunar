import { VariableState } from "./Node.js";
import { genId } from "../utils/utility.js";

export class InterfaceC {
  constructor(id, type = null, value = null, component = null, options = null) {
    this.id = id;
    this.type = type;
    this.value = value;
    this.component = component;
    this.options = options;
  }

  setInterfaceValue(value) {
    this.value = value;
  }
  setInterfaceType(type) {
    this.type = type;
  }
}

export class ArrayItem extends InterfaceC {
  constructor(id) {
    super(id, null, null, "ArrayItem", {
      label: "value",
      subInterfaces: [
        new InterfaceC(genId(), null, null, "DropDown", {
          label: "type",
          values: variableTypes,
        }),
        new InterfaceC(genId(), "number", 3.4, "NumberInput", {
          label: "value",
          defaultValue: 3.4,
        }),
      ],
    });

    this.states = [
      new VariableState("number", [
        new InterfaceC(genId("in"), "number", 3.4, "NumberInput", {
          label: "value",
          defaultValue: 3.4,
        }),
      ]),
      new VariableState("string", [
        new InterfaceC(genId("in"), "string", "hello", "TextInput"),
      ]),
      new VariableState("boolean", [
        new InterfaceC(genId("in"), "boolean", false, "DropDown", {
          label: "value",
          values: [true, false],
        }),
      ]),
      new VariableState("array", [
        new InterfaceC(genId("in"), "array", null, "DefaultTemplate", {
          label: "array",
        }),
      ]),
    ];

    this.setCurrentState("number");
  }
  setCurrentState(type) {
    this.getTypeInterface().type = type;
    this.type = type;

    this.options.subInterfaces = this.updateSubInterfaces(
      this.options.subInterfaces,
      this.getStateByType(type).inputs
    );
  }

  getStateByType(type) {
    return this.states.find((state) => state.type === type);
  }

  getTypeInterface() {
    return this.options.subInterfaces[0];
  }

  updateSubInterfaces(subInterfaces, newElements) {
    return [subInterfaces[0], ...newElements];
  }
}
