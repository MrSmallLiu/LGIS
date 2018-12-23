import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Cesium from "cesium/Cesium";
import 'cesium/Widgets/widgets.css';
import store from './store';
// Vue.prototype.Cesium = Cesium;
window.Cesium = Cesium;

// import vueRouter from 'vue-router'
Vue.use(iView);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')