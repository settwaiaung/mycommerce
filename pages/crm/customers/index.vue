<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
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
            flat
            color="grey lighten-4"
            class="d-flex justify-space-between"
          >
            <v-autocomplete
              v-model="filters.city_id"
              clearable
              label="City"
              hide-details
              outlined
              dense
              class="px-1"
              :items="cities"
              item-text="name"
              item-value="id"
            />
            <v-autocomplete
              v-model="filters.zone_id"
              clearable
              label="Zone"
              hide-details
              outlined
              dense
              class="px-1"
              :items="zones"
              item-text="name"
              item-value="id"
            />
            <v-autocomplete
              v-model="filters.customer_type_id"
              clearable
              label="Type"
              hide-details
              outlined
              dense
              class="px-1"
              :items="customer_types"
              item-text="name"
              item-value="id"
            />
            <!-- <v-spacer /> -->
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
            :items="customers"
            :search="search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="customerOptions"
            :server-items-length="customerOptions.totalItems"
          >
            <template #[`item.actions`]="{item}">
              <v-icon
                color="primary"
                class="mr-2"
                @click="onDetail(item)"
              >
                mdi-eye
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
            v-model="customerOptions.page"
            :length="customerOptions.totalItems/customerOptions.itemsPerPage"
          /> -->
        </v-stepper-content>
        <CustomerForm
          v-model="selectedCustomer"
          @onGoBack="handleGoBack"
        />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="Customer" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerForm from '@/components/forms/crm/CustomerForm.vue'
export default {
  components: {
    CustomerForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    customers: [],
    customerOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      city_id: '',
      zone_id: '',
      customer_type_id: '',
      search: ''
    },
    selectedCustomer: {
      requiredPassword: false,
      password: ''
    },
    cities: [],
    origin_zones: [],
    zones: [],
    customer_types: []
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.customerHeader(this.locale)
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
    'filters.city_id': {
      handler (newVal, oldVal) {
        if (!newVal || (newVal === oldVal)) { return }
        this.zones = this.origin_zones.filter(zone => zone.city.id === newVal)
        this.filters.zone_id = this.zones[0].id
      },
      deep: true
    },
    'customerOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.CUSTOMER_URL}`, this.customerOptions)
        }, 500)
      },
      deep: true
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
    this.origin_zones = await this.getFromLocalStorage('stored:zones')
    this.customer_types = await this.getFromLocalStorage('stored:customer_types')
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'CRM',
        disabled: true
      },
      {
        text: 'Customers',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Customers')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.customers.findIndex(
        customer => customer.id === data.id
      )
      this.customers.splice(foundIndex, 1)
      this.$store.dispatch('order/deleteCustomers', data)
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.CUSTOMER_URL}`, this.customerOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.customers = data
            this.setPaginationData(this, meta, this.customerOptions)
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
      this.selectedCustomer = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.customers.findIndex(
          customer => customer.id === data.id
        )
        this.customers.splice(foundIndex, 1, {
          ...data
        })
        this.$store.dispatch('order/updateCustomers', data)
      } else {
        this.customers.unshift({ ...data })
      }
    },
    onNew () {
      // this.$emit('newForm')
      // this.selectedCustomer.requiredPassword = true
      this.step = 2
    },
    onDetail (item) {
      this.selectedCustomer = (({
        id, name, phone, city, zone, address, email, another_phone, membership_no, is_active,
        order_count,
        sale_count,
        customer_type_id
      }) => ({
        id,
        name,
        phone,
        city,
        zone,
        city_id: city.id,
        zone_id: zone.id,
        address,
        email,
        another_phone,
        membership_no,
        is_active,
        order_count,
        sale_count,
        requiredPassword: false,
        customer_type_id
      }))(JSON.parse(JSON.stringify(item)))
      // this.$emit('editForm', item)
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.CUSTOMER_URL, this.jwt)
    },
    async exportData () {
      try {
        this.loadingData = true
        const response = await this.$request.exportData(this.$url.CUSTOMER_URL + this.query + '&export=true', this.jwt)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'customers.xlsx')
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
