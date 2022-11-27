<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content id="no_print" class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <v-data-table
            :headers="headers"
            :items="bottles"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="bottleItemOptions"
            :server-items-length="bottleItemOptions.totalItems"
          >
            <template #top>
              <v-row
                flat
                class="pa-2"
              >
                <v-col md="3">
                  <DatePicker v-model="filters.date" label="Date" />
                </v-col>
                <v-spacer />
                <v-col md="3" class="d-flex flex-row">
                  <v-btn
                    outlined
                    color="primary"
                    class="py-5 mx-1"

                    @click="searchFilter"
                  >
                    Search
                  </v-btn>
                  <v-btn
                    outlined
                    color="primary"
                    class="py-5 mx-1"
                    :disabled="!bottles.length || btndisable"
                    @click="handlePrint"
                  >
                    Print
                  </v-btn>
                  <v-btn
                    outlined
                    :disabled="!bottles.length || btndisable"
                    color="primary"
                    class="py-5"
                    @click="exportData"
                  >
                    Export
                  </v-btn>
                </v-col>
              </v-row>
            </template>

            <template
              #[`item.No`]="{index}"
            >
              <span>{{ index+1 }}</span>
            </template>
          </v-data-table>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <Print_bottle_report
      :model="printModel"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Print_bottle_report from '../../../components/widgets/bottle_item_report/Print_bottle_report.vue'

export default {
  components: {
    Print_bottle_report
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    loadingData: false,
    bottles: [],
    btndisable: false,
    bottleItemOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      date: ''
    },
    printModel: {}
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      user: 'auth/user',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.bottleItemReportHeader(this.locale)
    },
    query () {
      let query = '?paginate=25'
      for (const property in this.filters) {
        if (this.filters[property]) {
          query += `&${property}=${this.filters[property]}`
        }
      }
      return query
    }
  },
  watch: {
    'filters.date': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        this.btndisable = true
      },
      deep: true
    },

    'bottleItemOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal || this.isEmptyQuery) {
          return
        }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.BOTTLE_ITEM_REPORT_URL}`, this.bottleItemOptions)
        }, 500)
      },
      deep: true
    },
    'bottleItemOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) {
          return
        }
        const { sortBy } = this.bottleItemOptions
        this.bottles = this.sortDataTable(sortBy, newVal, this.bottles)
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Bottle Item Report',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Bottle Item Report')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    searchFilter () {
      this.btndisable = false
      this.paginationDataTable(this, `${this.$url.BOTTLE_ITEM_REPORT_URL}`, this.bottleItemOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.bottles = data
            this.setPaginationData(this, meta, this.bottleItemOptions)
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
    handlePrint () {
      const array_10_v = this.bottles.map(x => x.qty_10v).filter(y => y !== '-')
      const array_5_v = this.bottles.map(x => x.qty_5v).filter(y => y !== '-')
      const total_10_v = array_10_v.length > 0
        ? array_10_v.reduce((z, i) => parseFloat(z) + parseFloat(i))
        : 0
      const total_5_v = array_5_v.length > 0
        ? array_5_v.reduce((z, i) => parseFloat(z) + parseFloat(i))
        : 0
      const today = new Date()
      const yyyy = today.getFullYear()
      let mm = today.getMonth() + 1
      let dd = today.getDate()

      if (dd < 10) { dd = '0' + dd }
      if (mm < 10) { mm = '0' + mm }

      this.printModel = {
        name: this.user.name,
        bottles: [...this.bottles],
        total_10_v,
        total_5_v,
        date: this.filters.date ? this.filters.date : dd + '-' + mm + '-' + yyyy
      }
      this.printDetail()
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(this.$url.BOTTLE_ITEM_REPORT_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'bottle_items_report.xlsx')
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
