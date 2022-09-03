import { Foo } from "./Foo.js";
import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h("div", {}, [
      h("p", {}, "hello"),
      h(
        Foo,
        // on + Event
        { onAdd: this.onAdd }
      ),
    ]);
  },
  setup() {
    function onAdd() {
      console.log("onAdd");
    }
    return {
      onAdd,
    };
  },
};
