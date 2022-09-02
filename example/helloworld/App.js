import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      [h("p", { class: "red" }, "hello"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    return {
      msg: "hi, mini-vue",
    };
  },
};
