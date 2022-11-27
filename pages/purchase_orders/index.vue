<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content id="no_print" class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <v-data-table
            :headers="headers"
            :search="filters.search"
            :items="purchase_orders"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="purchaseOrderOptions"
            :server-items-length="purchaseOrderOptions.totalItems"
          >
            <template #top>
              <v-toolbar
                flat
              >
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
                <v-text-field
                  v-model="filters.invoice_no"
                  append-icon="mdi-magnify"
                  label="Invoice No"
                  single-line
                  hide-details
                  dense
                  outlined
                  class="mx-1"
                />
                <DatePicker v-model="filters.from_date" class="px-1" label="Start Date" />

                <DatePicker v-model="filters.to_date" class="px-1" label="End Date" :min="filters.from_date" />
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-btn
                  color="primary"
                  :loading="loadingData"
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
            <template #[`item.grand_total`]="{item}">
              {{ item.total_amount - item.total_discount }}
            </template>
            <template #[`item.confirm`]="{item}">
              <v-badge
                v-if="item.confirm"
                color="green"
                content="Confirm"
              />
              <v-badge
                v-else
                color="warning"
                content="Confirm"
              />
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
            </template>
          </v-data-table>
        </v-stepper-content>
        <PurchaseOrderForm
          v-model="selectedPurchaseOrder"
          @onGoBack="handleGoBack"
          @onDeleteItem="handleDelete"
          @onPrint="handlePrint"
        />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete :screen="screenName" />
    <PrintPurchaseOrder
      :model="printModel"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PurchaseOrderForm from '@/components/forms/top/PurchaseOrderForm.vue'
import PrintPurchaseOrder from '@/components/widgets/purchase_order/PrintPurchaseOrder.vue'

export default {
  components: {
    PurchaseOrderForm,
    PrintPurchaseOrder
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    screenName: 'Purchase Order',
    step: 1,
    loadingData: false,
    search: '',
    purchase_orders: [],
    purchaseOrderOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      search: '',
      invoice_no: '',
      from_date: '',
      to_date: ''
    },
    selectedPurchaseOrder: {},
    printModel: {}
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.purchaseOrderHeader(this.locale)
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
    'purchaseOrderOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.PURCHASEORDER_URL}`, this.purchaseOrderOptions)
        }, 500)
      },
      deep: true
    },
    'purchaseOrderOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.purchaseOrderOptions
        this.purchase_orders = this.sortDataTable(sortBy, newVal, this.purchase_orders)
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Purchase Orders',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Purchase Orders')
    this.$store.dispatch('setNavShow', true)
    this.$on('deletedData', (data) => {
      const foundIndex = this.purchase_orders.findIndex(
        purchase_order => purchase_order.id === data.id
      )
      this.purchase_orders.splice(foundIndex, 1)
    })
    this.$root.$on('createdPurchaseOrder', (data) => {
      this.purchase_orders.unshift({ ...data })
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.PURCHASEORDER_URL}`, this.purchaseOrderOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.purchase_orders = data
            this.setPaginationData(this, meta, this.purchaseOrderOptions)
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
        const foundIndex = this.purchase_orders.findIndex(
          purchase_order => purchase_order.id === data.id
        )
        this.purchase_orders.splice(foundIndex, 1, {
          ...data
        })
      } else {
        this.purchase_orders.unshift({ ...data })
      }
    },
    async onNew () {
      await this.$router.push('/purchase_orders/new')
    },
    async getItem (item) {
      try {
        this.loadingData = true
        const { data, message, status } = await this.$request.fetchData(`${this.$url.PURCHASEORDER_URL}/${item.id}`, this.jwt)
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
        invoice_no,
        resourceable,
        purchase_order_items,
        grand_total,
        total_overall_discount,
        total_amount,
        bottle_return,
        created_user,
        purchase_date,
        note
      }) => ({
        invoice_no,
        customer: {
          ...resourceable
        },
        purchase_order_items,
        grand_total,
        total_overall_discount,
        total_amount,
        bottle_return,
        created_user,
        purchase_date,
        note
      }))(JSON.parse(JSON.stringify(printItem)))
      this.printDetail()
    },
    async handleDetail (item) {
      const itemDetail = await this.getItem(item) || {}
      if (Object.keys(itemDetail).length <= 0) { return false }
      this.selectedPurchaseOrder = (({
        id, invoice_no, resourceable, purchase_order_items, grand_total_amount,
        purchase_order_payments,
        total_amount,
        total_discount,
        total_price,
        total_procduct_discount,
        total_qty,
        note,
        delivery_address,
        status,
        confirm,
        outstanding_amount,
        paid_amount
      }) => ({
        id,
        invoice_no,
        customer: { ...resourceable },
        purchase_order_items,
        purchase_order_payments,
        grand_total_amount,
        total_amount,
        total_discount,
        total_price,
        total_procduct_discount,
        total_qty,
        note,
        delivery_address,
        status,
        confirm,
        outstanding_amount,
        paid_amount
      }))(JSON.parse(JSON.stringify(itemDetail)))
      this.step = 2
    },
    handleDelete (item) {
      this.screenName = 'Purchase Order Item'
      item.name = item.product_name
      this.$emit('deleteForm', item, this.$url.PURCHASEORDER_ITEM_URL, this.jwt)
    },
    onDelete (item) {
      item.name = item.invoice_no
      this.$emit('deleteForm', item, this.$url.PURCHASEORDER_URL, this.jwt)
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(
          this.$url.PURCHASEORDER_URL + this.query + '&export=true',
          this.jwt
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'purchase_orders.xlsx')
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
