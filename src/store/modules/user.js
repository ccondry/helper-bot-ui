import {
  addUrlQueryParams,
  getUrlQueryParams
} from '../../utils'
import {ToastProgrammatic as Toast} from 'buefy/src'
import * as types from '../mutation-types'
import router from '../../router'

// parse a JWT payload into a JSON object
function parseJwt (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const state = {
  jwt: null
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  }
}

const getters = {
  isAdmin: (state, getters) => {
    try {
      // const adminGroupDn = 'CN=test,CN=Users,DC=uk,DC=cms-dcloud,DC=com'
      // return getters.adUser.memberOf.includes(adminGroupDn)
      return getters.jwtUser.isAdmin
    } catch (e) {
      return false
    }
  },
  adUser: (state, getters) => {
    try {
      return getters.users.find(v => v.sAMAccountName === getters.jwtUser.sub)
    } catch (e) {
      return null
    }
  },
  jwt: state => state.jwt,
  isLoggedIn: (state, getters) => {
    try {
      return getters.jwtUser.email.length > 0
    } catch (e) {
      return false
    }
  },
  jwtUser: state => {
    try {
      return parseJwt(state.jwt)
    } catch (e) {
      return null
    }
  },
  ssoRedirectUri: () => {
    // the URL the browser should return to once SSO is done
    return `${window.location.protocol}//${window.location.host}/`
  },
  ssoUrl: (state, getters) => {
    // the URL to send the user to for SSO login
    const endpoint = 'https://cloudsso.cisco.com/as/authorization.oauth2'
    const scopes = [
      'profile',
      'email',
      'openid'
    ]
    const params = {
      client_id: 'helper-bot-login',
      response_type: 'code',
      redirect_uri: getters.ssoRedirectUri,
      scope: scopes.join(' '),
      state: 'helper-bot-login'
    }
    return addUrlQueryParams(endpoint, params)
  }
}

const actions = {
  setJwt ({commit, dispatch}, jwt) {
    try {
      // test parse JWT to user JSON
      parseJwt(jwt)
      // put JWT in state
      commit(types.SET_JWT, jwt)
      // put JWT in localStorage
      window.localStorage.setItem('jwt', jwt)
      // get main site data for user
      dispatch('getRooms')
    } catch (e) {
      // parseJwt failed - delete this invalid JWT
      dispatch('unsetJwt')
    }
  },
  unsetJwt ({commit}) {
    // remove JWT from state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
  },
  logout ({dispatch}) {
    dispatch('unsetJwt')
  },
  async checkJwt ({dispatch, getters}) {
    // get current URL query params
    const query = getUrlQueryParams()
    // check jwt in browser local storage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null && jwt.length > 40) {
      console.log('found existing JWT in localStorage')
      // check jwt is valid
      const response = await dispatch('fetch', {
        group: 'user',
        type: 'valid',
        message: 'check if user login is valid',
        url: getters.endpoints.validLogin,
        options: {
          headers: {
            Authorization: 'Bearer ' + jwt
          }
        }
      })
      if (response instanceof Error) {
        // unexpected error, like network error or 500 error
        Toast.open({
          message: 'Failed to check get your CMS user information: ' + e.message,
          duration: 8 * 1000,
          type: 'is-danger'
        })
      } else {
        dispatch('setJwt', jwt)
      }
    } else if (query.state === 'helper-bot-login' && query.code) {
      // no JWT in localstorage, but has SSO login auth code. complete SSO login.
      const response = await dispatch('fetch', {
        url: getters.endpoints.sso,
        group: 'user',
        type: 'login',
        options: {
          method: 'POST',
          // pass our current URL query params to REST API body
          body: query
        },
        onError (e) {
          const regex = /^Authorization code is invalid or expired/i
          if (e.status === 400 && e.text.match(regex)) {
            // expired SSO auth code - send user back to SSO login
            window.location = getters.ssoUrl
          } else {
            // unexpected SSO error - display to user
            Toast.open({
              message: e.message,
              duration: 10 * 1000,
              type: 'is-danger'
            })
          }
        }
      })
      if (response.jwt) {
        // save the new JWT. user is now logged in.
        dispatch('setJwt', response.jwt)
        // remove SSO code from the current URL query parameters
        delete query.code
        delete query.state
        router.push({query})
      }
    } else {
      // no JWT and no SSO auth code - send user to SSO login
      window.location = getters.ssoUrl
    }
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}