class Dep {
  static target = null;
  constructor() {
    this.subs = [];
  }
  addSubs(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    for (let i = 0; i < this.subs.length; i++) {
      this.subs[i].update();
    }
  }
}

class Observer {
  constructor(data) {
    if (typeof data == 'object') {
      this.walk(data);
    }
  }
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      this.defineReactive(obj, keys[i]);
    }
  }
  defineReactive(obj, key) {
    if (typeof obj[key] == 'object') {
      this.walk(obj[key]);
    }
    const dep = new Dep();
    let val = obj[key];
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      //get代理将Dep.target即Watcher对象添加到依赖集合中
      get: function reactiveGetter() {
        if (Dep.target) {
          dep.addSubs(Dep.target);
        }
        return val;
      },
      set: function reactiveSetter(newVal) {
        val = newVal;
        dep.notify();
      },
    });
  }
}

let uid = 0;
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.uid = uid++;
    this.cb = cb;
    //调用get，添加依赖
    Dep.target = this;
    this.value = vm.$data[key];
    Dep.target = null;
  }
  update() {
    if (this.value !== this.vm.$data[this.key]) {
      this.value = this.vm.$data[this.key];
      if (!this.vm.waiting) {
        //控制变量，控制每次事件循环期间只添加一次flushUpdateQueue到callbacks
        this.vm.$nextTick(this.vm.flushUpdateQueue);
        this.vm.waiting = true;
      }
      //不是立即执行run方法，而是放入updateQueue队列中
      if (!has[this.uid]) {
        has[this.uid] = true;
        updateQueue.push(this);
      }
    }
  }
  run() {
    this.cb(this.value);
  }
}

const updateQueue = []; //异步更新队列
let has = {}; //控制变更队列中不保存重复的Watcher
const callbacks = [];
let pending = false;

class Vue {
  constructor(options) {
    this.waiting = false;
    this.$el = options.el;
    this._data = options.data;
    this.$data = this._data;
    this.$nextTick = this.nextTick;
    new Observer(this._data);
  }
  //简易版nextTick
  nextTick(cb) {
    callbacks.push(cb);
    if (!pending) {
      //控制变量，控制每次事件循环期间只执行一次flushCallbacks
      pending = true;
      setTimeout(() => {
        //会在同步代码（上一次宏任务）执行完成后执行
        this.flushCallbacks();
      });
    }
  }
  //清空UpdateQueue队列，更新视图
  flushUpdateQueue(vm) {
    while (updateQueue.length != 0) {
      updateQueue.shift().run();
    }
    has = {};
    vm.waiting = false;
  }
  //清空callbacks
  flushCallbacks() {
    while (callbacks.length != 0) {
      callbacks.shift()(this); //传入当前vm实例，使得flushUpdateQueue能获取到
    }
    pending = false;
  }
}

// https://juejin.cn/post/6930413268376748045#heading-6
