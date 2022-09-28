import { ref } from "../../lib/mini-vue.esm.js";

export const App = {
  name: "App",
  template: `<div>hi, count: {{count}} ---- written by lhp96<h1>have a nice Day</h1><p>2022.9.28</p></div>`,
  setup() {
    const count = (window.count = ref(1));
    return {
      count,
    };
  },
};
