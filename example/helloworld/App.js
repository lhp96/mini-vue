import { Foo } from "./Foo.js";
import { h, createTextVNode } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("h1", {}, `header is ${age} 岁`),
          createTextVNode("你好！"),
        ],
        footer: () => h("h1", {}, "footer: for 作用域插槽"),
      }
    );
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {};
  },
};
