import { createRenderer } from "../runtime-core";
export function createElement(tagName) {
  return document.createElement(tagName);
}

const isOn = (key: string) => /^on[A-Z]/.test(key);

export function patchProp(el, key, val) {
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}

export function insert(el, parent) {
  parent.appendChild(el);
}

export function setElementText(node, text) {
  node.textContent = text;
}

export function createText(text) {
  return document.createTextNode(text);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  setElementText,
  createText,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core/index";
