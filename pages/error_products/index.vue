
<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content id="no_print" class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <div
            class="tw-flex tw-px-3 tw-justify-between tw-items-center tw-w-full tw-my-3"
          >
            <div class="tw-w-max tw-flex">
              <DatePicker v-model="filters.from_date" class="px-1" label="Start Date" />

              <DatePicker v-model="filters.to_date" class="px-1" label="End Date" :min="filters.from_date" />
              <v-autocomplete
                v-model="filters.product_id"
                :items="products"
                item-text="name"
                item-value="id"
                hide-details
                outlined
                dense
                clearable
                class="px-1"
                label="Products"
              />
              <v-text-field
                v-model="filters.search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                dense
                outlined
                class="mx-1"
              />
              <v-btn
                color="primary"
                :loading="loadingData"
                @click="searchFilter"
              >
                Search
              </v-btn>
            </div>

            <div class="tw-border-2">
              <v-btn
                color="primary"
                :loading="loadingData"
                @click="onCreate"
              >
                Create
              </v-btn>
            </div>
          </div>
          <v-data-table
            :headers="headers"
            :items="error_products"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="errProductOptions"
            :server-items-length="errProductOptions.totalItems"
          >
            <template #item="i">
              <tr>
                <td>{{ i.item.date }}</td>
                <td>{{ i.item.product_name }}</td>
                <td>{{ i.item.resourceable_name }}</td>
                <td>{{ i.item.qty }}</td>
                <td>{{ i.item.note }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {

  layout: 'dashboard',
  middleware: ['isAuth', 'merchantMiddleware'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    error_products: [],
    errProductOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    products: [],
    filters: {
      search: '',
      product_id: '',
      from_date: '',
      to_date: ''
    }

  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.PRODUCT_URL, this.jwt)
      if (status === 1) {
        this.products = data
        this.loadingData = false
      } else {
        this.loadingData = false
        this.handleStatus({ status, message, that: this })
      }
    } catch (error) {
      this.handleException({ error, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.errorProductsHeader(this.locale)
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
    'errProductOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.ERROR_PRODUCT_URL}`, this.errProductOptions)
        }, 500)
      },
      deep: true
    },
    'errProductOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.errProductOptions
        this.error_products = this.sortDataTable(sortBy, newVal, this.error_products)
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Error Products',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Error Products')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.ERROR_PRODUCT_URL}`, this.errProductOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.error_products = data
            this.setPaginationData(this, meta, this.errProductOptions)
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
    async onCreate () {
      await this.$router.push('/error_products/create')
    }

  }
}
</script>
