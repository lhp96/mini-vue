import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    // Foo .vnode .children
    console.log("slots: ", this.$slots);
    return h("div", {}, [foo, this.$slots]);
  },
};
