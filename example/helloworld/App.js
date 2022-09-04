import { Foo } from "./Foo.js";
import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    const app = h("div", {}, "App");
    const foo = h(Foo, {}, h("h1", {}, "msg for slots"));
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {};
  },
};
