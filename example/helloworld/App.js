import { Foo } from "./Foo.js";
import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    const app = h("div", {}, "App");
    const foo = h(
      Foo,
      {},
      {
        header: h("h1", {}, "msg for slots"),
        footer: h("h1", {}, "msg for slots2"),
      }
    );
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {};
  },
};
