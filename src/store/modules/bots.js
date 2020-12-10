import * as types from '../mutation-types'
import {getUrlQueryParams} from '../../utils'
import router from '../../router'
import {ToastProgrammatic as Toast} from 'buefy/src'
import Vue from 'vue'

const state = {
  users: [],
  webhooks: {},
  memberships: {}
}

const getters = {
  users: state => state.users,
  webhooks: state => state.webhooks,
  memberships: state => state.memberships
}

const mutations = {
  [types.SET_USERS] (state, data) {
    // replace all users state data with new data
    state.users = data
  },
  [types.SET_WEBHOOKS] (state, {id, data}) {
    Vue.set(state.webhooks, id, data.items)
  },
  [types.SET_MEMBERSHIPS] (state, {id, data}) {
    Vue.set(state.memberships, id, data.items)
  }
}

const actions = {
  async createRooms ({dispatch, getters}, {
    userId,
    name,
    userRoomTitle,
    staffRoomTitle
  }) {
    await dispatch('fetch', {
      message: 'create helper bot user and staff rooms',
      group: 'room',
      type: 'create',
      url: `${getters.endpoints.user}/${userId}/rooms`,
      options: {
        method: 'POST',
        body: {
          name,
          userRoomTitle,
          staffRoomTitle
        }
      }
    })
    // refresh all data now
    dispatch('getBots')
  },
  async createMembership ({dispatch, getters}, {userId, roomId, personEmail}) {
    // join arbitrary person to bot's room
    const response = await dispatch('fetch', {
      message: 'add person to room',
      group: 'bot',
      type: userId,
      url: `${getters.endpoints.user}/${userId}/room/${roomId}/membership`,
      options: {
        method: 'POST',
        body: {
          personEmail
        }
      }
    })
    if (response instanceof Error) {
      // error
      if (response.status === 409) {
        // user already in room error
        Toast.open({
          message: `The user ${personEmail} is already in that Webex Teams Room`,
          duration: 6 * 1000,
          type: 'is-success'
        })
      } else {
        // unexpected error
        Toast.open({
          message: `Failed to add ${personEmail} to Webex Teams Room: ${response.status}`,
          duration: 12 * 1000,
          type: 'is-danger'
        })
      }
    } else {
      // success
      Toast.open({
        message: `Successfully added ${personEmail} to Webex Teams Room`,
        duration: 6 * 1000,
        type: 'is-success'
      })
    }
  },
  async joinRoom ({dispatch, getters}, {userId, roomId}) {
    // join bot to room
    await dispatch('fetch', {
      message: 'join helper bot user to a room',
      group: 'bot',
      type: userId,
      url: `${getters.endpoints.user}/${userId}/join/${roomId}`,
      options: {
        method: 'POST'
      }
    })
    // refresh data now
    dispatch('getMemberships', userId)
  },
  async createWebhook ({dispatch, getters}, userId) {
    await dispatch('fetch', {
      message: 'create helper bot user webhook',
      group: 'webhook',
      type: userId,
      url: `${getters.endpoints.user}/${userId}/webhook`,
      options: {
        method: 'POST'
      }
    })
    // refresh data now
    dispatch('getWebhooks', userId)
  },
  async deleteWebhook ({dispatch, getters}, {userId, webhookId}) {
    await dispatch('fetch', {
      message: 'delete helper bot user webhook',
      group: 'webhook',
      type: userId,
      url: `${getters.endpoints.user}/${userId}/webhook/${webhookId}`,
      options: {
        method: 'DELETE'
      }
    })
    // refresh data now
    dispatch('getWebhooks', userId)
  },
  async getWebhooks ({dispatch, getters}, userId) {
    dispatch('fetch', {
      message: 'get helper bot user webhooks list',
      group: 'webhook',
      type: userId,
      url: `${getters.endpoints.user}/${userId}/webhook`,
      mutation: types.SET_WEBHOOKS,
      transform: data => {
        return {
          data,
          id: userId
        }
      }
    })
  },
  async getMemberships ({dispatch, getters}, userId) {
    dispatch('fetch', {
      message: 'get helper bot user room membership list',
      group: 'webhook',
      type: userId,
      url: `${getters.endpoints.user}/${userId}/membership`,
      mutation: types.SET_MEMBERSHIPS,
      transform: data => {
        return {
          data,
          id: userId
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
    // get webhooks and memberships associated with each bot
    for (const user of users) {
      if (user._id) {
        dispatch('getWebhooks', user._id)
        dispatch('getMemberships', user._id)
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