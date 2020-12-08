const getters = {
  endpoints: (state, getters) => {
    const urlBase = getters.isProduction ? '/api/v1' : 'http://localhost:4006/api/v1'
    return {
      sso: `${urlBase}/sso`,
      users: `${urlBase}/users`,
      user: `${urlBase}/user`,
      demo: `${urlBase}/demo`,
      validLogin: `${urlBase}/valid`
    }
  },
  defaultRestOptions: (state, getters) => {
    return {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
  }
}

export default {
  getters
}