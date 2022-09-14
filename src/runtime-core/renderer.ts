import { ShapeFlags } from "../shared/ShapFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { createAppApi } from "./createApp";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;

  function render(vnode: any, container: any) {
    patch(vnode, container, null);
  }
  function patch(vnode: any, container: any, parentInstance) {
    const { type, shapeFlag } = vnode;
    switch (type) {
      case Fragment:
        mountChildren(vnode, container, parentInstance);
        break;
      case Text:
        processText(vnode, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 去处理element
          processElement(vnode, container, parentInstance);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 去处理组件
          processComponent(vnode, container, parentInstance);
        }
        break;
    }
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processElement(vnode: any, container: any, parentInstance) {
    mountElement(vnode, container, parentInstance);
  }

  function mountElement(vnode: any, container: any, parentInstance) {
    // 创建 dom & 挂载vnode.el
    const domEl = (vnode.el = hostCreateElement(vnode.type));

    // children: string or array
    const { props, children, shapeFlag } = vnode;
    for (const key in props) {
      const val = props[key];
      hostPatchProp(domEl, key, val);
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      domEl.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, domEl, parentInstance);
    }
    hostInsert(domEl, container);
  }

  function mountChildren(vnode: any, container: any, parentInstance) {
    vnode.children.forEach((vnode) => {
      patch(vnode, container, parentInstance);
    });
  }

  function processComponent(vnode: any, container: any, parentInstance) {
    mountComponent(vnode, container, parentInstance);
  }
  function mountComponent(initialVNode: any, container: any, parentInstance) {
    const instance = createComponentInstance(initialVNode, parentInstance);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container, instance);
    initialVNode.el = subTree.el;
  }

  return {
    createApp: createAppApi(render),
  };
}
