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
  // 创建 dom
  const domEl = document.createElement(vnode.type);

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
function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();
  patch(subTree, container);
}
