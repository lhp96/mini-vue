import { Foo } from "./Foo.js";
import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mousedown");
        },
      },
      [h("div", {}, "hi," + this.msg), h(Foo, { count: 1 })]
      // "hello, " + this.msg
      // [h("p", { class: "red" }, "hello"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
