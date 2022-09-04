export function initSlots(instance, children) {
  // children -> object  -> key , val:[]
  normalizeObjectSlots(children, instance.slots);
}

function normalizeObjectSlots(children: any, slots: any) {
  for (const key in children) {
    const val = children[key];
    slots[key] = normalizSlotValue(val);
  }
}

function normalizSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
