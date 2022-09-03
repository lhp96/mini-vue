import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props) {
    console.log("props", props);
    // shallowReadonly
    props.count = 3;
    console.log("props", props);
  },
  render() {
    return h("div", {}, "foo: " + this.count);
    addsafa
  },
};
