import { h, provide, inject } from "../../lib/mini-vue.esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
  },
};
const ProviderTwo = {
  name: "ProviderTwo",
  setup() {
    provide("foo", "fooTwo");
    const myFoo = inject("foo");
    return {
      myFoo,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, `ProviderTwo foo: ${this.myFoo}  `),
      h(Consumer),
    ]);
  },
};
const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    // defaultValue   when I don't want to care has provides
    const car = inject("car", "car's Dafault Value");
    const bus = inject("bus", () => "busDefault");

    return {
      foo,
      bar,
      car,
      bus,
    };
  },
  render() {
    return h(
      "div",
      {}, //   `Consumer: - ${this.foo} - ${this.bar} `
      `Consumer: car: ${this.car}  --  bus: ${this.bus}`
    );
  },
};

export default {
  name: "App",
  setup() {},
  render() {
    return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
  },
};
