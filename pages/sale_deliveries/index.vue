<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content
          id="no_print"
          class="content_wrapper_stepper"
          step="1"
        >
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
              item-text="item"
              item-value="item"
              hide-details
              outlined
              dense
              class="px-1"
              label="Payment Status"
            />
            <v-autocomplete
              v-model="filters.status"
              :items="statuses"
              item-text="item"
              item-value="item"
              hide-details
              outlined
              dense
              class="px-1"
              label="Status"
            />
          </v-toolbar>
          <v-toolbar flat class="d-flex justify-start">
            <v-text-field
              v-model="filters.invoice_no"
              clearable
              label="Invoice No"
              hide-details
              outlined
              dense
              class="px-1"
            />
            <!-- <v-text-field
              v-model="filters.delivery_voucher_no"
              clearable
              label="Voucher No"
              hide-details
              outlined
              dense
              class="px-1"
            /> -->
            <DatePicker
              v-model="filters.from_date"
              class="px-1"
              label="Start Date"
            />

            <DatePicker
              v-model="filters.to_date"
              class="px-1"
              label="End Date"
              :min="filters.from_date"
            />
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
              class="mx-1"
              color="primary"
              :loading="loadingData"
              @click="searchFilter"
            >
              Search
            </v-btn>

            <v-btn
              color="primary"
              outlined
              class="tw-ml-4"
              :loading="loadingData"
              @click="exportData"
            >
              Export
            </v-btn>

            <!-- <v-btn
              v-show="selectedList.length"
              :disabled="!selectedList.length"
              color="primary"
              :loading="loadingData"
              class="mx-1"
              @click="makePayment"
            >
              Make Payment
            </v-btn> -->
            <DeliPayment
              v-model="paymentToggler"
              :selected-sales="selectedList"
              @onCreatedPayment="onCreatedPayment"
            />
            <v-btn
              v-show="selectedList.length"
              class="tw-ml-3 tw-border "
              elevation="2"
              color="secondary"
              outlined
              :disabled="!selectedList.length"
              @click="onDeliStatus"
            >
              Sync Deli Status
            </v-btn>
          </v-toolbar>
          <v-data-table
            v-model="selectedList"
            :headers="headers"
            :items="sale_deliveries"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="saleOptions"
            :server-items-length="saleOptions.totalItems"
            show-select
            @toggle-select-all="selectAllToggle"
          >
            <template #[`item.total_amount`]="{ item }">
              {{ curFm(item.total_amount) }}
            </template>
            <template #[`item.total_discount`]="{ item }">
              {{ curFm(item.total_discount) || 0 }}
            </template>
            <template #[`item.delivery_amount`]="{ item }">
              {{ curFm(item.delivery_amount) || 0 }}
            </template>
            <template #[`item.grand_total`]="{ item }">
              {{ curFm(item.grand_total) }}
            </template>
            <template
              #[`item.data-table-select`]="{ item, isSelected, select }"
            >
              <v-simple-checkbox
                :ripple="false"
                :value="isSelected"
                :readonly="item.disabled"
                :disabled="item.disabled"
                @input="select($event)"
              />
            </template>
            <template #[`item.actions`]="{ item }">
              <v-icon color="primary" class="mr-2" @click="handleDetail(item)">
                mdi-eye
              </v-icon>
              <v-icon
                color="secondary"
                medium
                class="mr-2"
                @click="handlePrint(item)"
              >
                mdi-printer-eye
              </v-icon>
              <v-icon color="error" medium class="mr-4" @click="onDelete(item)">
                mdi-delete
              </v-icon>
            </template>
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
    <PrintSale id="print_component" :model="printModel" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import SaleDetail from '@/components/widgets/sale/SaleDetail.vue'
