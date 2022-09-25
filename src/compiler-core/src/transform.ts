export function transform(root, options = {}) {
  const context = createTransformContext(root, options);
  traverseNode(root, context);

  createRootCodegen(root);
}

function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}

function traverseNode(node: any, context: any) {
  if (!node) return;
  const transforms = context.nodeTransforms;
  for (let i = 0; i < transforms.length; i++) {
    transforms[i](node);
  }

  traverseChildren(node, context);
}

function traverseChildren(node: any, context: any) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i], context);
    }
  }
}

function createTransformContext(root: any, options: any): any {
  return {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };
}
