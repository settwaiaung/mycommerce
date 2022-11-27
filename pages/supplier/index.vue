<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <div v-shortkey="['enter']" @shortkey="searchFilter" />
          <!-- <v-toolbar
            class="d-flex justify-end"
            flat
          >
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              dense
              outlined
              class="mx-1"
            />
            <v-spacer />
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="onNew"
            >
              {{ trans('new') }}
            </v-btn>
          </v-toolbar> -->
          <v-data-table
            :headers="headers"
            :items="suppliers"
            :search="filters.search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
            :options.sync="supplierOptions"
            :server-items-length="supplierOptions.totalItems"
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
                />
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
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
            </template>
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
        </v-stepper-content>
        <SupplierForm
          v-model="selectedSupplier"
          @onGoBack="handleGoBack"
        />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="Supplier" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SupplierForm from '@/components/forms/supplier/SupplierForm.vue'
export default {
  components: {
    SupplierForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    loadingData: false,
    suppliers: [],
    supplierOptions: {
      itemsPerPage: 10,
      totalItems: 0
    },
    filters: {
      search: ''
    },
    cities: [],
    origin_zones: [],
    zones: []
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    headers () {
      return this.$tableHeaders.supplierHeader(this.locale)
    }
  },
  watch: {
    'supplierOptions.page': {
      handler (newVal, oldVal) {
        if (newVal === oldVal) { return }
        setTimeout(() => {
          this.paginationDataTable(this, `${this.$url.SUPPLIER_URL}`, this.supplierOptions)
        }, 500)
      },
      deep: true
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
    this.origin_zones = await this.getFromLocalStorage('stored:zones')
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'supplier',
        disabled: true
      },
      {
        text: 'Suppliers',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Suppliers')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.suppliers.findIndex(
        supplier => supplier.id === data.id
      )
      this.suppliers.splice(foundIndex, 1)
      this.$store.dispatch('order/deleteSuppliers', data)
    })
  },
  methods: {
    searchFilter () {
      this.paginationDataTable(this, `${this.$url.SUPPLIER_URL}`, this.supplierOptions)
    },
    async getDataFromApi (url) {
      try {
        this.loadingData = true
        const { data, status, message, meta } = await this.$request.fetchData(url, this.jwt)
        if (status === 1) {
          setTimeout(() => {
            this.suppliers = data
            this.setPaginationData(this, meta, this.supplierOptions)
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
      this.selectedSupplier = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.suppliers.findIndex(
          supplier => supplier.id === data.id
        )
        this.suppliers.splice(foundIndex, 1, {
          ...data
        })
        this.$store.dispatch('order/updateSuppliers', data)
      } else {
        this.suppliers.unshift({ ...data })
      }
    },
    onNew () {
      this.step = 2
    },
    onDetail (item) {
      this.selectedSupplier = (({
        id, name, phone, city, zone, address, email, another_phone
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
        another_phone
      }))(JSON.parse(JSON.stringify(item)))
      // this.$emit('editForm', item)
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.SUPPLIER_URL, this.jwt)
    }
  }
}
</script>
