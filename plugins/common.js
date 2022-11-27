import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import localforage from 'localforage'
import language from '~/core/language'
import SnackBar from '@/components/base/SnackBar'
import LoadingCircle from '@/components/base/LoadingCircle'
import LoadingRotate from '@/components/base/LoadingRotate'
import ConfirmDelete from '@/components/base/ConfirmDelete'
import ConfirmActive from '@/components/base/ConfirmActive'
import ConfirmPassword from '@/components/utils/ConfirmPassword.vue'
import DatePicker from '@/components/utils/DatePicker.vue'
Vue.mixin({
  computed: {
    ...mapGetters({
      snackMessage: 'snackMessage'
    })
  },
  methods: {
    // ...mapMutations({
    //   setSnackMessage: 'setSnackMessage',
    //   setShowSnack: 'setShowSnack',
    //   setSnackColor: 'setSnackColor'
    // }),
    ...mapActions({
      clearAuth: 'auth/clearAuth'

    }),
    // openSnackBar (that, snackbarMessage, snacColor) {
    //   that.setSnackMessage(snackbarMessage)
    //   that.setSnackColor(snacColor)
    //   that.setShowSnack(true)
    // },
    trans (val) {
      return language(val)[this.locale]
    },
    handleStatus ({ status, message, that, successMessage = '' }) {
      // if (status === 1) {
      //   that.openSnackBar(that, successMessage, 'success')
      // } else if (status === 2) {
      //   typeof message === 'object'
      //     ? that.openSnackBar(that, `Error: ${Object.values(message)[0][0]}`, 'error')
      //     : that.openSnackBar(that, `Error: ${message}`, 'error')
      //   that.disabledButton = false
      //   that.isLoading = false
      // } else if (status === 3) {
      //   that.clearAuth()
      //   that.$router.push('/')
      //   return false
      // }
      if (status === 2) {
        that.disabledButton = false
        that.isLoading = false
      }
      this.$store.dispatch('handleStatus', { status, message, that, successMessage })
    },
    handleException ({ error, that }) {
      // const message = typeof error === 'object' && error.response ? error.response.data.message : `${error} !`
      // that.disabledButton = false
      // that.isLoading = false
      // that.openSnackBar(that, message, 'error')
      // that.loadingData = false
      that.disabledButton = false
      that.isLoading = false
      that.loadingData = false
      this.$store.dispatch('handleException', { error })
    },
    resetForm (that) {
      that.$refs.form.reset()
      that.$refs.form.resetValidation()
      that.$refs.observer.reset()
    },
    closeFormDialog (that) {
      that.isOpenFormDialog = false
      that.$refs.form.reset()
      that.$refs.form.resetValidation()
      that.$refs.observer.reset()
      that.model.id = null
      that.disabledButton = false
      that.isLoading = false
      that.dialogTitle = ''
    },
    async saveToLocalStorage (key, data) {
      await localforage.setItem(key, data)
    },
    async getFromLocalStorage (key) {
      // return (
      //   await localforage.getItem(key)
      // ).sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1))
      const localData = await localforage.getItem(key)
      return localData.sort((a, b) => (Object.keys(a)[1].toUpperCase() > Object.keys(b)[1].toUpperCase() ? -1 : 1))
    },
    isQty (evt) {
      evt = (evt) || window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode
      // allow + and -
      if (charCode === 45) {
        return true
      } else if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46 && charCode !== 8 && charCode !== 0) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    isNumber (evt) {
      evt = (evt) || window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46 && charCode !== 8 && charCode !== 0) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    paginationDataTable (that, api_url, options) {
      const { page, itemsPerPage, sortBy } = options
      let query = `page=${page}&paginate=${itemsPerPage}`
      for (const property in that.filters) {
        if (that.filters[property]) { query += `&${property}=${that.filters[property]}` }
      }

      const url =
        api_url +
        '?' +
        query +
        '&sortBy=' +
        sortBy
      return that.getDataFromApi(url)
    },
    setPaginationData (that, meta, options) {
      options.totalItems = meta.total
      // options.itemsPerPage = parseInt(meta.per_page)
      options.page = meta.current_page
      options.pageCount = meta.pageCount
      that.loadingData = false
    },
    sortDataTable (sortBy, sortDesc, dataSource) {
      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortedData = dataSource.sort((a, b) => {
          const sortA = a[sortBy[0]]
          const sortB = b[sortBy[0]]

          if (sortDesc[0]) {
            if (sortA < sortB) { return 1 }
            if (sortA > sortB) { return -1 }
            return 0
          } else {
            if (sortA < sortB) { return -1 }
            if (sortA > sortB) { return 1 }
            return 0
          }
        })
        return sortedData
      } else {
        return dataSource
      }
    },
    curFm (value) {
      if (!value) { return }
      // const val = value.toFixed()
      return parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0
    },
    printDetail () {
      setTimeout(() => window.print(), 1000)
    }
  }
})
Vue.component('SnackBar', SnackBar)
Vue.component('LoadingCircle', LoadingCircle)
Vue.component('LoadingRotate', LoadingRotate)
Vue.component('ConfirmDelete', ConfirmDelete)
Vue.component('ConfirmActive', ConfirmActive)
Vue.component('ConfirmPassword', ConfirmPassword)
Vue.component('DatePicker', DatePicker)
