<template>
  <div>
    <v-stepper id="printable_stepper" v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content id="no_print" class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <v-toolbar
            class="d-flex justify-end"
            flat
          >
            <v-spacer />
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="onNew"
            >
              {{ trans('new') }}
            </v-btn>
          </v-toolbar>
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
            color="grey lighten-4"
          >
            <v-text-field
              v-model="filters.order_no"
              clearable
              label="Order No"
              hide-details
              outlined
              dense
              class="px-1"
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
            :items="orders"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="orderOptions"
            :server-items-length="orderOptions.totalItems"
          >
            <template #[`item.grand_total_amount`]="{item}">
              {{ curFm(item.grand_total_amount) }}
            </template>
            <template #[`item.status`]="{item}">
              <v-icon v-if="item.status" color="success">
                mdi-check-circle-outline
              </v-icon>
              <v-icon v-else>
                mdi-checkbox-blank-circle-outline
              </v-icon>
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
          <!-- <v-pagination
            v-model="orderOptions.page"
            :length="orderOptions.pageCount"
          /> -->
        </v-stepper-content>
        <OrderForm
          v-model="selectedOrder"
          :sources="sources"
          @onGoBack="handleGoBack"
          @onDeleteItem="handleDelete"
          @onPrint="handlePrint"
          @onMadeSale="handleMadeSale"
        />
        <!-- <v-stepper-content id="print_stepper" step="3">
          <PrintOrder
            v-if="step===3"
            :model="printModel"
            @onGoBack="handleGoBack"
          />
        </v-stepper-content> -->
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete :screen="screenName" />
    <PrintOrder
      :model="printModel"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import OrderForm from '@/components/forms/top/OrderForm.vue'
import PrintOrder from '@/components/widgets/order/PrintOrder.vue'

export default {
  components: {
    OrderForm,
    PrintOrder
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    screenName: 'Order',
    step: 1,
    search: '',
    loadingData: false,
    orders: [],
    orderOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      order_no: '',
      customer_name: '',
      customer_phone: '',
      customer_city_name: '',
      customer_zone_name: '',
      status: '',
      source_id: '',
      from_date: '',
      to_date: ''
    },
    selectedOrder: {},
    printModel: {},
    sources: []
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.orderHeader(this.locale)
    },
    statuses () {
      return [{ name: 'Sale', value: true }, { name: 'Order', value: false }]
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
    'orderOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.ORDER_URL}`, this.orderOptions)
        }, 500)
      },
      deep: true
    },
    'orderOptions.sortDesc': {
      handler (newVal, oldVal) {
        if (!newVal.length) { return }
        const { sortBy } = this.orderOptions
        this.orders = this.sortDataTable(sortBy, newVal, this.orders)
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
        text: 'Orders',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Orders')
    this.$store.dispatch('setNavShow', true)
    this.$on('deletedData', (data) => {
      const foundIndex = this.orders.findIndex(
        order => order.id === data.id
      )
      this.orders.splice(foundIndex, 1)
    })
    this.$root.$on('createdOrder', (data) => {
      this.orders.unshift({ ...data })
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.ORDER_URL}`, this.orderOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.orders = data
            this.setPaginationData(this, meta, this.orderOptions)
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
        const foundIndex = this.orders.findIndex(
          order => order.id === data.id
        )
        this.orders.splice(foundIndex, 1, {
          ...data
        })
      } else {
        this.orders.unshift({ ...data })
      }
    },
    async onNew () {
      // await this.$store.dispatch('order/setShowOrderForm', true)
      // const routeData = this.$router.resolve({
      //   path: '/orders/new'
      // })
      // window.open(routeData.href, '_blank')
      await this.$router.push('/orders/new')
    },
    async getItem (item) {
      try {
        this.loadingData = true
        const { data, message, status } = await this.$request.fetchData(`${this.$url.ORDER_URL}/${item.id}`, this.jwt)
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
        order_no,
        customer,
        customer_phone,
        customer_city_name,
        customer_zone_name,
        order_items,
        grand_total_amount,
        total_overall_discount,
        total_amount,
        bottle_return,
        created_user,
        created_at,
        note
      }) => ({
        order_no,
        customer: {
          ...customer,
          ...{
            city: { name: customer_city_name },
            zone: { name: customer_zone_name },
            phone: customer_phone
          }
        },
        order_items,
        grand_total_amount,
        total_overall_discount,
        total_amount,
        bottle_return,
        created_user,
        created_at,
        note
      }))(JSON.parse(JSON.stringify(printItem)))
      // this.step = 3
      this.printDetail()
    },
    async handleDetail (item) {
      const itemDetail = await this.getItem(item) || {}
      if (Object.keys(itemDetail).length <= 0) { return false }
      this.selectedOrder = (({
        id, order_no, customer, order_items, grand_total_amount,
        total_amount,
        total_overall_discount,
        total_price,
        total_procduct_discount,
        total_qty, note,
        customer_city_name,
        customer_zone_name,
        customer_phone,
        delivery_address,
        status,
        source_id
      }) => ({
        id,
        order_no,
        customer: { ...customer, ...{ city: { name: customer_city_name }, zone: { name: customer_zone_name }, phone: customer_phone, delivery_address } },
        order_items,
        grand_total_amount,
        total_amount,
        total_overall_discount,
        total_price,
        total_procduct_discount,
        total_qty,
        note,
        delivery_address,
        status,
        source_id
      }))(JSON.parse(JSON.stringify(itemDetail)))
      // const eventType = type ? 'printInvoice' : 'editForm'
      // await this.$emit(eventType, item)
      this.step = 2
      // this.$emit('editForm', item)
      // this.step = type ? 3 : 2
      // if (!type) {
      //   this.$emit('editForm', item)
      // }
    },
    handleDelete (item) {
      this.screenName = 'Order Item'
      item.name = item.product_name
      this.$emit('deleteForm', item, this.$url.ORDER_ITEM_URL, this.jwt)
    },
    handleMadeSale (data) {
      const foundIndex = this.orders.findIndex(
        order => order.id === data.id
      )
      this.orders[foundIndex].status = data.status
    },
    onDelete (item) {
      item.name = item.order_no
      this.$emit('deleteForm', item, this.$url.ORDER_URL, this.jwt)
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(
          this.$url.ORDER_URL + this.query + '&export=true',
          this.jwt
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'orders.xlsx')
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
