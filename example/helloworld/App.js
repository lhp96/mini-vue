import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h("div", this.msg);
  },
  setup() {
    return {
      msg: "hi, mini-vue",
    };
  },
};
