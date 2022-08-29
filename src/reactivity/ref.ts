import { trackEffects, triggerEffects } from "./effect";
import { isProxy, reactive } from "./reactive";
import { hasChanged, isObject } from "../shared/index";

export function ref(value) {
  return new RefImpl(value);
}

class RefImpl {
  private val: any;
  public deps;
  public __v_isRef = true;
  constructor(val) {
    this.val = convert(val);
    this.deps = new Set();
  }
  get value() {
    this.val = convert(this.val);
    trackEffects(this.deps);
    return this.val;
  }
  set value(newVal) {
    if (hasChanged(this.val, newVal)) {
      this.val = newVal;
      triggerEffects(this.deps);
    }
  }
}

function convert(val) {
  return isObject(val) ? reactive(val) : val;
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
