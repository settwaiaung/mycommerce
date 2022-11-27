<template>
  <div>
    <v-stepper v-model="step" elevation="0">
      <v-stepper-items>
        <v-stepper-content class="content_wrapper_stepper" step="1">
          <v-data-table
            :headers="headers"
            :items="products"
            :search="search"
            :loading="loadingData"
            :loading-text="trans('tableDataLoading')"
          >
            <template #top>
              <v-toolbar
                flat
              >
                <v-text-field
                  v-model="search"
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
            <template #[`item.is_available`]="{item}">
              <v-icon v-if="item.is_available" color="success">
                mdi-check-circle-outline
              </v-icon>
              <v-icon v-else>
                mdi-checkbox-blank-circle-outline
              </v-icon>
            </template>
            <template #[`item.exclusive_bottle`]="{item}">
              <v-icon v-if="item.exclusive_bottle" color="success">
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
                @click="onDetail(item)"
              >
                mdi-pencil
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
        <ProductForm v-model="selectedProduct" @onGoBack="handleGoBack" />
      </v-stepper-items>
    </v-stepper>
    <ConfirmDelete screen="product" />
    <SnackBar />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ProductForm from '@/components/forms/store/ProductForm.vue'
export default {
  components: {
    ProductForm
  },
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    step: 1,
    search: '',
    loadingData: false,
    products: [],
    selectedProduct: {}
  }),
  async fetch () {
    try {
      this.loadingData = true
      const { data, message, status } = await this.$request.fetchData(this.$url.PRODUCT_URL, this.jwt)
      if (status === 1) {
        this.products = data
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
      return this.$tableHeaders.productHeader(this.locale)
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'Store',
        disabled: true
      },
      {
        text: 'Products',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Products')
    this.$store.dispatch('setNavShow', true)

    this.$on('deletedData', (data) => {
      const foundIndex = this.products.findIndex(
        product => product.id === data.id
      )
      this.products.splice(foundIndex, 1)
      this.$store.dispatch('order/deleteProducts', data)
    })
  },
  methods: {
    handleGoBack (data = null, action = null) {
      this.step = this.step === 1 ? 2 : 1
      this.selectedProduct = {}
      if (data === null && action === null) { return }
      if (action === 'updated') {
        const foundIndex = this.products.findIndex(
          product => product.id === data.id
        )
        this.products.splice(foundIndex, 1, {
          ...data
        })
        this.$store.dispatch('order/updateProducts', data)
      } else {
        this.products.unshift({ ...data })
      }
    },
    onNew () {
      this.$emit('newForm')
      this.step = 2
    },
    onDetail (item) {
      this.selectedProduct = (({
        id, name, mm_name, item_code, category, price, description,
        is_available, image_path, exclusive_bottle, lwh, weight, without_bottle_price, unit_qty
      }) => ({
        id,
        name,
        mm_name,
        item_code,
        category_id: category.id,
        price: parseInt(price),
        description,
        is_available,
        image_path,
        exclusive_bottle,
        lwh,
        unit_qty: parseFloat(unit_qty),
        weight,
        without_bottle_price: parseInt(without_bottle_price)
      }))(JSON.parse(JSON.stringify(item)))
      this.step = 2
    },
    onDelete (item) {
      this.$emit('deleteForm', item, this.$url.PRODUCT_URL, this.jwt)
    }
  }
}
</script>
