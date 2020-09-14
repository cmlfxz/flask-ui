import Vue from 'vue'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import VueRouter from 'vue-router';
import App from './App.vue';
// import './plugins/element.js';
// import  routes  from './router'
import router from './router'

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';


Vue.config.productionTip = false
// Vue.prototype.$message = 
// Vue.use(ElementUI);
Vue.use(ViewUI);

// Vue.prototype.$bus = new Vue()
// Vue.prototype.$bus = 'app123454545'
// Vue.use(VueRouter);

// const router = new VueRouter({
//   routes,
//   // mode: 'history'
// })

Vue.prototype.$bus = new Vue({
  // beforeCreate: function () {
  //   console.log(this.$bus)
  // },
  router,
  render: h => h(App),
}).$mount('#app')
