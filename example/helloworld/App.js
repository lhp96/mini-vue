import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      "hi, this is my mini-vue"
    );
  },
  setup() {
    return {
      msg: "hi, mini-vue",
    };
  },
};
