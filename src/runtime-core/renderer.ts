import { ShapeFlags } from "../shared/ShapFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode: any, container: any, parentInstance) {
  patch(vnode, container, parentInstance);
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
  const domEl = (vnode.el = document.createElement(vnode.type));

  // children: string or array
  const { props, children, shapeFlag } = vnode;
  for (const key in props) {
    const val = props[key];
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      domEl.addEventListener(event, val);
    } else {
      domEl.setAttribute(key, val);
    }
  }
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    domEl.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, domEl, parentInstance);
  }
  // finally 将 domEl 加入dom树中
  container.append(domEl);
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
