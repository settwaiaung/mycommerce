<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content id="no_print" class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <v-data-table
            :headers="headers"
            :items="sales"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="saleItemOptions"
            :server-items-length="saleItemOptions.totalItems"
            group-by="category_name"
            item-key="id"
          >
            <template #top>
              <v-row
                flat
                class="pa-2"
              >
                <v-col md="3">
                  <DatePicker v-model="filters.from_date" label="Start Date" />
                </v-col>
                <v-col md="3">
                  <DatePicker v-model="filters.to_date" label="End Date" :min="filters.from_date" />
                </v-col>
                <v-col md="3">
                  <v-autocomplete
                    v-model="filters.payment_status"
                    :items="payment_status"
                    item-text="name"
                    item-value="value"
                    hide-details
                    outlined
                    dense
                    class="px-1"
                    label="Payment Status"
                  />
                </v-col>
                <v-col md="3" class="d-flex flex-row">
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
                    outlined
                    color="primary"
                    class="py-5 mx-1"
                    :disabled="isEmptyQuery"
                    @click="searchFilter"
                  >
                    Search
                  </v-btn>
                  <v-spacer />
                  <v-btn :disabled="isEmptyQuery" outlined color="primary" class="py-5" @click="exportData">
                    Export
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <template #[`group.header`]="{items, isOpen}">
              <th colspan="5" class="tw-bg-primary">
                <!-- <v-icon>
                  {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                </v-icon> -->
                {{ isOpen?'📦 ':'📦 ' }}
                <span class="mx-2">{{ items[0].category_name }}</span>
              </th>
            </template>
            <template #[`item.price`]="{ item }">
              <span>{{ curFm(item.price) }}</span>
            </template>
            <template #[`item.total_item`]="{ item }">
              <span>{{ parseInt(item.total_item) }}</span>
            </template>
            <template #[`item.grand_total`]="{ item }">
              <span>{{ curFm(item.grand_total) }}</span>
            </template>
            <template #[`item.actions`]="{item}">
              <v-icon
                color="primary"
                class="mr-2"
                @click="handleDetail(item)"
              >
                mdi-eye
              </v-icon>
              <v-icon
                color="secondary"
                medium
                class="mr-2"
                @click="handlePrint(item,)"
              >
                mdi-printer-eye
              </v-icon>
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
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    sales: [],
    saleItemOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      from_date: '',
      to_date: '',
      payment_status: ''
    },
    payment_status: [
      { name: 'New', value: 'new' },
      { name: 'Outstanding', value: 'outstanding' },
      { name: 'Paid', value: 'paid' }
    ]
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.saleItemReportHeader(this.locale)
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
    'saleItemOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal || this.isEmptyQuery) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.SALE_ITEM_REPORT_URL}`, this.saleItemOptions)
        }, 500)
      },
      deep: true
    },
    'saleItemOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.saleItemOptions
        this.sales = this.sortDataTable(sortBy, newVal, this.sales)
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Sale Item Report',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Sale Item Report')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    searchFilter () {
      if (this.isEmptyQuery) { return }
      this.paginationDataTable(this, `${this.$url.SALE_ITEM_REPORT_URL}`, this.saleItemOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.sales = data
            this.setPaginationData(this, meta, this.saleItemOptions)
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
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(this.$url.SALE_ITEM_REPORT_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'sale_items_report.xlsx')
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
