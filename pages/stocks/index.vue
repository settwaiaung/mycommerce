<template>
  <div>
    <div v-shortkey="['enter']" class="tw-my-5 tw-flex tw-justify-end tw-items-center" @shortkey="searchFilter">
      <v-col sm="4" class="tw-flex width">
        <v-text-field
          v-model="filters.search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          dense
          outlined
        />

        <v-btn
          color="primary"
          class="tw-ml-3"
          :loading="loadingData"
          @click="searchFilter"
        >
          Search
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
      </v-col>
    </div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="stocks"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="stockOptions"
            :server-items-length="stockOptions.totalItems"
          >
            <template #[`item.error_qty`]="{item}">
              <span style="color:red">{{ item.error_qty }}</span>
            </template>
            <template #[`item.actions`]="{item}">
              <v-icon
                color="primary"
                class="mr-2"
                @click="onDetail(item)"
              >
                mdi-eye
              </v-icon>
              <v-icon
                color="primary"
                class="mr-2"
                @click="addStock(item)"
              >
                mdi-plus-thick
              </v-icon>
            </template>
          </v-data-table>
        </v-stepper-content>
        <StockForm v-model="selectedStock" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <AddStock screen="Sale" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import StockForm from '@/components/forms/stock/StockForm.vue'
import AddStock from '~/components/base/AddStock.vue'
export default {
  components: {
    StockForm,
    AddStock
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    loadingData: false,
    stocks: [],
    stockOptions: {
      itemsPerPage: -1,
      totalItems: 0
    },
    filters: {
      search: ''
    }
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.stockHeader(this.locale)
    },
    query () {
      let query = '?paginate=25'
      for (const property in this.filters) {
        if (this.filters[property]) { query += `&${property}=${this.filters[property]}` }
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
    'stockOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.STOCK_URL}`, this.stockOptions)
        }, 500)
      },
      deep: true
    },
    // 'filters.search': {
    //   handler () {
    //     this.paginationDataTable(this, `${this.$url.STOCK_URL}`, this.stockOptions)
    //   },
    //   deep: true
    // },
    'stockOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.stockOptions
        this.stocks = this.sortDataTable(sortBy, newVal, this.stocks)
      },
      deep: true
    }
  },

  mounted () {
    const breadCrumbs = [
      {
        text: 'Stock Lists',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Stock Lists')
    this.$store.dispatch('setNavShow', true)

    this.$on('addStockedData', (data) => {
      const foundIndex = this.stocks.findIndex(
        stock => stock.id === data.id
      )
      this.stocks.splice(foundIndex, 1, {
        ...data
      })
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.STOCK_URL}`, this.stockOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.stocks = data
            this.setPaginationData(this, meta, this.stockOptions)
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
      this.selectedStock = {}
    },
    async onDetail (item) {
      const itemDetail = await this.$store.dispatch('getDetail', { url: `${this.$url.STOCK_URL}/${item.id}`, jwt: this.jwt, that: this })
      this.selectedStock = (({
        id,
        product_name,
        product_price,
        qty,
        product_item_code,
        product_id
      }) => ({
        id,
        product_name,
        product_price,
        qty,
        product_item_code,
        product_id
      }))(JSON.parse(JSON.stringify(itemDetail)))
      this.step = 2
    },
    addStock (item) {
      this.$emit('addStock', item, this.$url.STOCK_URL, this.jwt)
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(this.$url.STOCK_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'stock_report.xlsx')
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
