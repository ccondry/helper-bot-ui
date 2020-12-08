import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const isProduction = process.env.NODE_ENV === 'production'

const store = new Vuex.Store({
  strict: !isProduction,
  modules
})

export default store
