import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router.js'
import VueResource from 'vue-resource'
import Moment from 'moment'
import axios from 'axios';
import axiosConfig from './../src/components/util/axiosConfig';
import global from './../src/components/util/global'
import xfilters from './../src/components/util/xfilters'


router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    const requireAuth = to.meta.requireAuth
    // 判断该路由是否需要登录权限
    if (requireAuth) {
        var accountNumber = '';
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('='); //再次切割
            //判断查找相对应的值
            if (arr2[0] == 'accountNumber') {
                accountNumber = arr2[1];
                //保存到保存数据的地方
            }
          }
        }
        if (accountNumber) {
            next();
        } else {
            next('/login/login')
        }
    } else {
      next()  // 确保一定要有next()被调用
    }
  })

//自定义的过滤器
import iconfont from './../src/assets/icon/iconfont.css'
for(let key in xfilters){
  Vue.filter(key,xfilters[key]);
}

//自定义的公用方法
import {tools} from './../src/components/util/util'
Vue.prototype.$axios = axios;
//jquery
Vue.use(iconfont);
//公共方法
Vue.use(global);

// 安装 ElementUI（ui）
Vue.use(ElementUI)

// 安装 路由（url）
Vue.use(VueRouter)

// 绑定 vue-resource（ajax）
Vue.use(VueResource)

// 绑定 moment 进行时间格式化 ✔
Vue.prototype.$moment = Moment;//赋值使用

// 如果我们通过全局配置了，请求的数据接口 根域名，则 ，在每次单独发起 http 请求的时候，请求的 url 路径，应该以相对路径开头，前面不能带 /  ，否则 不会启用根路径做拼接；
Vue.http.options.root = 'http://127.0.0.1:8011';

// 全局启用 emulateJSON 选项:如果Web服务器无法处理编码为application/json的请求，你可以启用emulateJSON选项。
Vue.http.options.emulateJSON = true;

new Vue({
  el: '#app',
  render: h => h(App),
  // 挂在路由对象到 VM 实例上
  router
})

