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
    patch(null, vnode, container, null, null);
  }
  function patch(n1, n2: any, container: any, parentInstance, anchor) {
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentInstance, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 去处理element
          processElement(n1, n2, container, parentInstance, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 去处理组件
          processComponent(n1, n2, container, parentInstance, anchor);
        }
        break;
    }
  }

  function processFragment(
    n1,
    n2,
    container: any,
    parentInstance: any,
    anchor
  ) {
    if (!n1) {
      mountChildren(n2.children, container, parentInstance, anchor);
    } else {
    }
  }

  function processText(n1, n2: any, container: any) {
    if (!n1) {
      const textNode = (n2.el = hostCreateText(n2.children));
      hostInsert(textNode, container);
    }
  }

  function processElement(n1, n2: any, container: any, parentInstance, anchor) {
    if (!n1) {
      mountElement(n2, container, parentInstance, anchor);
    } else {
      patchElement(n1, n2, container, parentInstance, anchor);
    }
  }
  function mountElement(vnode: any, container: any, parentInstance, anchor) {
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
      mountChildren(vnode.children, domEl, parentInstance, anchor);
    }
    hostInsert(domEl, container);
  }

  function mountChildren(
    children: any,
    container: any,
    parentInstance,
    anchor
  ) {
    children.forEach((v) => {
      patch(null, v, container, parentInstance, anchor);
    });
  }

  function patchElement(n1, n2, container: any, parentInstance: any, anchor) {
    // type props children
    // patchChildren -> diff 算法
    if (n1.type !== n2.type) {
      unmount(n1);
      mountElement(n2, container, parentInstance, anchor);
    } else {
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      const el = (n2.el = n1.el);
      patchProps(el, oldProps, newProps);
      patchChildren(n1, n2, el, parentInstance, anchor);
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
  function patchChildren(n1: any, n2: any, container, parentInstance, anchor) {
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
        mountChildren(c2, container, parentInstance, anchor);
      } else {
        patchKeyedChildren(c1, c2, container, parentInstance, anchor);
      }
    }
  }
  function patchKeyedChildren(
    arr1,
    arr2,
    container,
    parentInstance,
    parentAnchor
  ) {
    let e1 = arr1.length - 1;
    let e2 = arr2.length - 1;
    let len1 = arr1.length;
    let len2 = arr2.length;
    let i = 0;
    function isSameVNode(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }

    // 从左边开始对比
    while (i <= e1 && i <= e2) {
      if (isSameVNode(arr1[i], arr2[i])) {
        patch(arr1[i], arr2[i], container, parentInstance, parentAnchor);
        i++;
      } else {
        break;
      }
    }
    // 再从右边开始
    while (e1 >= 0 && e2 >= 0) {
      if (isSameVNode(arr1[e1], arr2[e2])) {
        patch(arr1[e1--], arr2[e2--], container, parentInstance, parentAnchor);
      } else {
        break;
      }
    }
    // 确定范围： 上面：i ~ e1  下面：i ~ e2
    // 1. 添加新的
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < len2 ? arr2[nextPos].el : null;
        while (i <= e2) {
          patch(null, arr2[i++], container, parentInstance, anchor);
        }
      }
    } else if (i > e2) {
      // 2.删除旧的
      while (i <= e1) {
        unmount(arr1[i++]);
      }
    }
  }

  function processComponent(
    n1,
    n2: any,
    container: any,
    parentInstance,
    anchor
  ) {
    if (!n1) {
      mountComponent(n2, container, parentInstance, anchor);
    } else {
    }
  }
  function mountComponent(
    initialVNode: any,
    container: any,
    parentInstance,
    anchor
  ) {
    const instance = createComponentInstance(initialVNode, parentInstance);

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }
  function setupRenderEffect(
    instance: any,
    initialVNode: any,
    container: any,
    anchor
  ) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance, anchor);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const { proxy, subTree: preSubTree } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(preSubTree, subTree, container, instance, anchor);
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
