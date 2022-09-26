import { NodeTypes } from "../ast";

export function transformExpression(node) {
  console.log(node);
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content);
  }
}

function processExpression(node: any) {
  node.content = `_ctx.${node.content}`;
  return node;
}
