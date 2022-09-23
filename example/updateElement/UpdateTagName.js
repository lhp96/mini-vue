import { h, ref, createTextVNode } from "../../lib/mini-vue.esm.js";
const prevChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "C" }, "C"),
  h("p", { key: "E" }, "E"),
  createTextVNode("你说这就是爱吗？"),
  h("p", { key: "F" }, "F"),
  h("p", { key: "G" }, "G"),
];

const nextChildren = [
  h("h1", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "E" }, "E"),
  h("p", { key: "C" }, "C"),
  h("h2", { key: "D" }, "D"),
  createTextVNode("你说这就是爱吗？ 真的爱我吗？"),
  h("p", { key: "F" }, "F"),
  h("h3", { key: "G" }, "G"),
];
export default {
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;
    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
