<template>
  <v-stepper-content class="pa-0" step="2">
    <validation-observer
      ref="observer"
    >
      <v-form ref="form" @submit.prevent="onSaveOrder" @keyup.enter="onSaveOrder">
        <v-card>
          <v-progress-linear
            v-show="isLoading"
            :indeterminate="isLoading"
            color="primary"
          />
          <v-card-title>
            <span class="primary--text mx-0 text-h5">
              {{ dialogTitle }}
            </span>
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              class="mx-2"
              @click="closeForm()"
            >
              <v-icon
                dark
              >
                mdi-arrow-left-bold-box
              </v-icon>
              Back
            </v-btn>
            <v-btn
              :disabled="disabledButton"
              color="primary"
              type="submit"
              :loading="isLoading"
            >
              Save
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-layout
              row
              wrap
            >
              <OrderHistory
                v-model="historyForm"
                class="section_container"
                :order="model"
              />
              <v-divider vertical />
              <v-flex
                v-show="historyForm.editCustomerInfo"
                md3
                sm12
                xs12
              >
                <v-layout class="my-0">
                  <v-flex
                    md12
                    sm12
                    xs12
                  >
                    <!-- customer -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="Customer"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="model.customer"
                        label="Customer *"
                        :items="JSON.parse(JSON.stringify(customer_data))"
                        item-text="name"
                        return-object
                        required
                        :error-messages="errors"
                      />
                    </validation-provider>
                  </v-flex>
                </v-layout>
                <!-- note -->
                <v-textarea
                  v-if="model.customer"
                  v-model="model.note"
                  outlined
                  label="Note"
                  rows="2"
                />
                <!-- <v-layout v-if="model.billing_address">
                  <v-flex
                    md6
                    sm12
                    xs12
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="City"
                      :rules="{required:model.billing_address.zone||false}"
                    >
                      <v-autocomplete
                        v-model="model.billing_address.city"
                        label="City "
                        :items="cities"
                        item-text="name"
                        return-object
                        required
                        :error-messages="errors"
                        dense
                      />
                    </validation-provider>
                  </v-flex>
                  <v-flex
                    md6
                    sm12
                    xs12
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Zone"
                      :rules="{required:model.billing_address.city||false}"
                    >
                      <v-autocomplete
                        v-model="model.billing_address.zone"
                        label="Zone"
                        :items="zones"
                        item-text="name"
                        return-object
                        required
                        :error-messages="errors"
                        dense
                        :disabled="!model.billing_address.city"
                      />
                    </validation-provider>
                  </v-flex>
                </v-layout> -->
                <!-- address -->
                <v-textarea
                  v-if="model.customer"
                  v-model="model.delivery_address"
                  label="Address"
                  rows="2"
                  flat
                  outlined
                />
              </v-flex>
              <v-divider
                vertical
              />
              <v-flex
                :class="{'md9':!historyForm.editCustomerInfo,'md6':historyForm.editCustomerInfo}"
                sm12
                xs12
                class="section_container"
              >
                <v-data-table
                  :headers="headers"
                  :items="model.order_items"
                  hide-default-footer
                >
                  <template #top>
                    <v-toolbar flat>
                      <v-btn
                        depressed
                        color="primary"
                        @click="addNew"
                      >
                        <v-icon dark>
                          mdi-plus
                        </v-icon>Add Item
                      </v-btn>
                      <v-spacer />
                      <validation-provider
                        v-slot="{ errors }"
                        name="Order Discount"
                        rules="onlydigit"
                      >
                        <v-text-field
                          v-model="model.total_overall_discount"
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
                    </v-toolbar>
                  </template>
                  <template #[`item.actions`]="{ item }">
                    <div v-if="item.id===selectedItem.id">
                      <v-icon color="red" class="mr-3" @click="close">
                        mdi-window-close
                      </v-icon>
                      <v-icon color="info" @click="saveItem">
                        mdi-content-save
                      </v-icon>
                    </div>
                    <div v-else>
                      <v-icon color="red" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                      <v-icon color="info" class="mr-3" @click="editItem(item)">
                        mdi-pencil
                      </v-icon>
                    </div>
                  </template>
                  <template #[`item.product_name`]="{ item }">
                    <v-autocomplete
                      v-if="item.id===selectedItem.id"
                      v-model="editedProduct"
                      label="Products *"
                      :items="JSON.parse(JSON.stringify(product_data))"
                      item-text="product_name"
                      item-value="product_id"
                      return-object
                      :autofocus="true"
                      @change="checkExisting"
                    />
                    <span v-else>{{ item.product_name }}</span>
                  </template>
                  <template #[`item.qty`]="{ item }">
                    <v-text-field
                      v-if="item.id === selectedItem.id"
                      v-model="editedProduct.qty"
                      :hide-details="true"
                      dense
                      single-line
                      class="qtyField"
                      @keypress="isNumber($event)"
                    />
                    <span v-else>{{ parseInt(item.qty) }}</span>
                  </template>
                  <template #[`item.price`]="{ item }">
                    <span
                      v-if="item.id === selectedItem.id"
                    >{{ editedProduct.price }}</span>
                    <span v-else>{{ item.price }}</span>
                  </template>
                  <template #[`item.amount`]="{ item }">
                    <span
                      v-if="item.id === selectedItem.id"
                    >{{ editedProduct.qty?parseInt(editedProduct.price)*parseInt(editedProduct.qty) :parseInt(editedProduct.price) }}</span>
                    <span v-else>{{ item.amount }}</span>
                  </template>
                  <template slot="body.append">
                    <tr class="font-weight-bold">
                      <td colspan="3" />
                      <td>
                        Total Quantity
                      </td>
                      <td>
                        {{ totalQty }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td colspan="3" />
                      <td>
                        Total Price
                      </td>
                      <td>
                        {{ totalPrice }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td colspan="3" />
                      <td>
                        Total Order Discount
                      </td>
                      <td>
                        {{ model.total_overall_discount }}
                      </td>
                    </tr>
                    <tr class="font-weight-bold">
                      <td colspan="3" />
                      <td>
                        Total Order Amount
                      </td>
                      <td>
                        {{ totalOrderAmount }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                <v-divider />
                <!-- qty -->
              </v-flex>
              <v-divider
                vertical
              />
            </v-layout>
          </v-card-text>
        </v-card>
      </v-form>
    </validation-observer>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
import OrderHistory from '@/components/widgets/order/OrderHistory.vue'
export default {
  components: {
    OrderHistory
  },
  data: () => {
    return {
      cities: [],
      origin_zones: [],
      zones: [],
      model: {},
      dialogTitle: '',
      disabledButton: false,
      isLoading: false,
      editedIndex: -1,
      selectedItem: {
        is_new: false
      },
      editedProduct: {},
      defaultItem: {
        qty: 1,
        price: 0
      },
      addObj: { },
      historyForm: {
        editCustomerInfo: false,
        showOrderHistory: false
      }
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale',
      customer_data: 'order/customer_data',
      product_data: 'order/product_data'
    }),
    headers () {
      return this.$tableHeaders.orderItemHeader(this.locale)
    },
    totalQty () {
      if (!this.model.order_items) { return 0 }
      return this.model.order_items.reduce((qty, item) => {
        return qty + parseInt(item.qty)
      }, 0)
    },
    totalPrice () {
      if (!this.model.order_items) { return 0 }
      return this.model.order_items.reduce((price, item) => {
        return price + (parseInt(item.qty) * parseInt(item.price))
      }, 0)
    },
    totalProductDiscount () {
      if (!this.model.order_items) { return 0 }
      return this.model.order_items.reduce((discount, item) => {
        return discount + parseInt(item.discount_amount)
      }, 0)
    },
    totalOrderAmount () {
      if (!this.model.order_items) { return 0 }
      return this.totalPrice - this.model.total_overall_discount || 0
    }
  },
  watch: {
    'editedProduct.product_id': {
      handler (newVal, oldVal) {
        this.editedProduct.qty = Object.entries(this.selectedItem).length > 0
          ? this.selectedItem.qty
          : newVal
      },
      deep: true
    },
    'model.billing_address.city': {
      handler (newVal) {
        if (newVal && this.zones.length) {
          this.zones = this.zones.filter(zone => zone.city.id === newVal.id)
          this.model.billing_address.zone = this.zones[0]
        }
      },
      deep: true
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
    this.zones = await this.getFromLocalStorage('stored:zones')
  },
  mounted () {
    this.$parent.$parent.$on('newForm', () => {
      this.dialogTitle = 'New Customer'
    })
    this.$parent.$parent.$on('editForm', (item) => {
      this.dialogTitle = `Order ${item.order_no}`
      this.model = Object.assign({}, item)
    })
    this.$parent.$parent.$on('deletedData', (item) => {
      const index = this.model.order_items.indexOf(item)
      this.model.order_items.splice(index, 1)
    })
  },
  methods: {
    async onSaveOrder () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const update_payload = this.$model.UPDATE_ORDER_PAYLOAD(this.model)
        const { message, status, data } = (await this.$request.putData(`${this.$url.ORDER_URL}/${this.model.id}`, update_payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Order "${this.model.order_no}"  was Updated!.`
          this.closeForm(data, 'updated')
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }

      this.isLoading = false
      this.disabledButton = false
    },
    closeForm (data = null, action = null) {
      this.historyForm.editCustomerInfo = false
      this.$emit('onGoBack', data, action)
    },
    editItem (item) {
      this.editedIndex = this.model.order_items.indexOf(item)
      this.selectedItem = Object.assign({ ...this.selectedItem }, (({ id, qty }) => ({ id, qty: parseInt(qty) }))(item))
      this.editedProduct = Object.assign({}, (({ product_id, product_name, product_item_code, qty, price, amount, discount_amount }) => ({ product_id, product_name, product_item_code, qty, price, amount, discount_amount }))(item))
    },
    close () {
      setTimeout(() => {
        // this.editedItem = Object.assign({}, this.defaultItem)
        this.selectedItem = {}
        this.editedProduct = {}
        this.editedIndex = -1
        this.removeAddedObj()
      }, 300)
    },
    addNew () {
      if ('qty' in this.addObj) { return false }
      this.addObj = Object.assign({}, this.defaultItem)
      this.addObj.id = this.model.order_items.length + 1
      this.model.order_items.unshift(this.addObj)
      this.selectedItem.is_new = true
      this.editItem(this.addObj)
    },
    checkExisting (prd) {
      const existedProduct = this.model.order_items.find(item => item.product_id === prd.product_id)
      if (existedProduct) {
        this.handleStatus({ status: 1, message: '', that: this, successMessage: `" ${existedProduct.product_name} " is Already Exist. You can update it!` })
        this.editItem(existedProduct)
        this.removeAddedObj()
      }
    },
    removeAddedObj () {
      if (Object.keys(this.addObj).length > 0) {
        const addedIndex = this.model.order_items.indexOf(this.addObj)
        this.model.order_items.splice(addedIndex, 1)
        this.addObj = {}
      }
    },
    async saveItem () {
      if (this.editedIndex > -1) {
        // Object.assign(this.model.order_items[this.editedIndex], this.editedItem)
        // this.editedItem = { ...this.editItem, ...this.editedProduct }
        this.isLoading = true
        let successMessage = ''
        if (this.selectedItem.is_new) {
          try {
            const create_payload = Object.assign({ ...this.editedProduct }, { order_id: this.model.id })
            const { message, status, data } = (await this.$request.postData(this.$url.ORDER_ITEM_URL, create_payload, this.jwt))
            if (status === 1) {
              successMessage = `Success: New Item "${this.editedProduct.product_name}" was Added!.`
              Object.assign(this.model.order_items[this.editedIndex], data)
            }
            this.handleStatus({ status, message, that: this, successMessage })
          } catch (error) {
            this.handleException({ error, that: this })
          }
        } else {
          try {
            const update_payload = this.editedProduct
            const { message, status, data } = (await this.$request.putData(`${this.$url.ORDER_ITEM_URL}/${this.selectedItem.id}`, update_payload, this.jwt))
            if (status === 1) {
              Object.assign(this.model.order_items[this.editedIndex], data)
              successMessage = `Success: Item "${this.editedProduct.product_name}"  was Updated!.`
            }
            this.handleStatus({ status, message, that: this, successMessage })
            this.close()
          } catch (error) {
            this.handleException({ error, that: this })
          }
        }
        this.isLoading = false
      }
    },
    deleteItem (item) {
      this.$emit('onDeleteItem', item)
    },
    getCustomerInfo () {
      const Info = (({
        customer_name, customer_phone,
        customer_city_name,
        customer_zone_name,
        customer_address
      }) => ({
        customer_name,
        customer_phone,
        customer_city_name,
        customer_zone_name,
        customer_address
      }))(this.model)
      return Info
    }

  }
}
</script>
