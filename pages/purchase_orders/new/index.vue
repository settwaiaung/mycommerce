<template>
  <v-container fluid>
    <div v-shortkey="['ctrl', 'b']" @shortkey="closeOrderForm" />
    <validation-observer
      ref="observer"
    >
      <v-form ref="form" @submit.prevent="savePurchaseOrder" @keyup.enter="savePurchaseOrder">
        <v-card>
          <v-card-title>
            <v-autocomplete
              v-model="selectedRow.resourceable_type"
              dense
              label="Type *"
              :items="resources"
              item-text="name"
              :item-value="selectedRow.resourceable_type"
              return-object
              outlined
              hide-details
              style="margin-right:30px"
              py-2
            />
            <v-autocomplete
              v-if="selectedRow.resourceable_type === 'Supplier'"
              v-model="selectedRow.customer_id"
              dense
              label="Supplier *"
              :items="customer_data"
              :item-text="(item)=>item ? item.name+'-'+'('+item.phone+')':item.name"
              return-object
              outlined
              hide-details
            />
            <v-autocomplete
              v-else
              v-model="selectedRow.customer_id"
              dense
              label="Customer *"
              :items="customer_data"
              :item-text="(item)=>item ? item.name+'-'+'('+item.phone+')':item.name"
              return-object
              outlined
              hide-details
            />
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              @click="closeOrderForm"
            >
              <v-icon
                dark
              >
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
              <v-flex v-show="Object.keys(selectedRow).length>0" md12 sm12 xs12>
                <div>
                  <v-row
                    class="d-flex justify-space-between"
                  >
                    <v-col
                      cols="12"
                      sm="3"
                    >
                      <DatePicker v-model="selectedRow.purchase_date" class="px-1" label="Purchase Date" />
                    </v-col>
                    <v-col
                      v-if="selectedRow.customer_id"
                      cols="12"
                      sm="4"
                    >
                      <h5 class="primary--text font-weight-bold">
                        {{ selectedRow.customer_id ? selectedRow.customer_id.name:'' }},{{ selectedRow.customer_id?selectedRow.customer_id.phone:'' }},
                        {{ selectedRow.customer_id ? selectedRow.customer_id.city.name:'' }},{{ selectedRow.customer_id ? selectedRow.customer_id.zone.name:'' }}
                      </h5>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="2"
                    >
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
                    </v-col>
                  </v-row>
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
                      @click:close="unselectProduct(selectedRow,data.item)"
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
                      <tr
                        v-for="(item,id) in selectedRow.products"
                        :key="id"
                      >
                        <td>{{ id+1 }}</td>
                        <td>{{ item.product_name }}</td>
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
                          {{ item.without_bottle_price*item.qty }}
                        </td>
                        <td v-else>
                          {{ item.price*item.qty }}
                        </td>
                      </tr>
                    </tbody>

                    <tfoot v-show="'products' in selectedRow">
                      <tr>
                        <td colspan="3" />
                        <td class="font-weight-bold">
                          Total Quantity
                        </td>
                        <td class="font-weight-bold">
                          {{ totalQty }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" />
                        <td class="font-weight-bold">
                          Total Price
                        </td>
                        <td class="font-weight-bold">
                          {{ totalPrice }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" />
                        <td class="font-weight-bold">
                          Total Order Discount
                        </td>
                        <td class="font-weight-bold">
                          {{ selectedRow.total_overall_discount }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" />
                        <td class="font-weight-bold">
                          Total OrderAmount
                        </td>
                        <td class="font-weight-bold">
                          {{ totalOrderAmount }}
                        </td>
                      </tr>
                    </tfoot>
                  </template>
                </v-simple-table>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-col
            cols="12"
            md="12"
          >
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
    resourceable_value: '',
    resources: ['Customer', 'Supplier']
  }),
  async fetch () {
    const { data, message, status } = await this.$request.fetchData(this.$url.PRODUCT_URL, this.jwt)
    if (status === 1) {
      this.product_data = data.map((prd) => {
        const product = (({ id, name, item_code, price, without_bottle_price }) => ({ product_id: id, product_name: name, product_item_code: item_code, unit_price: parseInt(price), without_bottle_price: parseInt(without_bottle_price), price: parseInt(price), qty: 1, discount_amount: 0, bottle_return: 0, not_include_bottle: false }))(prd)
        return product
      })
    } else {
      this.handleStatus({ status, message, that: this })
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    showGlobalOrderForm: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    totalQty () {
      if (!Object.keys(this.selectedRow).length) { return 0 }
      if (!('products' in this.selectedRow)) { return 0 }
      return this.selectedRow.products.reduce((qty, item) => {
        return qty + parseInt(item.qty)
      }, 0)
    },
    totalPrice () {
      if (!Object.keys(this.selectedRow).length) { return 0 }
      if (!('products' in this.selectedRow)) { return 0 }
      return this.selectedRow.products.reduce((res, prd) => {
        if (prd.not_include_bottle === true) {
          return res + (parseInt(prd.without_bottle_price) * parseInt(prd.qty === '' ? 0 : prd.qty))
        } else {
          return res + (parseInt(prd.price) * parseInt(prd.qty === '' ? 0 : prd.qty))
        }
      }, 0)
    },
    totalOrderAmount () {
      if (!Object.keys(this.selectedRow).length) { return 0 }
      if (!('products' in this.selectedRow)) { return 0 }
      return this.totalPrice - this.selectedRow.total_overall_discount || this.totalPrice
    }
  },
  watch: {

    'selectedRow.resourceable_type': {
      async handler (newVal, oldVal) {
        if (newVal === 'Customer') {
          const { data, message, status } = await this.$request.fetchData(this.$url.CUSTOMER_URL, this.jwt)
          if (status === 1) {
            this.customer_data = data
          } else {
            this.handleStatus({ status, message, that: this })
          }
        } else if (newVal === 'Supplier') {
          const { data, message, status } = await this.$request.fetchData(this.$url.SUPPLIER_URL, this.jwt)
          if (status === 1) {
            this.customer_data = data
          } else {
            this.handleStatus({ status, message, that: this })
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    const breadCrumbs = [
      {
        text: 'New Purchase Order',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'New Purchase Order')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    unselectProduct (user, product) {
      // delete product.products
      // if (product.id === this.selectedRow.id) { this.selectedRow = {} }
      const foundIndex = user.products.findIndex(
        prd => prd.product_id === product.product_id
      )
      user.products.splice(foundIndex, 1)
    },
    async savePurchaseOrder () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      const isValid = await this.selectedRow.products.findIndex(prd => prd.qty === '') === -1
      if (!isValid) {
        this.disabledButton = false
        this.handleStatus({ status: 2, message: 'Invalid Quantity Input!', that: this })
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const create_payload = this.$model.CREATE_PURCHASEORDER_PAYLOAD(this.selectedRow)
        if (create_payload.resourceable_type === 'Customer') {
          create_payload.customer_id = this.selectedRow.customer_id.id
        } else {
          create_payload.supplier_id = this.selectedRow.customer_id.id
        }
        const { message, status, data } = (await this.$request.postData(this.$url.PURCHASEORDER_URL, create_payload, this.jwt))
        if (status === 1) {
          this.$root.$emit('createdPurchaseOrder', data)
          successMessage = `Success: New Purchase Order for "${data.resourceable.name}" was Created!.`
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
      this.$store.dispatch('order/setShowPurchaseOrderForm', false)
      await setTimeout(() => {
        this.$router.push('/purchase_orders')
      }, 100)
    }
  }
}
</script>
<style>
.qty_field{
  width:100px !important;
}
</style>
