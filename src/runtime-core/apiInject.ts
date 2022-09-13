import { getCurrentInstance } from "./component";
export function provide(key, value) {
  // 存数据
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const { provides } = currentInstance;
    provides[key] = value;
  }
}
export function inject(key) {
  // 拿数据
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;

    return parentProvides[key];
  }
}
