import { createVNode, Fragment } from "../vnode";

export function renderSlots(slots, name, props) {
  const slot = slots[name];
  if (slot) {
    return createVNode(Fragment, {}, slot(props));
  }
}
