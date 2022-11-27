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
            :footer-props="{
              'items-per-page-options': [-1]
            }"
            :items-per-page="-1"
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
                <v-spacer />
                <v-col md="3" class="d-flex  tw-justify-end flex-row">
                  <v-btn
                    outlined
                    color="primary"
                    class="py-5 mx-1"

                    @click="searchFilter"
                  >
                    Search
                  </v-btn>

                  <v-btn outlined color="primary" class="py-5" @click="exportData">
                    Export
                  </v-btn>
                </v-col>
              </v-row>
            </template>

            <template #[`item.amount_collect_per_voucher`]="{item}">
              {{ item.amount_collect_per_voucher || 0 }}
            </template>

            <template slot="body.append">
              <tr>
                <td class="tw-font-bold tw-bg-indigo-500  " colspan="10">
                  Total
                </td>
                <td class="text-xs-right font-weight-bold">
                  {{ total }}
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
    loadingData: false,
    sales: [],
    // saleItemOptions: {
    //   itemsPerPage: 10,
    //   totalItems: 0
    // },
    filters: {
      from_date: '',
      to_date: ''
    },
    total: 0
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.SALE_SHEET_REPORT_URL, this.jwt)
      if (status === 1) {
        this.sales = data
        if (this.sales.length) {
          this.total = this.sales.map(x => x.unit_qty).reduce((sum, d) => parseFloat(sum) + parseFloat(d)).toFixed(2)
        }
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
      return this.$tableHeaders.saleSheetReportHeader(this.locale)
    },
    query () {
      let query = '?'
      for (const property in this.filters) {
        if (this.filters[property]) { query += `&${property}=${this.filters[property]}` }
      }
      return query
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Sale Sheet Report',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Sale Sheet Report')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    async searchFilter () {
      try {
        this.loadingData = true
        const { data, message, status } = await this.$request.fetchData(this.$url.SALE_SHEET_REPORT_URL + this.query, this.jwt)
        if (status === 1) {
          this.sales = data
          if (this.sales.length) {
            this.total = this.sales.map(x => x.unit_qty).reduce((sum, d) => parseFloat(sum) + parseFloat(d)).toFixed(2)
          }
          this.loadingData = false
        } else {
          this.loadingData = false
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },

    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(this.$url.SALE_SHEET_REPORT_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'sale_sheets_report.xlsx')
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
