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
      group: 'bot',
      type: 'users',
      url: getters.endpoints.user,
      mutation: types.SET_USERS
    })
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}