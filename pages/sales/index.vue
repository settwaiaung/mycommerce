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
            <v-text-field
              v-model="filters.customer_name"
              clearable
              label="Customer Name"
              hide-details
              outlined
              dense
              class="px-1"
            />
            <v-text-field
              v-model="filters.customer_phone"
              clearable
              label="Customer Phone"
              hide-details
              type="number"
              outlined
              dense
              class="px-1"
            />
            <v-text-field
              v-model="filters.customer_city_name"
              clearable
              label="Customer City"
              hide-details
              outlined
              dense
              class="px-1"
            />
            <v-text-field
              v-model="filters.customer_zone_name"
              clearable
              label="Customer Zone"
              hide-details
              outlined
              dense
              class="px-1"
            />
            <v-autocomplete
              v-model="filters.payment_status"
              :items="sale_payments"
              item-text="name"
              item-value="value"
              hide-details
              outlined
              dense
              class="px-1"
              label="Payment Status"
            />
            <v-autocomplete
              v-model="filters.status"
              :items="statuses"
              item-text="name"
              item-value="value"
              hide-details
              outlined
              dense
              class="px-1"
              label="Status"
            />
          </v-toolbar>
          <v-toolbar
            flat
            class="d-flex justify-start"
          >
            <!-- <v-text-field
              v-model="filters.order_no"
              clearable
              label="Order No"
              hide-details
              outlined
              dense
              class="px-1"
            /> -->
            <v-text-field
              v-model="filters.invoice_no"
              clearable
              label="Invoice No"
              hide-details
              outlined
              dense
              class="px-1"
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
            <DatePicker v-model="filters.from_date" class="px-1" label="Start Date" />

            <DatePicker v-model="filters.to_date" class="px-1" label="End Date" :min="filters.from_date" />
            <v-spacer />
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
          <v-data-table
            :headers="headers"
            :items="sales"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="saleOptions"
            :server-items-length="saleOptions.totalItems"
          >
            <template #item="i">
              <tr
                :class="{
                  'red lighten-2': i.item.status==='void'|| i.item.status==='return'
                }"
              >
                <td>{{ i.item.invoice_no }}</td>
                <td>{{ i.item.customer_name }}</td>
                <td>{{ i.item.customer_city_name }}</td>
                <td>{{ i.item.customer_zone_name }}</td>
                <td>{{ i.item.customer_phone }}</td>
                <td>{{ i.item.payment_status }}</td>
                <td>{{ i.item.status }}</td>
                <td>{{ i.item.total_qty }}</td>
                <td>{{ curFm(i.item.total_amount) }}</td>
                <td>{{ curFm(i.item.total_discount) ||0 }}</td>
                <td>{{ curFm(i.item.grand_total) }}</td>
                <td>{{ curFm(i.item.outstanding_amount)||0 }}</td>
                <td>{{ i.item.source }}</td>
                <td>
                  <v-icon
                    color="primary"
                    class="mr-2"
                    @click="handleDetail(i.item)"
                  >
                    mdi-eye
                  </v-icon>
                  <v-icon
                    color="secondary"
                    medium
                    class="mr-2"
                    @click="handlePrint(i.item,)"
                  >
                    mdi-printer-eye
                  </v-icon>
                  <v-icon
                    color="error"
                    medium
                    class="mr-4"
                    @click="onDelete(i.item)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
            <!-- <template #top>
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
                    @click="searchFilter"
                  >
                    Search
                  </v-btn>
                </v-col>
              </v-row>
            </template> -->
            <!-- <template #[`item.total_amount`]="{item}">
              {{ curFm(item.total_amount) }}
            </template>
            <template #[`item.total_discount`]="{item}">
              {{ curFm(item.total_discount) ||0 }}
            </template>
            <template #[`item.grand_total`]="{item}">
              {{ curFm(item.grand_total) }}
            </template>
            <template #[`item.outstanding_amount`]="{item}">
              {{ curFm(item.outstanding_amount)||0 }}
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
              <v-icon
                color="error"
                medium
                class="mr-4"
                @click="onDelete(item)"
              >
                mdi-delete
              </v-icon>
            </template> -->
          </v-data-table>
        </v-stepper-content>
        <!-- <SaleDetail @onGoBack="handleGoBack" /> -->
        <SaleForm
          v-model="selectedSale"
          @onGoBack="handleGoBack"
          @onPrint="handlePrint"
        />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="Sale" />
    <PrintSale
      id="print_component"
      :model="printModel"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import SaleDetail from '@/components/widgets/sale/SaleDetail.vue'