import PrintSale from '@/components/widgets/sale/PrintSale.vue'
import SaleForm from '@/components/forms/top/SaleForm.vue'
import DeliPayment from '~/components/widgets/sale_delivery/DeliPayment.vue'
export default {
  components: {
    PrintSale,
    SaleForm,
    DeliPayment
  },
  layout: 'dashboard',
  middleware: ['isAuth', 'merchantMiddleware'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    sale_deliveries: [],
    saleOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    selectedList: [],
    disabledCount: 0,
    filters: {
      delivery_voucher_no: '',
      invoice_no: '',
      customer_name: '',
      customer_phone: '',
      status: '',
      payment_status: '',
      from_date: '',
      to_date: ''
    },
    printModel: {},
    selectedSale: {}
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale',
      merchantDeliStatuses: 'merchantAuth/merchantDeliStatuses',
      merchantJWT: 'merchantAuth/merchantJWT'
    }),
    headers () {
      return this.$tableHeaders.saleDeliveryHeader(this.locale)
    },
    statuses () {
      return ['completed', 'new']
    },
    sale_payments () {
      return ['paid', 'outstanding']
    },
    paymentToggler () {
      return this.selectedList.length > 0
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
    'saleOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) {
          return
        }
        setTimeout(() => {
          this.paginationDataTable(
            this,
            `${this.$url.SALE_DELIVERY_URL}`,
            this.saleOptions
          )
        }, 500)
      },
      deep: true
    },
    'saleOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) {
          return
        }
        const { sortBy } = this.saleOptions
        this.sale_deliveries = this.sortDataTable(
          sortBy,
          newVal,
          this.sale_deliveries
        )
      },
      deep: true
    }
  },
  created () {
    this.$store.dispatch(
      'merchantAuth/fetchMerchantDeliStatuses',
      this.merchantJWT,
      { that: this }
    )
  },

  mounted () {
    const breadCrumbs = [
      {
        text: 'Sale Deliveries',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Sale Deliveries')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.sale_deliveries.findIndex(
        customer => customer.id === data.id
      )
      this.sale_deliveries.splice(foundIndex, 1)
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(
        this,
        `${this.$url.SALE_DELIVERY_URL}`,
        this.saleOptions
      )
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(
          url,
          this.jwt
        )
        if (status === 1) {
          setTimeout(() => {
            this.sale_deliveries = data
            this.sale_deliveries = data.map((item) => {
              if (item.payment_status === 'paid' || item.status === 'void') {
                this.disabledCount += 1
                item.disabled = true
              } else {
                item.disaled = false
              }
              return item
            })
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
      if (data === null && action === null) {
        return
      }
      if (action === 'updated') {
        const foundIndex = this.sale_deliveries.findIndex(
          customer => customer.id === data.id
        )
        this.sale_deliveries.splice(foundIndex, 1, {
          ...data
        })
      } else {
        this.sale_deliveries.unshift({ ...data })
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 2
    },
    async getItem (item) {
      try {
        this.loadingData = true
        const { data, message, status } = await this.$request.fetchData(
          `${this.$url.SALE_URL}/${item.id}`,
          this.jwt
        )
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
      const printItem = (await this.getItem(item)) || {}
      if (Object.keys(printItem).length <= 0) {
        return false
      }
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
        paid_amount
      }) => ({
        customer: {
          name: customer_name,
          address: customer_address,
          city: { name: customer_city_name },
          zone: { name: customer_zone_name },
          phone: customer_phone
        },
        sale_items,
        invoice_no,
        grand_total,
        total_discount,
        delivery_amount,
        total_amount,
        outstanding_amount,
        paid_amount
      }))(JSON.parse(JSON.stringify(printItem)))
      this.printDetail()
    },
    async handleDetail (item, type = '') {
      const itemDetail = (await this.getItem(item)) || {}
      if (Object.keys(itemDetail).length <= 0) {
        return false
      }
      this.selectedSale = (({
        id,
        invoice_no,
        sale_items,
        grand_total,
        total_amount,
        total_discount,
        outstanding_amount,
        paid_amount,
        total_qty,
        note,
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
        customer: {
          name: customer_name,
          city: { name: customer_city_name },
          zone: { name: customer_zone_name },
          phone: customer_phone,
          delivery_address,
          address: customer_address
        },
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
    },
    onDelete (item) {
      item.name = item.invoice_no
      this.$emit('deleteForm', item, this.$url.SALE_DELIVERY_URL, this.jwt)
    },
    onCreatedPayment () {
      this.selectedList = []
      setTimeout(() => {
        this.paginationDataTable(
          this,
          `${this.$url.SALE_DELIVERY_URL}`,
          this.saleOptions
        )
      }, 500)
    },
    selectAllToggle (props) {
      if (
        this.selectedList.length !==
        this.sale_deliveries.length - this.disabledCount
      ) {
        this.selectedList = []
        const self = this
        props.items.forEach((item) => {
          if (!item.disabled) {
            self.selectedList.push(item)
          }
        })
      } else {
        this.selectedList = []
      }
    },
    async onDeliStatus () {
      try {
        this.loadingData = true
        const vouchers = this.selectedList.map(x => x.delivery_voucher_no)
        const { message, status } = await this.$request.postData(
          `${this.$url.SYNC_DELI_STATUS_URL}`,
          { vouchers },
          this.jwt
        )
        if (status === 1) {
          this.loadingData = false
          this.handleStatus({ status, message, that: this, successMessage: message })
        } else {
          this.loadingData = false
          this.handleStatus({ status, message, that: this, successMessage: message })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(
          this.$url.SALE_DELIVERY_URL + this.query + '&export=true',
          this.jwt
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'sale_deliveries.xlsx')
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
