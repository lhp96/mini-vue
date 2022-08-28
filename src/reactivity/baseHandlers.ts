import { track, trigger } from "./effect";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
export const mutableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${key} set 失败 => 因为target 是 readonly`);
    return true;
  },
};

function createSetter() {
  return function (target, key, value) {
    const oldVal = target[key];
    const res = Reflect.set(target, key, value);
    if (oldVal !== value) {
      trigger(target, key, value);
    }
    return res;
  };
}

function createGetter(isReadonly = false) {
  return function (target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
