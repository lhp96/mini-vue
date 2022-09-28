import { ref } from "../../lib/mini-vue.esm.js";

export const App = {
  name: "App",
  template: `<div>hi,{{count}} ---- written by lhp96<p>have a nice Day</p><div>2022.9.28</div></div>`,
  setup() {
    const count = (window.count = ref(1));
    return {
      count,
    };
  },
};
