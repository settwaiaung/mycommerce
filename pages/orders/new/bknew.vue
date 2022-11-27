<template>
  <v-container fluid>
    <div v-shortkey="['ctrl', 'b']" @shortkey="closeOrderForm" />
    <validation-observer
      ref="observer"
    >
      <v-form ref="form" @submit.prevent="saveOrder" @keyup.enter="saveOrder">
        <v-card>
          <v-card-title class="pb-0">
            <v-autocomplete
              v-model="selectedCustomers"
              dense
              label="Select Customers *"
              :items="JSON.parse(JSON.stringify(customer_data))"
              item-text="name"
              return-object
              multiple
              :counter="exampleDropdown.maxSelectedLength"
              :menu-props="exampleDropdown.menuProps"
              @input="checkSelectedExamplesLimit"
            >
              <template #selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="unselectCustomer(data.item)"
                >
                  {{ getCustomerName(data.item) }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-card-title>
          <v-layout wrap justify-end class="px-4">
            <v-flex
              shrink
            >
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
              >
                Save
              </v-btn>
            </v-flex>
          </v-layout>
          <v-divider />
          <v-card-text>
            <v-layout wrap>
              <v-flex md4 sm12 xs12>
                <v-simple-table
                  v-show="selectedCustomers.length"
                  class="overflow-y-auto px-4"
                  style="max-height: calc(98vh - 75px - 59px - 87px)"
                >
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left font-weight-bold">
                          Selected Suctomers
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(customer,i) in selectedCustomers"
                        :key="i"
                        :class="{'tw-bg-indigo-300':customer.id===selectedRow.id}"
                        @click="chooseCustomer(customer)"
                      >
                        <td>{{ getCustomerName(customer) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-flex>
              <v-divider vertical />
              <v-flex v-show="Object.keys(selectedRow).length>0" md8 sm12 xs12>
                <v-simple-table
                  class="overflow-y-auto px-4"
                  style="max-height: calc(98vh - 75px - 59px - 87px)"
                >
                  <template #default>
                    <caption>
                      <h5 class="primary--text font-weight-bold">
                        {{ selectedRow.name?selectedRow.name:'' }},{{ selectedRow.phone?selectedRow.phone:'' }}
                      </h5>
                      <h5 class="primary--text font-weight-bold">
                        {{ selectedRow.city?selectedRow.city.name:'' }},{{ selectedRow.zone?selectedRow.zone.name:'' }}
                      </h5>
                      <v-layout>
                        <v-flex md10 sm12 xs12>
                          <v-autocomplete
                            v-model="selectedRow.products"
                            label="Products *"
                            :items="JSON.parse(JSON.stringify(product_data))"
                            item-text="product_name"
                            return-object
                            multiple
                            dense
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
                        </v-flex>
                        <v-flex md2 sm12 xs12>
                          <validation-provider
                            v-slot="{ errors }"
                            name="Order Discount"
                            rules="onlydigit"
                          >
                            <v-text-field
                              v-model="selectedRow.total_overall_discount"
                              label="Order Discount"
                              :error-messages="errors"
                              type="number"
                              required
                              outlined
                              hide-details
                              dense
                              @keypress="isNumber($event)"
                            />
                          </validation-provider>
                        </v-flex>
                      </v-layout>
                    </caption>
                    <thead>
                      <tr>
                        <th class="text-left">
                          No.
                        </th>
                        <th class="text-left">
                          Products
                        </th>
                        <th class="text-left">
                          Price
                        </th>
                        <th class="text-left">
                          Qty
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
                        <td>{{ item.price }}</td>
                        <td>
                          <validation-provider
                            v-slot="{ errors }"
                            name="Qty"
                            rules="required|onlydigit"
                          >
                            <v-text-field
                              v-model="item.qty"
                              class="qty_field"
                              label="Qty"
                              required
                              :error-messages="errors"
                              type="number"
                              @keypress="isNumber($event)"
                            />
                          </validation-provider>
                        </td>
                        <td>
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
    selectedCustomers: [],
    selectedRow: {},
    disabledButton: false,
    isLoading: false,
    exampleDropdown: {
      maxSelectedLength: 5,
      menuProps: {
        disabled: false
      }
    }
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      customer_data: 'order/customer_data',
      product_data: 'order/product_data'
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
        return res + (parseInt(prd.price) * parseInt(prd.qty === '' ? 0 : prd.qty))
      }, 0)
    },
    totalOrderAmount () {
      if (!Object.keys(this.selectedRow).length) { return 0 }
      if (!('products' in this.selectedRow)) { return 0 }
      return this.totalPrice - this.selectedRow.total_overall_discount || this.totalPrice
    }
  },
  methods: {
    checkSelectedExamplesLimit () {
      this.selectedCustomers.length >= this.exampleDropdown.maxSelectedLength
        ? (this.exampleDropdown.menuProps.disabled = true)
        : (this.exampleDropdown.menuProps.disabled = false)
    },
    getCustomerName (customer) {
      return `${customer.name} (${customer.city.name})`
    },
    getProductName (product) {
      return `${product.name} (${parseInt(product.price)})`
    },
    unselectCustomer (customer) {
      // delete customer.products
      if (customer.id === this.selectedRow.id) { this.selectedRow = {} }
      const foundIndex = this.selectedCustomers.findIndex(
        cus => cus.id === customer.id
      )
      this.selectedCustomers.splice(foundIndex, 1)
    },
    unselectProduct (user, product) {
      // delete product.products
      // if (product.id === this.selectedRow.id) { this.selectedRow = {} }
      const foundIndex = user.products.findIndex(
        prd => prd.product_id === product.product_id
      )
      user.products.splice(foundIndex, 1)
    },
    chooseCustomer (item) {
      // if (!item.products) { return }
      // this.selectedRow = JSON.parse(JSON.stringify(item))
      // this.selectedRow = Object.assign({}, item)
      this.selectedRow = item
    },
    async saveOrder () {
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
        const create_payload = this.$model.CREATE_ORDER_PAYLOAD(this.selectedRow)
        const { message, status, data } = (await this.$request.postData(this.$url.ORDER_URL, create_payload, this.jwt))
        if (status === 1) {
          this.$root.$emit('createdOrder', data)
          successMessage = `Success: New Order for "${data.customer_name}" was Created!.`
          const currentIndex = this.selectedCustomers.findIndex(cus => cus.id === this.selectedRow.id)
          if (currentIndex >= 0 && currentIndex < this.selectedCustomers.length - 1) {
            this.selectedRow = this.selectedCustomers[currentIndex + 1]
          } else {
            this.selectedRow = {}
            this.closeOrderForm()
          }
          this.selectedCustomers.splice(currentIndex, 1)
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
.qty_field{
  width:100px !important;
}
</style>
