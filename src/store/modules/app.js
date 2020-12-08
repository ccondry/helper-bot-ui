import * as types from '../mutation-types'
import Vue from 'vue'
import {ToastProgrammatic as Toast} from 'buefy/src'
import {addUrlQueryParams} from '../../utils'
import {version} from '../../../package.json'

const state = {
  loading: {
    app: {},
    user: {},
    users: {},
    ldap: {}
  },
  working: {
    app: {},
    user: {},
    users: {},
    ldap: {}
  },
  isProduction: process.env.NODE_ENV === 'production',
  demoEnvironment: {},
  uiVersion: version,
  apiVersion: 'Loading...'
}

const getters = {
  isProduction: state => state.isProduction,
  loading: state => state.loading,
  working: state => state.working,
  demoEnvironment: state => state.demoEnvironment,
  uiVersion: state => state.uiVersion,
  apiVersion: state => state.demoEnvironment.version
}

const mutations = {
  [types.SET_WORKING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.working[data.group]) {
      Vue.set(state.working, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.working[data.group][data.type]) {
      Vue.set(state.working[data.group], data.type, data.value)
    } else {
      state.working[data.group][data.type] = data.value
    }
  },
  [types.SET_LOADING] (state, data) {
    // if state container for this group is not existing, create it
    if (!state.loading[data.group]) {
      Vue.set(state.loading, data.group, {})
    }

    // if state container for this type is not existing, create it
    if (!state.loading[data.group][data.type]) {
      Vue.set(state.loading[data.group], data.type, data.value)
    } else {
      state.loading[data.group][data.type] = data.value
    }
  },
  [types.SET_ENVIRONMENT] (state, data) {
    state.demoEnvironment = data
  }
}

const actions = {
  async fetch ({getters}, {url, options = {}}) {
    if (!url) {
      throw Error('url is a required parameter for fetch')
    }
    // set content type to JSON by default
    options.headers = options.headers || {}
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json'
    
    // stringify body if object
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body)
    }
    // console.log('fetch', url, options)
    // add query parameters to URL
    try {
      // console.log('url', url)
      const endpoint = addUrlQueryParams(url, options.query)
      // console.log('endpoint', endpoint)
      const response = await window.fetch(endpoint, options)
      const text = await response.text()
      if (response.ok) {
        try {
          return JSON.parse(text)
        } catch (e) {
          return text
        }
      } else if (response.status === 401) {
        // expired JWT. forget jwt and forward to SSO login
        window.localStorage.removeItem('jwt')
        window.location = getters.ssoUrl
      } else {
        // not OK and not 401
        let m = text
        try {
          const json = JSON.parse(text)
          m = json.message || json.apiError || json[Object.keys(json)[0]]
        } catch (e) {
          const regex = /text\/html/i
          if (response.headers.get('content-type').match(regex)) {
            // text/html - don't return that whole thing
            m = ''
          }
        }
        // console.log('bad response', m)
        let message = `${response.status} ${response.statusText}`
        if (m.length) {
          message += ` - ${m}`
        }
        const error = Error(message)
        error.status = response.status
        error.statusText = response.statusText
        error.text = m
        throw error
      }
    } catch (e) {
      // just rethrow any other errors, like connection timeouts
      throw e
    }
  },
  setWorking ({commit}, {group, type, value = true}) {
    commit(types.SET_WORKING, {group, type, value})
  },
  setLoading ({commit}, {group, type, value = true}) {
    commit(types.SET_LOADING, {group, type, value})
  },
  async getUsers ({commit, dispatch, getters}) {
    // get system environment info
    dispatch('setLoading', {group: 'app', type: 'demo', value: true})
    try {
      const url = getters.endpoints.demo
      const options = {
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        }
      }
      const environment = await dispatch('fetch', {url, options})
      commit(types.SET_ENVIRONMENT, environment)
    } catch (e) {
      Toast.open({
        message: 'Failed to load demo environment information: ' + e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'app', type: 'demo', value: false})
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
