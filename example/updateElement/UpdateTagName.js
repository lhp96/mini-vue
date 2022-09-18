import { h, ref } from "../../lib/mini-vue.esm.js";
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
    return self.isChange === false
      ? h("div", {}, "count:0")
      : h("h1", {}, "count:0");
  },
};
