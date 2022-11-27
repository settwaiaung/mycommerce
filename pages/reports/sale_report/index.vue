<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content id="no_print" class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <v-toolbar
            class="d-flex justify-space-between"
            color="grey lighten-4"
            flat
          >
            <v-autocomplete
              v-model="filters.customer_type_id"
              :items="customer_types"
              item-text="name"
              item-value="id"
              hide-details
              outlined
              dense
              class="px-1"
              label="Customer Type"
            />
            <v-autocomplete
              v-model="filters.source_id"
              :items="sources"
              item-text="name"
              item-value="id"
              hide-details
              outlined
              dense
              class="px-1"
              label="Source"
            />
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
          </v-toolbar>
          <v-data-table
            :headers="headers"
            :items="sales"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="saleOptions"
            :server-items-length="saleOptions.totalItems"
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
                <v-col md="4" class="d-flex flex-row">
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
            <template #[`item.total_amount`]="{ item }">
              <span>{{ curFm(item.total_amount) ||0 }}</span>
            </template>
            <template #[`item.total_discount`]="{ item }">
              <span>{{ curFm(item.total_discount)||0 }}</span>
            </template>
            <template #[`item.delivery_amount`]="{ item }">
              <span>{{ curFm(item.delivery_amount)||0 }}</span>
            </template>
            <template #[`item.grand_total`]="{ item }">
              <span>{{ curFm(item.grand_total)||0 }}</span>
            </template>
            <template #[`item.paid_amount`]="{ item }">
              <span>{{ curFm(item.paid_amount)||0 }}</span>
            </template>
            <template #[`item.outstanding_amount`]="{ item }">
              <span>{{ curFm(item.outstanding_amount)||0 }}</span>
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
            <template slot="body.append">
              <tr>
                <td class="font-weight-bold" colspan="6">
                  Total
                </td>

                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.total_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.total_discount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.delivery_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.grand_total)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.paid_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.outstanding_amount)||0 }}
                </td>
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
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    sales: [],
    saleOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      from_date: '',
      to_date: '',
      customer_type_id: '',
      source_id: '',
      search: '',
      payment_status: ''
    },
    customer_types: [],
    sources: [],
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
      return this.$tableHeaders.saleReportHeader(this.locale)
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
    },
    total () {
      const total = this.sales.reduce((acc, d) => {
        acc.total_amount += parseInt(d.total_amount)
        acc.total_discount += parseInt(d.total_discount)
        acc.delivery_amount += parseInt(d.delivery_amount)
        acc.grand_total += parseInt(d.grand_total)
        acc.paid_amount += parseInt(d.paid_amount)
        acc.outstanding_amount += parseInt(d.outstanding_amount)
        return acc
      }
      , {
        total_amount: 0,
        total_discount: 0,
        delivery_amount: 0,
        grand_total: 0,
        paid_amount: 0,
        outstanding_amount: 0
      }
      )
      return total
    }
  },
  watch: {
    'saleOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal || this.isEmptyQuery) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.SALE_REPORT_URL}`, this.saleOptions)
        }, 500)
      },
      deep: true
    },
    'saleOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.saleOptions
        this.sales = this.sortDataTable(sortBy, newVal, this.sales)
      },
      deep: true
    }
  },
  async beforeMount () {
    this.sources = await this.getFromLocalStorage('stored:sources')
    this.customer_types = await this.getFromLocalStorage('stored:customer_types')
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Sales Report',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Sales Report')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    searchFilter () {
      if (this.isEmptyQuery) { return }
      this.paginationDataTable(this, `${this.$url.SALE_REPORT_URL}`, this.saleOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.sales = data
            this.setPaginationData(this, meta, this.saleOptions)
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
        const response = await this.$request.exportData(this.$url.SALE_REPORT_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'sale_report.xlsx')
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
