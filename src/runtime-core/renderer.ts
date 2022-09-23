import { ShapeFlags } from "../shared/ShapFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";
import { createAppApi } from "./createApp";
import { effect } from "../reactivity";
import { EMPTY_OBJ } from "../shared";
import { shouldUpdateComponent } from "./componentUpdateUtils";
import { queueJobs } from "./scheduler";

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
  function patch(n1, n2, container, parentInstance, anchor) {
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

  function processFragment(n1, n2, container, parentInstance, anchor) {
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
    hostInsert(domEl, container, anchor);
  }

  function mountChildren(children, container, parentInstance, anchor) {
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
  function patchChildren(n1, n2, container, parentInstance, anchor) {
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
    let idx = 0;
    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }

    // 从左边开始对比
    while (idx <= e1 && idx <= e2) {
      if (isSameVNodeType(arr1[idx], arr2[idx])) {
        patch(arr1[idx], arr2[idx], container, parentInstance, parentAnchor);
        idx++;
      } else {
        break;
      }
    }
    // 再从右边开始
    while (e1 >= idx && e2 >= idx) {
      if (isSameVNodeType(arr1[e1], arr2[e2])) {
        patch(arr1[e1--], arr2[e2--], container, parentInstance, parentAnchor);
      } else {
        break;
      }
    }
    // 确定范围： 上面：i ~ e1  下面：i ~ e2
    if (idx > e1 && idx <= e2) {
      // 1. 添加新的
      const nextPos = e2 + 1;
      const anchor = nextPos < len2 ? arr2[nextPos].el : null;
      while (idx <= e2) {
        patch(null, arr2[idx++], container, parentInstance, anchor);
      }
    } else if (idx > e2 && idx <= e1) {
      // 2.删除旧的
      while (idx <= e1) {
        unmount(arr1[idx++]);
      }
    } else {
      // 3.中间对比
      let s1 = idx;
      let s2 = idx;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      const keyToNewIndexMap = new Map();
      const newIndexToOldIndexMap = new Array(toBePatched);
      newIndexToOldIndexMap.fill(0);
      let moved = false;
      let maxNewIndexSoFar = 0;
      // 构建索引表
      for (let i = s2; i <= e2; i++) {
        const nextChild = arr2[i];
        // 建立映射关系：{节点.key：新的坐标}
        keyToNewIndexMap.set(nextChild.key, i);
      }
      for (let i = s1; i <= e1; i++) {
        const prevChild = arr1[i];
        if (patched >= toBePatched) {
          unmount(prevChild);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, arr2[j])) {
              newIndex = j;
              break;
            }
          }
        }

        if (newIndex === undefined) {
          unmount(prevChild);
        } else {
          // 对比相同key的节点
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          // 新arr节点在原arr的下标 + 1 （防止0，0代表新的节点）
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(prevChild, arr2[newIndex], container, parentInstance, null);
          patched++;
        }
      }

      // 中间对比 2.移动节点
      // 先确定不需要移动的点(最长递增子序列), 再对需要移动的点进行移动
      const newSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
      for (let i = toBePatched - 1, j = newSequence.length - 1; i >= 0; i--) {
        const nextIndex = i + s2;
        const nextChild = arr2[nextIndex];
        const ancher = nextIndex + 1 < len2 ? arr2[nextIndex + 1].el : null;

        // 新arr节点在原arr的下标为0，新增
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentInstance, ancher);
        } else if (moved) {
          if (j < 0 || i !== newSequence[j]) {
            hostInsert(nextChild.el, container, ancher);
          } else {
            j--;
          }
        }
      }
    }
  }

  function processComponent(n1, n2, container, parentInstance, anchor) {
    if (!n1) {
      mountComponent(n2, container, parentInstance, anchor);
    } else {
      updateComponent(n1, n2);
    }
  }
  function mountComponent(initialVNode, container, parentInstance, anchor) {
    const instance = (initialVNode.component = createComponentInstance(
      initialVNode,
      parentInstance
    ));

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container, anchor);
  }
  function setupRenderEffect(instance, initialVNode, container, anchor) {
    instance.update = effect(
      () => {
        const { proxy, subTree: preSubTree } = instance;
        if (!instance.isMounted) {
          const subTree = (instance.subTree = instance.render.call(proxy));
          patch(null, subTree, container, instance, anchor);
          initialVNode.el = subTree.el;
          instance.isMounted = true;
        } else {
          const { next, vnode } = instance;
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next);
          }
          const subTree = (instance.subTree = instance.render.call(proxy));
          patch(preSubTree, subTree, container, instance, anchor);
        }
      },
      {
        scheduler: () => {
          queueJobs(instance.update);
        },
      }
    );
  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component);
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2;
      instance.update();
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  }
  function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode;
    instance.props = nextVNode.props;
    instance.next = null;
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

function getSequence(arr) {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
