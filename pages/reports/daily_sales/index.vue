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
            <template #[`item.cash_amount`]="{ item }">
              <span>{{ curFm(item.cash_amount) }}</span>
            </template>
            <template #[`item.kpay_amount`]="{ item }">
              <span>{{ curFm(item.kpay_amount) }}</span>
            </template>
            <template #[`item.kbz_amount`]="{ item }">
              <span>{{ curFm(item.kbz_amount) }}</span>
            </template>
            <template #[`item.cb_pay_amount`]="{ item }">
              <span>{{ curFm(item.cb_pay_amount) }}</span>
            </template>
            <template #[`item.cb_amount`]="{ item }">
              <span>{{ curFm(item.cb_amount) }}</span>
            </template>
            <template #[`item.aya_pay_amount`]="{ item }">
              <span>{{ curFm(item.aya_pay_amount) }}</span>
            </template>
            <template #[`item.aya_amount`]="{ item }">
              <span>{{ curFm(item.aya_amount) }}</span>
            </template>
            <template #[`item.wave_pay_amount`]="{ item }">
              <span>{{ curFm(item.wave_pay_amount) }}</span>
            </template>
            <template #[`item.total_discount`]="{ item }">
              <span>{{ curFm(item.total_discount)||0 }}</span>
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
            <template slot="body.append">
              <tr>
                <td class="font-weight-bold">
                  Total
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.cash_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.kpay_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.kbz_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.cb_pay_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.cb_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.aya_pay_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.aya_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.wave_pay_amount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.total_discount)||0 }}
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ curFm(total.grand_total)||0 }}
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
      search: ''
    }
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.dailySaleHeader(this.locale)
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
        acc.cash_amount += parseInt(d.cash_amount)
        acc.kpay_amount += parseInt(d.kpay_amount)
        acc.kbz_amount += parseInt(d.kbz_amount)
        acc.cb_pay_amount += parseInt(d.cb_pay_amount)
        acc.cb_amount += parseInt(d.cb_amount)
        acc.aya_pay_amount += parseInt(d.aya_pay_amount)
        acc.aya_amount += parseInt(d.aya_amount)
        acc.wave_pay_amount += parseInt(d.wave_pay_amount)
        acc.total_discount += parseInt(d.total_discount)
        acc.grand_total += parseInt(d.grand_total)
        return acc
      }
      , {
        cash_amount: 0,
        kpay_amount: 0,
        kbz_amount: 0,
        cb_pay_amount: 0,
        cb_amount: 0,
        aya_pay_amount: 0,
        aya_amount: 0,
        wave_pay_amount: 0,
        total_discount: 0,
        grand_total: 0
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
          this.paginationDataTable(this, `${this.$url.DAILY_SALE_URL}`, this.saleOptions)
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
  mounted () {
    const breadCrumbs = [
      {
        text: 'Daily Sales Report',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Daily Sales Report')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    searchFilter () {
      if (this.isEmptyQuery) { return }
      this.paginationDataTable(this, `${this.$url.DAILY_SALE_URL}`, this.saleOptions)
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
        const response = await this.$request.exportData(this.$url.DAILY_SALE_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'daily_sales_report.xlsx')
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
