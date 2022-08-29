import { extend } from "../shared";

const targetMap = new WeakMap();
let activeEffect;
export class ReactiveEffect {
  private _fn: any;
  deps: any = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler: Function | null = null) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    activeEffect = this;
    const res = this._fn();
    activeEffect = null;
    return res;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  // bind是创建一个新的函数，需要手动调用
  const runner: any = _effect.run.bind(_effect);
  // 将effect 挂载到 返回的runner
  runner.effect = _effect;
  return runner;
}

export function trigger(target: any, key: any) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let deps = depsMap.get(key);
  triggerEffects(deps);
}

export function triggerEffects(deps) {
  deps.forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}

export function track(target: any, key: any) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  trackEffects(deps);
}

export function trackEffects(deps) {
  if (!activeEffect) return;
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

export function stop(runner) {
  runner.effect.stop();
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}
