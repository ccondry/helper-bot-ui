import {ToastProgrammatic as Toast} from 'buefy/src'
import {fetch} from '../../utils'
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
  },
  [types.UPSERT_USERS] (state, data) {
    // update users in state
    for (const user of data) {
      const index = state.users.findIndex(v => v.sAMAccountName === user.sAMAccountName)
      if (index >= 0) {
        state.users.splice(index, 1, user)
      } else {
        state.users.push(user)
      }
    }
  },
  [types.REMOVE_USER] (state, username) {
    // remove one user from state
    const index = state.users.findIndex(v => v.sAMAccountName === username)
    if (index >= 0) {
      console.log('REMOVE_USER', index)
      state.users.splice(index, 1)
    }
  }
}

const actions = {
  async setUserPassword ({dispatch, getters}, {username, password}) {
    // reset user password in ldap
    dispatch('setWorking', {group: 'user', type: username, value: true})
    try {
      const url = getters.endpoints.user + '/' + username + '/password'
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getters.jwt
        },
        body: {username, password}
      }
      await dispatch('fetch', {url, options})
      dispatch('getUser', username)
      // this user setting their own password?
      if (getters.jwtUser.sub === username) {
        Toast.open({
          message: 'Your password has been changed.',
          type: 'is-success'
        })
      } else {
        // admin setting user password
        Toast.open({
          message: 'Successfully changed user password.',
          type: 'is-success'
        })
      }
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: username, value: false})
    }
  },
  // get single AD user
  async getUser ({commit, dispatch, getters}, username) {
    // console.log('admin.getUser action')
    dispatch('setLoading', {group: 'user', type: username, value: true})
    const url = getters.endpoints.user + '/' + username
    const options = {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      const user = await dispatch('fetch', {url, options})
      // console.log('getUser:', user)
      this.commit(types.UPSERT_USERS, [user])
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'user', type: username, value: false})
    }
  },
  async setUserExpiration ({getters, dispatch}, {username, hour = 12}) {
    // extend accountExpires by specified ms (default to 12 hours)
    console.log('ldap.setUserExpiration action')
    dispatch('setWorking', {group: 'user', type: username, value: true})
    const url = getters.endpoints.user + '/' + username + '/extend'
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      },
      body: {hour}
    }
    try {
      await dispatch('fetch', {url, options})
      // success - refresh user data
      dispatch('getUser', username)
      // notify user success
      if (getters.jwtUser.sub === username) {
        // this user
        Toast.open({
          message: `Your account expiration has been reset to ${hour} hours.`,
          duration: 4 * 1000,
          type: 'is-success'
        })
      } else {
        // admin for another user
        Toast.open({
          message: `${username} account expiration set to ${hour} hours`,
          duration: 4 * 1000,
          type: 'is-success'
        })
      }
    } catch (e) {
      Toast.open({
        message: `Failed to set account expiration: ${e.message}`,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: username, value: false})
    }
  },
  // delete AD user
  async deleteUser ({dispatch, getters}, username) {
    // console.log('ldap.deleteUser action')
    dispatch('setWorking', {group: 'user', type: username, value: true})
    const url = getters.endpoints.user + '/' + username
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      // remove user from AD
      await dispatch('fetch', {url, options})
      // remove user from state
      this.commit(types.REMOVE_USER, username)
      // notify user
      Toast.open({
        message: `Successfully deleted user ${username}`,
        duration: 6 * 1000,
        type: 'is-success'
      })
    } catch (e) {
      // notify user
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: username, value: false})
    }
  },
  // get AD users list
  async getUsers ({dispatch, getters}) {
    // console.log('ldap.getUsers action')
    // check user active directory user exists
    dispatch('setLoading', {group: 'ldap', type: 'user', value: true})
    const url = getters.endpoints.user
    const options = {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      const users = await dispatch('fetch', {url, options})
      console.log('getUsers:', users)
      this.commit(types.SET_USERS, users)
      // Toast.open({
      //   message: user,
      //   duration: 10 * 1000,
      //   type: 'is-success'
      // })
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setLoading', {group: 'ldap', type: 'user', value: false})
    }
  },
  async createUser ({dispatch, getters}, {dn, password}) {
    console.log('ldap.createUser action')
    dispatch('setWorking', {group: 'user', type: getters.jwtUser.sub, value: true})

    const url = getters.endpoints.user
    const options = {
      method: 'POST',
      body: {dn, password},
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
    try {
      await dispatch('fetch', {url, options})
      dispatch('getUser', getters.jwtUser.sub)
      Toast.open({
        message: 'Successfully created your user account',
        type: 'is-success'
      })
    } catch (e) {
      Toast.open({
        message: e.message,
        duration: 10 * 1000,
        type: 'is-danger'
      })
    } finally {
      dispatch('setWorking', {group: 'user', type: getters.jwtUser.sub, value: false})
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}