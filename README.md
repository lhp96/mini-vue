# mini-vue

这个项目是关于崔哥的mini-vue的个人实现

# 模块划分

## reactivity

- reactive
    - [x] happy path
    - [x] isReactive
    - [x] reactive 嵌套转换
    - [x] isProxy & isReacive & isReadonly

- effect

    - [x] track
        - trackEffects

    - [x] trigger
      - triggerEffects
    - [x] activeEffect
    - [x] return runner
    - [x] stop & onStop
      - cleanupEffect
    - [x] scheduler

- readonly

- shallowReadonly

- ref

- computed