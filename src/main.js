import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './index.vue'
import About from "@/pages/About";
import Worktime from "@/pages/Worktime"
import PhosphorVue from "phosphor-vue";
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

const NotFound = { template: '<p>Page not found</p>' }

const routes = {
  '/': App,
  '/worktime': Worktime,
  '/about': About // TODO: '.../about/' doesn't match
}

Vue.config.productionTip = false
Vue.use(PhosphorVue);
new Vue({
  el:"#app",
  data: {
    currentRoute: window.location.pathname
  },
  computed:{
    ViewComponent () {
      return routes[this.currentRoute] || NotFound;
    }
  },
  render (h) { return h(this.ViewComponent, true) }
})

