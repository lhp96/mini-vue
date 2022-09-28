import { isString } from "../../shared";
import { NodeTypes } from "./ast";
import {
  CREATE_ELEMENT_VNODE,
  CREATE_TEXT_VNODE,
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
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context);
      break;
    default:
      break;
  }
}

function genCompoundExpression(node: any, context: any) {
  const { push, helper } = context;
  const { children } = node;
  push(`${helper(CREATE_TEXT_VNODE)}(`);
  children.forEach((child) => {
    if (isString(child)) {
      push(child);
    } else {
      genNode(child, context);
    }
  });
  push(`)`);
}

function genElement(node: any, context: any) {
  const { push, helper } = context;
  const { tag, props, children } = node;
  push(`${helper(CREATE_ELEMENT_VNODE)}(`);
  // genChildren
  genNodeList(genNullable([tag, props, children]), context);
  push(`)`);
}

function genNodeList(nodes, context) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node: any = nodes[i];
    if (isString(node)) {
      // 处理空值 props / children
      push(node);
    } else {
      // 处理 children
      if (Array.isArray(node) && node.length) {
        if (node.length === 1 && node[0].type !== NodeTypes.ELEMENT) {
          genNode(node[0], context);
        } else {
          push(`[`);
          for (let j = 0; j < node.length; j++) {
            const child = node[j];
            if (child && child.codegenNode) {
              genNode(child.codegenNode, context);
            } else {
              genNode(child, context);
            }
            if (j < node.length - 1) {
              push(", ");
            }
          }
          push(`]`);
        }
        return;
      } else {
        // console.log("进入 子genNode --- 应该不会再进入");
        genNode(node, context);
      }
    }

    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}
// 处理没有传入的数据变为 "null", eg-> props:{}, children:[]
function genNullable(args: any) {
  return args.map((arg) =>
    Array.isArray(arg) ? (arg.length ? arg : "null") : arg || "null"
  );
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
