import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  if (typeof vnode.type === "string") {
    // 去处理element
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    // 去处理组件
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  // 创建 dom & 挂载vnode.el
  const domEl = (vnode.el = document.createElement(vnode.type));

  // children: string or array
  const { props, children } = vnode;
  for (const key in props) {
    const val = props[key];
    domEl.setAttribute(key, val);
  }
  if (typeof children === "string") {
    domEl.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, domEl);
  }
  // finally 将 domEl 加入dom树中
  container.append(domEl);
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((vnode) => {
    patch(vnode, container);
  });
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  initialVNode.el = subTree.el;
}
