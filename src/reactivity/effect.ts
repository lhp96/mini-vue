const targetMap = new WeakMap();
let activeEffect;
class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    this._fn();
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  activeEffect = _effect;
  _effect.run();
  activeEffect = null;
}
export function trigger(target: any, key: any, value: any) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let deps = depsMap.get(key);
  deps.forEach((effect) => {
    effect.run();
  });
}

export function track(target: any, key: any) {
  // Implement
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}
