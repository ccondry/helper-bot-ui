import * as types from '../mutation-types'

const state = {
  users: []
}

const getters = {
  users: state => state.users
}

const mutations = {
  [types.SET_USERS] (state, data) {
    // replace all users state data with new data
    state.users = data
  }
}

const actions = {
  async getUsers ({dispatch, getters}) {
    dispatch('fetch', {
      message: 'get helper bot users',
      group: 'bot',
      type: 'list',
      url: getters.endpoints.user,
      mutation: types.SET_USERS
    })
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
    dispatch('getUsers')
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}