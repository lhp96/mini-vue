import { ShapeFlags } from "../shared/ShapFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { createAppApi } from "./createApp";
import { effect } from "../reactivity";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    setElementText: hostSetElementText,
    createText: hostCreateText,
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
      mountChildren(n2, container, parentInstance);
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
      mountChildren(vnode, domEl, parentInstance);
    }
    hostInsert(domEl, container);
  }

  function mountChildren(vnode: any, container: any, parentInstance) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentInstance);
    });
  }

  function patchElement(n1, n2, container: any, parentInstance: any) {
    // type props children
    // patchChildren -> diff 算法
    // if(n1.type !== n2.type){
    //   unmount(n1);
    //   mountElement(n2);
    // }
    const parent = n1.el.parentNode;
    if (parent) {
      parent.removeChild(n1.el);
    }
    mountElement(n2, container, parentInstance);

    // patchProp();
    // patchChildren();
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

  return {
    createApp: createAppApi(render),
  };
}
