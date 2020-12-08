import Vue from 'vue'
import App from './index.vue'
import store from './store'
import router from './router'
import VueRouter from 'vue-router'
import './style.scss'
// common panel component
import Panel from './components/panel'

// use 'buefy/src' when running from git,
import Buefy from 'buefy/src'
// or use 'buefy' when running from npm
// import Buefy from 'buefy'

// add Buefy to Vue
Vue.use(Buefy)

Vue.use(VueRouter)
// load panel component globally
Vue.component('panel', Panel)

new Vue({
  // el: '#app',
  render: h => h(App),
  router,
  store
}).$mount('#app')
