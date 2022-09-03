export function emit(instance, event) {
  console.log("enter emit", event);

  // instance.props -> event
  const { props } = instance;

  // TPP 特定 -> 通用
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const toHandlerKey = (str: string) => {
    return str ? "on" + capitalize(str) : "";
  };

  const handlerName = toHandlerKey(event);
  const handler = props[handlerName];
  handler && handler();
}
