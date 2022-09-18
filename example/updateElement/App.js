import { h, ref } from "../../lib/mini-vue.esm.js";
export const App = {
  setup() {
    const counter = ref(1);
    function inc() {
      console.log("click-add");
      counter.value += 1;
    }
    return {
      counter,
      inc,
    };
  },
  render() {
    return h("div", {}, [
      h("div", {}, "" + this.counter),
      h("button", { onClick: this.inc }, "click"),
    ]);
  },
};
