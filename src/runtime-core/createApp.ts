import { createVNode } from './vnode';

export function createAppAPI(render) {
  // 真正被入口文件调用的 createApp
  return function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        const vnode = createVNode(rootComponent);
        console.log('基于根组件创建根 vnode', vnode);

        console.log('调用 render，基于 vnode 进行开箱');
        render(vnode, rootContainer);
      },
    };

    return app;
  };
}
