import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers);
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

export function isReactive(raw) {
  return !!raw[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(raw) {
  return !!raw[ReactiveFlags.IS_READONLY];
}

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
