import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy/src'
import Vue from 'vue'

const state = {
  rooms: [],
  titles: {}
}

const getters = {
  rooms: state => state.rooms,
  roomTitles: state => state.titles
}

const mutations = {
  [types.SET_ROOMS] (state, data) {
    state.rooms = data
  },
  [types.SET_ROOM_DETAILS] (state, data) {
    // store room name
    Vue.set(state.titles, data.id, data.title)
  }
}

const actions = {
  getRooms ({dispatch, getters}) {
    dispatch('fetch', {
      message: 'get helper bot rooms',
      group: 'room',
      type: 'list',
      url: getters.endpoints.rooms,
      mutation: types.SET_ROOMS
    })
  },
  getRoomDetails ({dispatch, getters}, roomId) {
    dispatch('fetch', {
      message: 'get helper bot room details',
      group: 'room',
      type: roomId,
      url: getters.endpoints.rooms + '/' + roomId,
      mutation: types.SET_ROOM_DETAILS
    })
  },
  async joinSupportRoom ({dispatch, getters}, {id, title}) {
    const response = await dispatch('fetch', {
      message: 'join support room',
      group: 'room',
      type: 'join',
      url: getters.endpoints.rooms + '/' + id + '/join',
      options: {
        method: 'POST'
      }
    })
    if (response instanceof Error) {
      // error
      if (response.status === 409) {
        Toast.open({
          message: `You are already a member of ${title}.`,
          duration: 6 * 1000,
          type: 'is-success'
        })
      }
    } else {
      // success
      Toast.open({
        message: `You have been added to the ${title}.`,
        duration: 6 * 1000,
        type: 'is-success'
      })
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}