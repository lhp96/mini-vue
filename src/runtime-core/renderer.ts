import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, container: any) {
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  console.log(vnode.type);
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode)) {
    // 去处理组件
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = document.createElement(vnode.type);

  // children: string or array
  const { props, children } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
  }
  container.append(el);
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