import PrintSale from '@/components/widgets/sale/PrintSale.vue'
import SaleForm from '@/components/forms/top/SaleForm.vue'
export default {
  components: {
    PrintSale,
    SaleForm
  },
  layout: 'dashboard',
  middleware: ['isAuth', 'merchantMiddleware'],
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
      order_no: '',
      invoice_no: '',
      source_id: '',
      customer_name: '',
      customer_phone: '',
      customer_city_name: '',
      customer_zone_name: '',
      status: '',
      payment_status: '',
      from_date: '',
      to_date: ''
    },
    printModel: {},
    selectedSale: {},
    sources: [],
    statuses: [
      { name: 'Completed', value: 'completed' },
      { name: 'New', value: 'new' },
      { name: 'Void', value: 'void' },
      { name: 'Return', value: 'return' }
    ],
    sale_payments: [
      { name: 'New', value: 'new' },
      { name: 'Paid', value: 'paid' },
      { name: 'Outstanding', value: 'outstanding' }
    ]
  }),
  // async fetch () {
  //   try {
  //     this.loadingData = true
  //     const { data, message, status } = await this.$request.fetchData(this.$url.SALE_URL, this.jwt)
  //     if (status === 1) {
  //       this.sales = data
  //       this.loadingData = false
  //     } else {
  //       this.loadingData = false
  //       this.handleStatus({ status, message, that: this })
  //     }
  //   } catch (error) {
  //     this.handleException({ error, that: this })
  //   }
  // },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.saleHeader(this.locale)
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
    'saleOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.SALE_URL}`, this.saleOptions)
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
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Sales',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Sales')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.sales.findIndex(
        customer => customer.id === data.id
      )
      this.sales.splice(foundIndex, 1)
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.SALE_URL}`, this.saleOptions)
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
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.sales.findIndex(
          customer => customer.id === data.id
        )
        this.sales.splice(foundIndex, 1, {
          ...data
        })
      } else {
        this.sales.unshift({ ...data })
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 2
    },
    async getItem (item) {
      try {
        this.loadingData = true
        const { data, message, status } = await this.$request.fetchData(`${this.$url.SALE_URL}/${item.id}`, this.jwt)
        if (status === 1) {
          this.loadingData = false
          return data
        } else {
          this.loadingData = false
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },
    async handlePrint (item) {
      const printItem = await this.getItem(item) || {}
      if (Object.keys(printItem).length <= 0) { return false }
      this.printModel = (({
        customer_name,
        customer_phone,
        customer_address,
        customer_city_name,
        customer_zone_name,
        sale_items,
        invoice_no,
        grand_total,
        total_discount,
        delivery_amount,
        total_amount,
        outstanding_amount,
        paid_amount,
        created_user,
        created_at,
        note
      }) => ({
        customer: { name: customer_name, address: customer_address, city: { name: customer_city_name }, zone: { name: customer_zone_name }, phone: customer_phone },
        sale_items,
        invoice_no,
        grand_total,
        total_discount,
        delivery_amount,
        total_amount,
        outstanding_amount,
        paid_amount,
        created_user,
        created_at,
        note
      }))(JSON.parse(JSON.stringify(printItem)))
      this.printDetail()
    },
    async handleDetail (item, type = '') {
      const itemDetail = await this.getItem(item) || {}

      if (Object.keys(itemDetail).length <= 0) { return false }
      this.selectedSale = (({
        id, invoice_no,
        sale_items,
        grand_total,
        total_amount,
        total_discount,
        outstanding_amount,
        paid_amount,
        total_qty, note,
        customer_id,
        customer_name,
        customer_city_name,
        customer_zone_name,
        customer_phone,
        delivery_address,
        customer_address,
        sale_payments,
        delivery_amount,
        status,
        delivery_voucher_no
      }) => ({
        id,
        invoice_no,
        customer: { customer_id, name: customer_name, city: { name: customer_city_name }, zone: { name: customer_zone_name }, phone: customer_phone, delivery_address, address: customer_address },
        sale_items,
        grand_total,
        total_amount,
        total_discount,
        outstanding_amount,
        paid_amount,
        total_qty,
        note,
        delivery_address,
        sale_payments,
        delivery_amount: parseInt(delivery_amount),
        status,
        delivery_voucher_no
      }))(JSON.parse(JSON.stringify(itemDetail)))
      this.step = 2
      // const eventType = type ? 'printInvoice' : 'editForm'
      // await this.$emit(eventType, item)
      // this.step = type ? 3 : 2
    },
    onDelete (item) {
      item.name = item.invoice_no
      this.$emit('deleteForm', item, this.$url.SALE_URL, this.jwt)
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(
          this.$url.SALE_URL + this.query + '&export=true',
          this.jwt
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'sales.xlsx')
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
