import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_VNODE,
  helperMapName,
  TO_DISPLAY_STRING,
} from "./runtimeHelpers";

export function generate(ast) {
  const context = createCodegenContext();
  const { push } = context;
  genFunctionPreamble(ast, context);
  const functionName = "render";
  const args = ["_ctx", "_cache"];
  const signature = args.join(", ");

  push(`function ${functionName}(${signature}){`);
  push(`return `);

  genNode(ast.codegenNode, context);
  push(`}`);
  return {
    code: context.code,
  };
}

function genFunctionPreamble(ast: any, context: any) {
  const { push } = context;
  const VueBinging = "Vue";
  // 处理需要用到的所有 import
  const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`;
  if (ast.helpers.length) {
    push(`const { ${ast.helpers.map(aliasHelper).join(",")} } = ${VueBinging}`);
  }
  push(`\nreturn `);
}

function genNode(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context);
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeTypes.ELEMENT:
      genElement(node, context);
      break;
    default:
      break;
  }
}

function genElement(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(CREATE_ELEMENT_VNODE)}("${node.tag})"`);
  node.children.forEach((node) => {
    // TODO generate Children
  });
}

function genText(node: any, context: any) {
  const { push } = context;
  push(`'${node.content}'`);
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  const to_display = helper(TO_DISPLAY_STRING);
  push(`${to_display}(`);
  genNode(node.content, context);
  push(`)`);
}

function genExpression(node: any, context: any) {
  const { push } = context;
  push(`${node.content}`);
}

function createCodegenContext(): any {
  const context = {
    code: "",
    push(source) {
      context.code += source;
    },
    helper(key) {
      return `_${helperMapName[key]}`;
    },
  };
  return context;
}
