import { ShapeFlags } from "../shared/ShapFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { createAppApi } from "./createApp";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    setElementText: hostSetElementText,
    createText: hostCreateText
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
    const textNode = vnode.el = hostCreateText(vnode.children);
    hostInsert(textNode, container);
  }

  function processElement(vnode: any, container: any, parentInstance) {
    mountElement(vnode, container, parentInstance);
  }

  function mountElement(vnode: any, container: any, parentInstance) {
    // 创建 dom & 挂载vnode.el
    const domEl = (vnode.el = hostCreateElement(vnode.type));

    const { props, children, shapeFlag } = vnode;
    // props: attributes or event
    for (const key in props) {
      const val = props[key];
      hostPatchProp(domEl, key, val);
    }
    // children: string or array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(domEl, children);
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
