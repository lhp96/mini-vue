import { Foo } from "./Foo.js";
import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h("div", {}, [
      h("p", {}, "hello"),
      h(
        Foo,
        // on + Event
        {
          onAdd: this.onAdd,
          onAddFoo() {
            console.log("onAddFoo");
          },
        }
      ),
    ]);
  },
  setup() {
    function onAdd(a, b) {
      console.log("onAdd", a, b);
    }
    return {
      onAdd,
    };
  },
};
