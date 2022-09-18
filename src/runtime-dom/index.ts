import { createRenderer } from "../runtime-core";
export function createElement(tagName) {
  return document.createElement(tagName);
}

const isOn = (key: string) => /^on[A-Z]/.test(key);

export function patchProp(el, key, newVal) {
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, newVal);
  } else {
    if (!newVal) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, newVal);
    }
  }
}

export function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor || null);
}

export function setElementText(node, text) {
  node.textContent = text;
}

export function createText(text) {
  return document.createTextNode(text);
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  setElementText,
  createText,
  remove,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core/index";
