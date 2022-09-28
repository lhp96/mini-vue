import { NodeTypes } from "../ast";
import { CREATE_TEXT_VNODE } from "../runtimeHelpers";
import { isText } from "../utils";

export function transformText(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const { children } = node;
      let currentContainer;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!currentContainer) {
                context.helper(CREATE_TEXT_VNODE);
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }
              currentContainer.children.push(" + ");
              currentContainer.children.push(next);
              children.splice(j, 1);
              j--;
            } else {
              currentContainer = null;
              break;
            }
          }
        }
      }
    };
  }
}
