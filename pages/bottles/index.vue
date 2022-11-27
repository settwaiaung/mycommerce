<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="bottle_returns"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="bottleOptions"
            :server-items-length="bottleOptions.totalItems"
          >
            <template #top>
              <v-toolbar
                flat
              >
                <v-text-field
                  v-model="filters.search"
                  label="Search"
                  single-line
                  hide-details
                  @keyup.enter="searchFilter"
                />
                <v-btn
                  class="tw-ml-3"
                  color="primary"
                  dark
                  @click="searchFilter"
                >
                  Search
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  dark

                  @click="onNew"
                >
                  {{ trans('new') }}
                </v-btn>

                <v-btn
                  color="primary"
                  outlined
                  class="tw-ml-3"
                  :loading="loadingData"
                  @click="exportData"
                >
                  Export
                </v-btn>
              </v-toolbar>
            </template>
            <template #[`item.status`]="{item}">
              <v-checkbox
                v-model="item.status"
                color="success"
                hide-details
                readonly
              />
            </template>
            <template #[`item.actions`]="{item}">
              <v-icon
                color="primary"
                class="mr-2"
                @click="onDetail(item)"
              >
                mdi-eye
              </v-icon>
            </template>
          </v-data-table>
        </v-stepper-content>
        <BottleForm v-model="selectedBottle" @onGoBack="handleGoBack" />
        <CreateBottleReturnForm v-model="selectedBottle" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="Bottle Return" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BottleForm from '@/components/forms/top/BottleForm.vue'
import CreateBottleReturnForm from '@/components/forms/top/CreateBottleReturnForm.vue'
export default {
  components: {
    BottleForm,
    CreateBottleReturnForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    loadingData: false,
    bottle_returns: [],
    bottleOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      search: ''
    },
    selectedBottle: {}
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.bottleHeader(this.locale)
    },
    query () {
      let query = '?paginate=25'
      for (const property in this.filters) {
        if (this.filters[property]) {
          query += `&${property}=${this.filters[property]}`
        }
      }
      return query
    },
    isEmptyQuery () {
      return Object.values(this.filters).every(
        value => value === '' || value === undefined || value == null
      )
    }
  },
  watch: {
    'bottleOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.BOTTLE_URL}`, this.bottleOptions)
        }, 500)
      },
      deep: true
    },
    // 'filters.search': {
    //   handler () {
    //     this.paginationDataTable(this, `${this.$url.BOTTLE_URL}`, this.bottleOptions)
    //   },
    //   deep: true
    // },
    'bottleOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.bottleOptions
        this.bottle_returns = this.sortDataTable(sortBy, newVal, this.bottle_returns)
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Bottle Returns',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Bottle Returns')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.bottle_returns.findIndex(
        bottle_return => bottle_return.id === data.id
      )
      this.bottle_returns.splice(foundIndex, 1)
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.BOTTLE_URL}`, this.bottleOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.bottle_returns = data
            this.setPaginationData(this, meta, this.bottleOptions)
          }, 100)
        } else {
          this.loadingData = false
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.loadingData = false
    },
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedBottle = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.bottle_returns.findIndex(
          bottle_return => bottle_return.id === data.id
        )
        this.bottle_returns.splice(foundIndex, 1, {
          ...data
        })
      } else {
        data.product.name = data.product.product_name
        data.total_bottle = data.qty
        data.remain_bottle = data.qty
        this.bottle_returns.unshift({ ...data })
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 3
    },
    async onDetail (item) {
      const itemDetail = await this.$store.dispatch('getDetail', { url: `${this.$url.BOTTLE_URL}/${item.id}`, jwt: this.jwt, that: this })
      this.selectedBottle = (({
        id,
        customer,
        product,
        sale,
        total_bottle,
        remain_bottle,
        bottle_return_histories,
        bottle_return_items
      }) => ({
        id,
        customer,
        product,
        sale,
        total_bottle,
        remain_bottle,
        returnning_bottle: remain_bottle,
        bottle_return_histories,
        bottle_return_items
      }))(JSON.parse(JSON.stringify(itemDetail)))
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.BOTTLE_URL, this.jwt)
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(
          this.$url.BOTTLE_URL + this.query + '&export=true',
          this.jwt
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'bottles.xlsx')
        document.body.appendChild(link)
        link.click()
        this.loadingData = false
      } catch (error) {
        this.handleException({ error, that: this })
      }
    }
  }
}
</script>
