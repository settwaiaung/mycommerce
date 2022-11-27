export const state = () => ({
  drawer: true,
  sidebarDark: false,
  snackMessage: '',
  showSnack: false,
  snackColor: '',
  breadCrumbItems: [],
  title: '',
  navUrl: '',
  navShow: false,
  deleteScreen: ''
})

export const mutations = {
  setDrawer (state, showDrawer) {
    state.drawer = showDrawer
  },
  toggleSidebarDark (state, val) {
    state.sidebarDark = val
  },
  // snackbar
  setSnackMessage (state, message) {
    state.snackMessage = message
  },
  setShowSnack (state, showSnack) {
    state.showSnack = showSnack
  },
  setSnackColor (state, color) {
    state.snackColor = color
  },
  // end snackbar
  setBreadCrumbItems (state, breadCrumbItems) {
    state.breadCrumbItems = breadCrumbItems
  },
  // END BREADCRUMB
  setTitle (state, title) {
    state.title = title
  },
  // Navigation
  setNavUrl (state, url) {
    state.navUrl = url
  },
  setNavShow (state, show) {
    state.navShow = show
  },
  setDeleteScreen (state, screen) {
    state.deleteScreen = screen
  }
}
export const actions = {
  setDrawer ({ commit }, showDrawer) {
    commit('setDrawer', showDrawer)
  },
  // snack
  setSnackMessage ({ commit }, message) {
    commit('setSnackMessage', message)
  },
  setShowSnack ({ commit }, showSnack) {
    commit('setShowSnack', showSnack)
  },
  setSnackColor ({ commit }, color) {
    commit('setSnackColor', color)
  },
  // breadcrumb
  setBreadCrumbItems ({ commit }, breadCrumbItems) {
    commit('setBreadCrumbItems', breadCrumbItems)
  },
  setTitle ({ commit }, title) {
    commit('setTitle', title)
  },
  setNavUrl ({ commit }, url) {
    commit('setNavUrl', url)
  },
  setNavShow ({ commit }, show) {
    commit('setNavShow', show)
  },
  setDeleteScreen ({ commit }, screen) {
    commit('setDeleteScreen', screen)
  },
  handleStatus ({ dispatch }, { status, message, that, successMessage = '' }) {
    if (status === 1) {
      dispatch('openSnackBar', { snackMessage: successMessage, snackColor: 'success' })
    }
    if (status === 2) {
      typeof message === 'object'
        ? dispatch('openSnackBar', { snackMessage: `Error: ${Object.values(message)[0][0]}`, snackColor: 'error' })
        : dispatch('openSnackBar', { snackMessage: `Error: ${message}`, snackColor: 'error' })
    } else if (status === 3) {
      dispatch('openSnackBar', { snackMessage: `Error: ${message}`, snackColor: 'error' })
      dispatch('auth/clearAuth')
      that.$router.push('/')
      return false
    }
  },
  handleException ({ dispatch }, errorParams) {
    const { error } = errorParams
    const message = typeof error === 'object' && error.response ? error.response.data.message : `${error} !`
    dispatch('openSnackBar', { snackMessage: message, snackColor: 'error' })
  },
  openSnackBar ({ commit }, snackParam) {
    const { snackMessage, snackColor } = snackParam
    commit('setSnackMessage', snackMessage)
    commit('setSnackColor', snackColor)
    commit('setShowSnack', true)
  },
  async getDetail ({ commit, dispatch }, params) {
    const { url, jwt, that } = params
    try {
      const { message, status, data } = await this._vm.$request.fetchData(url, jwt)
      if (status === 1) {
        return data
      } else {
        dispatch('handleStatus', { status, message, that })
      }
    } catch (error) {
      dispatch('handleException', { error })
    }
  }
}
export const getters = {
  snackMessage: ({ snackMessage }) => snackMessage,
  snackColor: ({ snackColor }) => snackColor,
  breadCrumbItems: ({ breadCrumbItems }) => breadCrumbItems,
  title: ({ title }) => title,
  navUrl: ({ navUrl }) => navUrl,
  navShow: ({ navShow }) => navShow,
  deleteScreen: ({ deleteScreen }) => deleteScreen
}
