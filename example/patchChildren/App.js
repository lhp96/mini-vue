import { h } from "../../lib/mini-vue.esm.js";

import ArrayToText from "./ArrayToText.js";
import TextToText from "./TextToText.js";
import TextToArray from "./TextToArray.js";
import ArrayToArray from "./ArrayToArray.js";

export const App = {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      h(
        "button",
        {
          onClick: () => {
            console.log("click button");
            window.isChange.value = true;
          },
        },
        "Change Children"
      ),
      // 老的是 array 新的是 text
      // h(ArrayToText),
      // 老的是 text 新的是 text
      // h(TextToText),
      // 老的是 text 新的是 array
      h(TextToArray),
      // 老的是 array 新的是 array
      // h(ArrayToArray)
    ]);
  },
};
