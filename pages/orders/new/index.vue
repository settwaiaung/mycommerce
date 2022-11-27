<template>
  <v-container fluid>
    <div v-shortkey="['ctrl', 'b']" @shortkey="closeOrderForm" />
    <validation-observer ref="observer">
      <v-form ref="form" @submit.prevent="saveOrder" @keyup.enter="saveOrder">
        <v-card>
          <v-card-title>
            <!-- <v-autocomplete
              v-model="selectedRow"
              dense
              label="Select Customers *"
              :items="JSON.parse(JSON.stringify(customer_data))"
              item-text="name"
              return-object
            /> -->
            <v-autocomplete
              v-model="selectedRow"
              dense
              label="Customer *"
              :items="customer_data"
              :item-text="
                (item) =>
                  item ? item.name + '-' + '(' + item.phone + ')' : item.name
              "
              return-object
              outlined
              hide-details
            />
            <v-spacer />
            <v-btn outlined color="primary" @click="closeOrderForm">
              <v-icon dark>
                mdi-arrow-left-bold-box
              </v-icon>
              Cancel
            </v-btn>
            <v-btn
              v-show="'products' in selectedRow"
              :disabled="disabledButton"
              color="primary"
              type="submit"
              :loading="isLoading"
              class="mx-1"
            >
              Save
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-layout wrap>
              <!-- <v-flex md3 sm12 xs12>
                <v-autocomplete
                  v-model="selectedRow"
                  dense
                  label="Customer *"
                  :items="JSON.parse(JSON.stringify(customer_data))"
                  item-text="name"
                  return-object
                  outlined
                />
              </v-flex> -->
              <v-divider vertical />
              <v-flex
                v-show="Object.keys(selectedRow).length > 0"
                md12
                sm12
                xs12
              >
                <div class="d-flex justify-space-between">
                  <v-autocomplete
                    v-model="selectedRow.source"
                    :items="sources"
                    return-object
                    item-text="name"
                    outlined
                    dense
                    label="Source"
                    class="flex-grow-0"
                  />
                  <h5 class="primary--text font-weight-bold">
                    {{ selectedRow.name ? selectedRow.name : "" }},{{
                      selectedRow.phone ? selectedRow.phone : ""
                    }}, {{ selectedRow.city ? selectedRow.city.name : "" }},{{
                      selectedRow.zone ? selectedRow.zone.name : ""
                    }}
                  </h5>
                  <!-- <h5 class="primary--text font-weight-bold">
                    {{ selectedRow.city?selectedRow.city.name:'' }},{{ selectedRow.zone?selectedRow.zone.name:'' }}
                  </h5> -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Discount"
                    rules="onlydigit"
                  >
                    <v-text-field
                      v-model="selectedRow.total_overall_discount"
                      label="Discount"
                      :error-messages="errors"
                      type="number"
                      required
                      outlined
                      dense
                      class="flex-grow-0"
                      @keypress="isNumber($event)"
                    />
                  </validation-provider>
                  <!-- </v-flex> -->
                  <!-- </v-layout> -->
                </div>
                <v-autocomplete
                  v-model="selectedRow.products"
                  label="Products *"
                  :items="JSON.parse(JSON.stringify(product_data))"
                  item-text="product_name"
                  return-object
                  multiple
                  outlined
                  hide-details
                >
                  <template #selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click="data.select"
                      @click:close="unselectProduct(selectedRow, data.item)"
                    >
                      {{ data.item.product_name }}
                    </v-chip>
                  </template>
                </v-autocomplete>
                <v-simple-table
                  class="overflow-y-auto px-4"
                  style="max-height: calc(98vh - 75px - 59px - 87px)"
                >
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          No.
                        </th>
                        <th class="text-left">
                          Product
                        </th>
                        <th class="text-left">
                          Bottle Return
                        </th>
                        <th class="text-left">
                          Exclusive Bottle
                        </th>
                        <th class="text-left">
                          Unit Price
                        </th>
                        <th class="text-left">
                          Qty
                        </th>
                        <th class="text-left">
                          Price
                        </th>
                        <th class="text-left">
                          Sub Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, id) in selectedRow.products" :key="id">
                        <td>{{ id + 1 }}</td>
                        <td>{{ item.product_name }}</td>
                        <td>
                          {{ item.bottle_return }}
                        </td>
                        <td>
                          <v-checkbox v-model="item.not_include_bottle" />
                        </td>
                        <td v-if="item.not_include_bottle">
                          {{ item.without_bottle_price }}
                        </td>
                        <td v-else>
                          {{ item.unit_price }}
                        </td>
                        <td>
                          <validation-provider
                            v-slot="{ errors }"
                            name="Qty"
                            :rules="`required|min_value:1`"
                          >
                            <v-text-field
                              v-model="item.qty"
                              class="qty_field"
                              label="Qty"
                              required
                              :error-messages="errors"
                              type="number"
                              @keypress="isQty($event)"
                            />
                          </validation-provider>
                        </td>
                        <td v-if="item.not_include_bottle">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Price"
                            rules="required|onlydigit"
                          >
                            <v-text-field
                              v-model="item.without_bottle_price"
                              class="qty_field"
                              label="Price"
                              required
                              :error-messages="errors"
                              type="number"
                              @keypress="isNumber($event)"
                            />
                          </validation-provider>
                        </td>
                        <td v-else>
                          <validation-provider
                            v-slot="{ errors }"
                            name="Price"
                            rules="required|onlydigit"
                          >
                            <v-text-field
                              v-model="item.price"
                              class="qty_field"
                              label="Price"
                              required
                              :error-messages="errors"
                              type="number"
                              @keypress="isNumber($event)"
                            />
                          </validation-provider>
                        </td>
                        <td v-if="item.not_include_bottle">
                          {{ item.without_bottle_price * item.qty }}
                        </td>
                        <td v-else>
                          {{ item.price * item.qty }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot v-show="'products' in selectedRow">
                      <tr>
                        <td colspan="6" />
                        <td class="font-weight-bold">
                          Total Quantity
                        </td>
                        <td class="font-weight-bold">
                          {{ totalQty }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6" />
                        <td class="font-weight-bold">
                          Total Price
                        </td>
                        <td class="font-weight-bold">
                          {{ totalPrice }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6" />
                        <td class="font-weight-bold">
                          Total Order Discount
                        </td>
                        <td class="font-weight-bold">
                          {{ selectedRow.total_overall_discount }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="6" />
                        <td class="font-weight-bold">
                          Total OrderAmount
                        </td>
                        <td class="font-weight-bold">
                          {{ totalOrderAmount }}
                        </td>
                      </tr>
                      <!-- <tr>
                        <td class="font-weight-bold">
                          <v-col
                            cols="12"
                            md="12"
                          >
                            <v-textarea
                              v-model="selectedRow.note"
                              outlined
                              label="Note"
                            />
                          </v-col>
                        </td>
                        <td colspan="7" />
                      </tr> -->
                    </tfoot>
                  </template>
                </v-simple-table>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-col cols="12" md="12">
            <v-textarea
              v-model="selectedRow.note"
              outlined
              label="Note"
              rows="2"
            />
          </v-col>
        </v-card>
      </v-form>
    </validation-observer>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    selectedRow: {},
    disabledButton: false,
    isLoading: false,
    customer_data: [],
    product_data: [],
    sources: []
  }),

  async fetch () {
    try {
      const { data, message, status } = await this.$request.fetchData(
        this.$url.CUSTOMER_URL,
        this.jwt
      )
      if (status === 1) {
        this.customer_data = data
      } else {
        this.handleStatus({ status, message, that: this })
      }
    } catch (error) {
      this.handleException({ error, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
      // customer_data: 'order/customer_data',
      // product_data: 'order/product_data'
    }),
    // products () {
    //   return JSON.parse(JSON.stringify(this.product_data))
    // },

    showGlobalOrderForm: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    totalQty () {
      if (!Object.keys(this.selectedRow).length) {
        return 0
      }
      if (!('products' in this.selectedRow)) {
        return 0
      }
      return this.selectedRow.products.reduce((qty, item) => {
        return qty + parseInt(item.qty)
      }, 0)
    },
    totalPrice () {
      if (!Object.keys(this.selectedRow).length) {
        return 0
      }
      if (!('products' in this.selectedRow)) {
        return 0
      }
      return this.selectedRow.products.reduce((res, prd) => {
        if (prd.not_include_bottle === true) {
          return (
            res +
            parseInt(prd.without_bottle_price) *
              parseInt(prd.qty === '' ? 0 : prd.qty)
          )
        } else {
          return (
            res + parseInt(prd.price) * parseInt(prd.qty === '' ? 0 : prd.qty)
          )
        }
      }, 0)
    },
    totalOrderAmount () {
      if (!Object.keys(this.selectedRow).length) {
        return 0
      }
      if (!('products' in this.selectedRow)) {
        return 0
      }
      return (
        this.totalPrice - this.selectedRow.total_overall_discount ||
        this.totalPrice
      )
    }
  },
  watch: {
    'selectedRow.products': {
      async handler (newVal, oldVal) {
        if (!newVal || oldVal === newVal) {
          return
        }
        let product_id = ''
        let selected_product = {}
        if (!oldVal) {
          selected_product = newVal[0]
          product_id = selected_product.product_id
        } else if (
          newVal.length === oldVal.length ||
          newVal.length < oldVal.length
        ) {
          return
        } else {
          product_id = newVal[newVal.length - 1].product_id
          // return
        }
        try {
          this.disabledButton = true
          const { return_bottle_count, message, status } =
            await this.$request.fetchData(
              `${this.$url.BOTTLE_RETURN_COUNT_URL}?customer_id=${this.selectedRow.id}&product_id=${product_id}`,
              this.jwt
            )
          if (status === 1) {
            this.selectedRow.products = this.selectedRow.products.map(
              (prod) => {
                if (prod.product_id === product_id) {
                  prod.bottle_return = return_bottle_count
                  // prod.stock = stock_count
                }
                return prod
              }
            )
          } else {
            this.handleStatus({ status, message, that: this })
          }
        } catch (error) {
          this.handleException({ error, that: this })
        }
        this.disabledButton = false
      },
      deep: true
    }
  },
  async beforeMount () {
    this.sources = await this.getFromLocalStorage('stored:sources')
  },
  async created () {
    const { data, message, status } = await this.$request.fetchData(
      this.$url.PRODUCT_URL,
      this.jwt
    )

    if (status === 1) {
      this.product_data = data.map((prd) => {
        const product = (({
          id,
          name,
          item_code,
          price,
          without_bottle_price
        }) => ({
          product_id: id,
          product_name: name,
          product_item_code: item_code,
          unit_price: parseInt(price),
          without_bottle_price: parseInt(without_bottle_price),
          price: parseInt(price),
          qty: 1,
          discount_amount: 0,
          bottle_return: 0,
          not_include_bottle: false
        }))(prd)
        return product
      })
    } else {
      this.handleStatus({ status, message, that: this })
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'New Order',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'New Order')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {

    getCustomerName (customer) {
      return `${customer.name} (${customer.city.name})`
    },
    getProductName (product) {
      return `${product.name} (${parseInt(product.price)})`
    },
    unselectProduct (user, product) {
      // delete product.products
      // if (product.id === this.selectedRow.id) { this.selectedRow = {} }
      const foundIndex = user.products.findIndex(
        prd => prd.product_id === product.product_id
      )
      user.products.splice(foundIndex, 1)
    },
    async saveOrder () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      const isValid =
        (await this.selectedRow.products.findIndex(prd => prd.qty === '')) ===
        -1
      if (!isValid) {
        this.disabledButton = false
        this.handleStatus({
          status: 2,
          message: 'Invalid Quantity Input!',
          that: this
        })
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const create_payload = this.$model.CREATE_ORDER_PAYLOAD(
          this.selectedRow
        )
        const { message, status, data } = await this.$request.postData(
          this.$url.ORDER_URL,
          create_payload,
          this.jwt
        )
        if (status === 1) {
          this.$root.$emit('createdOrder', data)
          successMessage = `Success: New Order for "${data.customer_name}" was Created!.`
          this.selectedRow = {}
          this.closeOrderForm()
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.isLoading = false
      this.disabledButton = false
    },
    async closeOrderForm () {
      this.$store.dispatch('order/setShowOrderForm', false)
      await setTimeout(() => {
        this.$router.push('/orders')
      }, 100)
    }
  }
}
</script>
<style>
.qty_field {
  width: 100px !important;
}
</style>
