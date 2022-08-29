import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any;
  private _hasLocked: boolean = false;
  private _value: any;
  private _effect: any;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (this._hasLocked) {
        this._hasLocked = false;
      }
    });
  }
  get value() {
    if (!this._hasLocked) {
      this._hasLocked = true;
      this._value = this._effect.run();
    }
    return this._value;
  }
}
export function computed(getter) {
  return new ComputedRefImpl(getter);
}
