import { ShapeFlags } from "../shared/ShapFlags";

export function initSlots(instance, children) {
  // children -> object  -> key , val:[]
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const val = children[key];
    slots[key] = (props) => normalizSlotValue(val(props));
  }
}

function normalizSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
