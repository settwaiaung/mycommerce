export const state = () => ({
  locale: 'en'
})

export const mutations = {
  SET_LOCALE (state, payload) {
    state.locale = payload
  }
}

export const actions = {
  // Set Token
  setLocale ({ commit }, payload) {
    commit('SET_LOCALE', payload)
  }
}

export const getters = {
  // userObj
  getLocale: ({ locale }) => locale
}
