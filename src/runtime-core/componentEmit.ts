import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
  console.log("enter emit", event);

  // instance.props -> event
  const { props } = instance;

  // TPP 特定 -> 通用
  // add  & add-foo  & emit("xxx", obj, str);

  const handlerName = toHandlerKey(camelize(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
