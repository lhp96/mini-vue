# mini-vue

实现最简Vue3模型，帮助你深入理解Vue3的底层实现原理。

以下是我目前已经实现的模块以及功能

# 模块划分

## reactivity
<details>

- reactive
  - [x] isReactive & isProxy
  - [x] reactive 嵌套转换
- effect
  - [x] track & trackEffects
  - [x] trigger & triggerEffects
  - [x] activeEffect
  - [x] return runner
  - [x] stop & onStop & cleanupEffect
  - [x] scheduler
- readonly
  - [x] isReadonly
  - [x] readonly 嵌套转换
- shallowReadonly
- ref
  - [x] isRef
  - [x] unRef
  - [x] ProxyRefs (get自动拆箱)
- computed
</details>

## runtime-core

<details>
  <summary>Element</summary>

- mountElement
  - **type**  -> createElement
  - **props** -> setAttributes
  - **children** -> mountChildren
    - string: setElementText
    - Array: children.forEach(patch())
- patchElement
  - **props** -> patchProps
  - **children** ->patchChildren
    - string - string: 修改Text
    - Array - string: unmountChildren & 修改Text
    - string - Array: 修改Text & mountChildren
    - Array - Array: **双端diff算法**
</details>

<details>
  <summary>Component</summary>

- mountComponent
  - createComponentInstance
  - setupComponent
    - initProps
    - initSlots
    - setupStatefulComponent -> **handleSetup**  [emit]
  - setupRenderEffect
    - **effect**(subTree & patch())
- updateComponent
  - queueJobs
</details>

## runtime-dom

- custom renderer
  - [x] createRenderer(**config**).createApp(...args);

## compiler-core
<details>

- parse
  - [x] 解析 插值表达式 `{{msg}}`
  - [x] 解析 text
  - [x] 解析 element  & 嵌套element
  - [x] 解析 联合类型   `生成AST`
- transform
  - [x] transformExpression
  - [x] transformElement
  - [x] transformText   `将AST转换为JsAST`
- codegen
  - [x] template 编译为 render  `将JsAST转为render()`
</details>


# TODO

- [ ] toRaw、shallowReactive 功能
- [ ] diff算法部分加上单测验证  [还有测试组件的功能]
- [ ] watch功能实现
- [ ] generate code 能添加 处理props
- [ ] runtime 实现patchType的时候卸载组件，然后变成vnode
- [ ] runtime 实现生命周期
- [ ] update 实现对事件的处理



# 项目使用

```shell
# 安装依赖
yarn install

# 运行测试
yarn run test

# build
yarn run build

# 尝试效果: example/*的demo
cd example/helloworld
# 启动 Live Server
```



**推荐阅读：**

- 《Vue.js设计与实现》
- 《Vue.js技术内幕》
