import { ShapeFlags } from "../shared/ShapFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { createAppApi } from "./createApp";
import { effect } from "../reactivity";
import { EMPTY_OBJ } from "../shared";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    setElementText: hostSetElementText,
    createText: hostCreateText,
    remove: hostRemove,
  } = options;

  function render(vnode: any, container: any) {
    patch(null, vnode, container, null);
  }
  function patch(n1, n2: any, container: any, parentInstance) {
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentInstance);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 去处理element
          processElement(n1, n2, container, parentInstance);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 去处理组件
          processComponent(n1, n2, container, parentInstance);
        }
        break;
    }
  }

  function processFragment(n1, n2, container: any, parentInstance: any) {
    if (!n1) {
      mountChildren(n2.children, container, parentInstance);
    } else {
    }
  }

  function processText(n1, n2: any, container: any) {
    if (!n1) {
      const textNode = (n2.el = hostCreateText(n2.children));
      hostInsert(textNode, container);
    }
  }

  function processElement(n1, n2: any, container: any, parentInstance) {
    if (!n1) {
      mountElement(n2, container, parentInstance);
    } else {
      patchElement(n1, n2, container, parentInstance);
    }
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
      mountChildren(vnode.children, domEl, parentInstance);
    }
    hostInsert(domEl, container);
  }

  function mountChildren(children: any, container: any, parentInstance) {
    children.forEach((v) => {
      patch(null, v, container, parentInstance);
    });
  }

  function patchElement(n1, n2, container: any, parentInstance: any) {
    // type props children
    // patchChildren -> diff 算法
    if (n1.type !== n2.type) {
      unmount(n1);
      mountElement(n2, container, parentInstance);
    } else {
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      const el = (n2.el = n1.el);
      patchProps(el, oldProps, newProps);
      patchChildren(n1, n2, el, parentInstance);
    }
  }
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, null);
          }
        }
      }
    }
  }
  function patchChildren(n1: any, n2: any, container, parentInstance) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    const { shapeFlag: nextShapeFlag, children: c2 } = n2;

    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // newChildren is Array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container);
        mountChildren(c2, container, parentInstance);
      }
    }
  }

  function processComponent(n1, n2: any, container: any, parentInstance) {
    if (!n1) {
      mountComponent(n2, container, parentInstance);
    } else {
    }
  }
  function mountComponent(initialVNode: any, container: any, parentInstance) {
    const instance = createComponentInstance(initialVNode, parentInstance);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }
  function setupRenderEffect(instance: any, initialVNode: any, container: any) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy, subTree: preSubTree } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(preSubTree, subTree, container, instance);
      }
    });
  }

  function unmountChildren(children) {
    children.forEach((child) => {
      unmount(child);
    });
  }
  function unmount(vnode) {
    hostRemove(vnode.el);
  }

  return {
    createApp: createAppApi(render),
  };
}
