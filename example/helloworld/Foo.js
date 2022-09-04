import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    // Foo .vnode .children
    console.log("slots: ", this.$slots);
    // 作用域插槽
    const age = 19;
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer", age),
    ]);
  },
};
