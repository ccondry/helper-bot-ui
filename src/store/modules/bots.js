import * as types from '../mutation-types'
import {getUrlQueryParams} from '../../utils'
import router from '../../router'
import {ToastProgrammatic as Toast} from 'buefy/src'
import Vue from 'vue'

const state = {
  users: [],
  webhooks: {}
}

const getters = {
  users: state => state.users,
  webhooks: state => state.webhooks,
}

const mutations = {
  [types.SET_USERS] (state, data) {
    // replace all users state data with new data
    state.users = data
  },
  [types.SET_WEBHOOKS] (state, {id, data}) {
    // console.log('SET_WEBHOOKS', {id, data })
    Vue.set(state.webhooks, id, data.items)
  }
}

const actions = {
  async createWebhook ({dispatch, getters}, id) {
    await dispatch('fetch', {
      message: 'create helper bot user webhook',
      group: 'user',
      type: id,
      url: `${getters.endpoints.user}/${id}/webhook`,
      options: {
        method: 'POST'
      }
    })
    // refresh data now
    dispatch('getWebhooks')
  },
  async getWebhooks ({dispatch, getters}, id) {
    dispatch('fetch', {
      message: 'get helper bot user webhooks list',
      group: 'webhook',
      type: id,
      url: `${getters.endpoints.user}/${id}/webhook`,
      mutation: types.SET_WEBHOOKS,
      transform: data => {
        return {
          data,
          id
        }
      }
    })
  },
  async getBots ({dispatch, getters}) {
    const users = await dispatch('fetch', {
      message: 'get helper bot users',
      group: 'bot',
      type: 'list',
      url: getters.endpoints.user,
      mutation: types.SET_USERS
    })
    // get webhooks associated with each bot
    for (const user of users) {
      if (user._id) {
        dispatch('getWebhooks', user._id)
      }
    }
  },
  async saveBot ({dispatch, getters}, body) {
    await dispatch('fetch', {
      message: 'save helper bot user',
      group: 'bot',
      type: body._id,
      url: getters.endpoints.user + '/' + body._id,
      options: {
        method: 'PUT',
        body
      }
    })
    // refresh data
    dispatch('getBots')
  },
  async createBot ({dispatch, getters}, body) {
    await dispatch('fetch', {
      message: 'create helper bot user',
      group: 'bot',
      type: 'create',
      url: getters.endpoints.user,
      options: {
        method: 'POST',
        body
      }
    })
    // refresh data
    dispatch('getBots')
  },
  async deleteBot ({dispatch, getters}, bot) {
    const response = await dispatch('fetch', {
      message: 'delete helper bot user',
      group: 'bot',
      type: bot._id,
      url: getters.endpoints.user + '/' + bot._id,
      options: {
        method: 'DELETE'
      }
    })
    if (!(response instanceof Error)) {
      // success
      Toast.open({
        message: `Successfully deleted bot user ${bot.personEmail}`,
        duration: 6 * 1000,
        type: 'is-success'
      })
    }
    // refresh data
    dispatch('getBots')
  },
  async checkCreateBot ({dispatch, getters}) {
    // get current URL query params
    const query = getUrlQueryParams()
    console.log('checkCreateBot', query)
    // check code exists and state is set to add user
    if (query.state === 'helper-add-user' && query.code) {
      const response = await dispatch('fetch', {
        url: getters.endpoints.user,
        group: 'bot',
        type: 'create',
        options: {
          method: 'POST',
          // pass our current URL query params to REST API body
          body: query
        },
      })
      if (response instanceof Error) {
        // unexpected SSO error - display it to user
        Toast.open({
          message: response.message,
          duration: 12 * 1000,
          type: 'is-danger'
        })
        // remove SSO code from the current URL query parameters
        delete query.code
        delete query.state
        router.push({query})
        // refresh bots list now
        dispatch('getBots')
      } else {
        // success
        Toast.open({
          message: response.message,
          duration: 6 * 1000,
          type: 'is-success'
        })
        // remove SSO code from the current URL query parameters
        delete query.code
        delete query.state
        router.push({query})
        // refresh bots list now
        dispatch('getBots')
      }
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}