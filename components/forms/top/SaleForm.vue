<template>
  <v-stepper-content class="content_wrapper_stepper" step="2">
    <v-card id="no_print">
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />
      <v-card-title>
        <span class="text-h5 primary--text font-weight-bold">
          {{ model?model.invoice_no:'' }}
        </span>
        <v-spacer />
        <h5 class="text-h5 primary--text font-weight-bold">
          {{ model.status?model.status.charAt(0).toUpperCase()+model.status.slice(1):'' }}
        </h5>
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
        <v-btn color="primary" outlined @click="emitPrint">
          <v-icon color="primary">
            mdi-printer
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col md="3" cols="12" class="section_container">
            <CustomerInfo v-if="model" :customer="model.customer">
              <v-divider />
              <v-list color="transparent" flat>
                <v-list-item>
                  <v-list-item-icon>
                    <v-badge
                      color="primary"
                      :content="model.total_qty"
                    >
                      <v-icon>
                        🛍️
                      </v-icon>
                    </v-badge>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-wrap" v-text="model.total_amount" />
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-for="(item,key) in saleSummary" :key="key" dense>
                  <v-list-item-icon>
                    <v-icon>
                      {{ key }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="text-wrap" v-text="item" />
                  </v-list-item-content>
                  <!-- </h3> -->
                </v-list-item>
              </v-list>
              <v-flex v-if="model.status!=='completed'" class="tw-bg-indigo-50 py-1 justify-space-around d-flex">
                <v-btn
                  class="mx-autox"
                  elevation="2"
                  color="primary"
                  outlined
                  @click="getCustomer"
                >
                  <v-icon>{{ showMarathonDeli?'mdi-close':'mdi-truck-cargo-container' }}</v-icon>
                </v-btn>
                <v-btn
                  v-if="model.status=='new'"
                  class="mx-4"
                  elevation="2"
                  color="secondary"
                  outlined
                  @click="makeVoid"
                >
                  VOID
                </v-btn>
                <Payment v-if="model.outstanding_amount!==0" v-model="paymentToggler" :sale="model" @onCreatedPayment="onCreatedPayment" />
              </v-flex>
              <!-- <v-flex v-if="model.status=='new'" class="tw-bg-indigo-50 py-1 justify-center d-flex">
                <v-btn
                  class="mx-4"
                  elevation="2"
                  color="secondary"
                  outlined
                  @click="makeVoid"
                >
                  VOID
                </v-btn>
              </v-flex> -->
              <!-- <Payment v-if="model.outstanding_amount>0" v-model="paymentToggler" :sale="model" @onCreatedPayment="onCreatedPayment" /> -->
              <v-btn
                color="primary"
                depressed
                fab
                small
                outlined
                @click="showHistory=!showHistory"
              >
                <v-icon>{{ showHistory?'mdi-close':'mdi-history' }}</v-icon>
              </v-btn>
              <v-btn
                right
                absolute
                class="mx-autox"
                elevation="2"
                color="primary"
                outlined
                @click="showPaymentHistory=!showPaymentHistory"
              >
                <v-icon>{{ showPaymentHistory?'mdi-close':'mdi-alarm-panel' }}</v-icon>
              </v-btn>
            </CustomerInfo>
            <HistoryList v-model="showHistory" :history-url="history_url" />
          </v-col>
          <v-divider vertical />
          <v-col
            v-show="showMarathonDeli"
            md="3"
            cols="12"
            class="py-0 section_container"
          >
            <validation-observer
              ref="deli_observer"
            >
              <v-form ref="deli_form" @submit.prevent="onAddDeli" @keyup.enter="onAddDeli">
                <!-- city -->
                <validation-provider
                  v-slot="{ errors }"
                  name="City"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="marathonDeli.receiver_city_id"
                    label="City *"
                    :items="JSON.parse(JSON.stringify(merchantCities))"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- zone -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Zone"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="marathonDeli.receiver_zone_id"
                    label="Zone *"
                    :items="merchant_zones"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- delivery_fee -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Delivery Fee"
                  :rules="{required:true,oneNineDigit:false}"
                >
                  <v-text-field
                    v-model="marathonDeli.delivery_amount"
                    label="Delivery Fee *"
                    required
                    type="number"
                    :error-messages="errors"
                    @keypress="isNumber($event)"
                  />
                </validation-provider>
                <v-text-field
                  :value="model.invoice_no"
                  :disabled="disabledButton||model.delivery_voucher_no"
                  label="Thirdparty Invoice"
                  required
                />
                <v-textarea
                  v-model="marathonDeli.remark"
                  :disabled="disabledButton||model.delivery_voucher_no"
                  label="Note"
                  auto-grow
                  outlined
                  rows="3"
                  row-height="25"
                  shaped
                  hide-details
                />
                <v-checkbox
                  v-model="marathonDeli.is_ntc"
                  :disabled="disabledButton||model.delivery_voucher_no"
                  label="NTC"
                />
                <v-btn
                  :disabled="disabledButton||model.delivery_voucher_no"
                  color="primary"
                  type="submit"
                  :loading="isLoading"
                  class="mx-2"
                >
                  {{ model.delivery_voucher_no?'Already Joined with Marathon':'Join with Marathon Delivery' }}
                </v-btn>
              </v-form>
            </validation-observer>
          </v-col>
          <v-divider
            vertical
          />
          <v-col
            :md="!showMarathonDeli?'9':'6'"
            cols="12"
            class="section_container"
          >
            <!-- <PrintSale
                  v-show="!showPaymentHistory"
                  :model="model"
                /> -->

            <v-data-table
              v-show="!showPaymentHistory"
              :headers="orderItemHeader"
              :items="model.sale_items"
              hide-default-footer
            >
              <template #top>
                <v-toolbar flat>
                  <v-spacer />
                  <validation-observer
                    ref="deli_fee_observer"
                  >
                    <!-- <v-form ref="deli_fee_form" @submit.prevent="onUpdateDeliFee" @keyup.enter="onUpdateDeliFee"> -->
                    <div class="d-flex mt-2">
                      <v-dialog
                        v-model="dialog"
                        width="600px"
                      >
                        <template #activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            :disabled="model.status === 'return'"
                            :loading="isLoading"
                            v-on="on"
                          >
                            Return
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            <span class="text-h5">Return</span>
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" sm="12">
                                <DatePicker v-model="model.return_date" label="Return Date" />
                              </v-col>
                              <v-col
                                cols="12"
                                sm="12"
                              >
                                <v-textarea
                                  v-model="model.return_note"
                                  label="Note"
                                  outlined
                                  rows="2"
                                />
                              </v-col>
                            </v-row>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer />
                            <v-btn
                              color="green darken-1"
                              text
                              @click="dialog = false"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              color="green darken-1"
                              text
                              @click="saleReturn"
                            >
                              Save
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <v-btn
                        :disabled="disabledButton"
                        color="primary"
                        type="submit"
                        :loading="isLoading"
                        class="mx-2"
                        @click="onUpdateDeliFee"
                      >
                        Update
                      </v-btn>
                    </div>
                    <!-- </v-form> -->
                  </validation-observer>
                </v-toolbar>
              </template>
              <v-divider />
              <template #[`item.unit_price`]="{ item }">
                <span>{{ curFm(item.unit_price) }}</span>
              </template>
              <p>{{ item }}</p>
              <template #[`item.not_include_bottle`]="{ item }">
                <v-checkbox
                  v-model="item.not_include_bottle"
                  disabled
                />
              </template>

              <template #[`item.qty`]="{ item }">
                <validation-provider
                  v-if="item.id === selectedItem.id"
                  v-slot="{ errors }"
                  name="Qty"
                  :rules="`required|min_value:1|max_value:${selectedItem.stock}`"
                >
                  <v-text-field
                    v-model="editedProduct.qty"

                    label="Qty"

                    required
                    :error-messages="errors"
                    class="qtyField"
                    type="number"
                    @keypress="isQty($event)"
                  />
                </validation-provider>
                <span v-else>{{ parseInt(item.qty) }}</span>
              </template>

              <template #[`item.price`]="{ item }">
                <validation-provider
                  v-if="item.id === selectedItem.id"
                  v-slot="{ errors }"
                  name="Price"
                  rules="required|onlydigit"
                >
                  <v-text-field
                    v-model="editedProduct.price"
                    class="qty_field"
                    label="Price"
                    required
                    :error-messages="errors"
                    type="number"
                    @keypress="isNumber($event)"
                  />
                </validation-provider>
                <span v-else>{{ curFm(item.price) }}</span>
              </template>
              <template #[`item.amount`]="{item}">
                {{ curFm(item.amount) }}
              </template>
              <template v-if="model.status==='new'" #[`item.actions`]="{ item }">
                <div v-if="item.id===selectedItem.id">
                  <v-icon color="red" class="mr-3" @click="closeItem">
                    mdi-window-close
                  </v-icon>
                  <v-icon color="info" @click="saveItem">
                    mdi-content-save
                  </v-icon>
                </div>
                <div v-else>
                  <!-- <v-icon color="red" @click="deleteItem(item)">
                    mdi-delete
                  </v-icon> -->
                  <v-icon color="info" class="mr-3" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                </div>
              </template>
              <template slot="body.append">
                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Total Quantity
                  </td>
                  <td>
                    {{ model.total_qty }}
                  </td>
                </tr>
                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Sub Total:
                  </td>
                  <td>
                    {{ curFm(model.total_amount) }}
                  </td>
                </tr>
                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Discount:
                  </td>
                  <td>
                    {{ curFm(model.total_discount)||0 }}
                  </td>
                </tr>
                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Delivery Amount:
                  </td>
                  <td>
                    {{ curFm(model.delivery_amount)||0 }}
                  </td>
                </tr>

                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Grand Total:
                  </td>
                  <td>
                    {{ curFm(model.grand_total) }}
                  </td>
                </tr>
                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Paid Amount:
                  </td>
                  <td>
                    {{ curFm(model.paid_amount)||0 }}
                  </td>
                </tr>
                <tr class="font-weight-bold">
                  <td :colspan="model.status!=='new'?5:6" />
                  <td>
                    Outstanding Amount:
                  </td>
                  <td>
                    {{ curFm(model.outstanding_amount)||0 }}
                  </td>
                </tr>
                <tr class="font-weight-bold">
                  <td>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Delivery Fee"
                      rules="onlydigit"
                    >
                      <v-text-field
                        v-model="model.delivery_amount"
                        label="Delivery Fee"
                        :error-messages="errors"
                        type="number"
                        required
                        outlined
                        dense
                      />
                    </validation-provider>
                  </td>
                  <td>
                    <v-col
                      cols="12"
                      sm="12"
                    >
                      <v-textarea
                        v-model="model.note"
                        label="Note"
                        outlined
                        rows="2"
                      />
                    </v-col>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <v-data-table
              v-show="showPaymentHistory"
              :headers="paymentHistoryHeader"
              :items="model.sale_payments"
              :loading-text="trans('tableDataLoading')"
              class="elevation-1"
            >
              <template #top>
                <v-toolbar
                  flat
                  color="primary"
                >
                  Payment History
                </v-toolbar>
              </template>
              <template #[`item.payment_amount`]="{item}">
                {{ curFm(item.payment_amount) }}
              </template>
            </v-data-table>
            <v-divider />
            <!-- qty -->
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerInfo from '@/components/widgets/customer/CustomerInfo.vue'
import HistoryList from '@/components/utils/HistoryList.vue'
import Payment from '~/components/widgets/sale/SalePayment.vue'
// import PrintSale from '@/components/widgets/sale/PrintSale.vue'

export default {
  components: {
    CustomerInfo,
    HistoryList,
    Payment
    // PrintSale
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data: () => {
    return {
      disabledButton: false,
      isLoading: false,
      editedIndex: -1,
      selectedItem: {
        is_new: false
      },
      editedProduct: {},
      // defaultItem: {
      //   qty: 1,
      //   price: 0
      // },
      addObj: { },
      showHistory: false,
      showPaymentHistory: false,
      showMarathonDeli: false,
      dialog: false,
      merchant_zones: [],
      marathonDeli: {
        receiver_city_id: '',
        receiver_zone_id: '',
        delivery_amount: '',
        remark: '',
        is_ntc: false
      }
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale',
      merchantCities: 'merchantAuth/merchantCities',
      merchantZones: 'merchantAuth/merchantZones',
      merchant: 'merchantAuth/merchant',
      merchantJWT: 'merchantAuth/merchantJWT'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    },
    paymentHistoryHeader () {
      return this.$tableHeaders.paymentHistoryHeader(this.locale)
    },
    orderItemHeader () {
      // return this.$tableHeaders.orderItemHeader(this.locale).filter(header => header.hideable ? !header.hideable : header)
      // return this.$tableHeaders.orderItemHeader(this.locale)
      return this.$tableHeaders.orderItemHeader(this.locale).filter(header =>
        header.hideable ? this.model.status === 'new' : header
      )
    },
    history_url () {
      return `${this.$url.SALE_URL}/${this.model.id}/histories`
    },
    saleSummary () {
      const summary = {
        'mdi-sale': this.curFm(this.model.total_discount) || 0,
        '🚚': this.curFm(this.model.delivery_amount) || 0,
        '💸': this.curFm(this.model.grand_total),
        'mdi-truck-cargo-container': this.model.delivery_voucher_no || '___'
      }
      return summary
    },
    total_weight () {
      return this.model.sale_items.reduce((weight, next) => {
        return weight + (parseFloat(next.weight).toFixed(3) * parseFloat(next.qty).toFixed(3))
      }, 0)
    },
    paymentToggler () {
      return this.model.status === 'completed'
    }
  },
  watch: {
    'marathonDeli.receiver_zone_id': {
      async handler (newVal) {
        if (newVal) {
          try {
            const deliFeePayload = {
              from_city_id: this.merchant[0].city.id,
              to_city_id: this.marathonDeli.receiver_city_id,
              to_zone_id: this.marathonDeli.receiver_zone_id,
              global_scale_id: 1,
              weight: Math.abs(this.total_weight)
            }
            const { amount, message, status } = await this.$request.postData(this.$url.CALCULATE_AMOUNT_URL, deliFeePayload, this.merchantJWT)
            if (status === 1) {
              this.marathonDeli.delivery_amount = amount.door_to_door_rate
            } else {
              this.handleStatus({ status, message, that: this })
            }
          } catch (error) {
            this.handleException({ error, that: this })
          }
        }
      },
      deep: true
    },
    'marathonDeli.receiver_city_id': {
      handler (newVal) {
        if (newVal && this.merchantZones.length) {
          this.merchant_zones = this.merchantZones.filter(zone => zone.city.id === newVal)
          this.marathonDeli.receiver_zone_id = this.merchant_zones[0].id
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$parent.$parent.$on('deletedData', (item) => {
      const index = this.model.sale_items.indexOf(item)
      this.model.sale_items.splice(index, 1)
    })
  },
  methods: {
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
      this.$refs.deli_form.resetValidation()
      this.$refs.deli_observer.reset()
      this.showHistory = false
      this.showMarathonDeli = false
      this.showPaymentHistory = false
    },
    emitPrint () {
      this.$emit('onPrint', this.model)
    },
    onCreatedPayment (data) {
      this.model = (({
        id, invoice_no,
        sale_items,
        grand_total,
        total_amount,
        total_discount,
        outstanding_amount,
        paid_amount,
        total_qty, note,
        customer_name,
        customer_city_name,
        customer_zone_name,
        customer_phone,
        delivery_address,
        customer_address,
        sale_payments
      }) => ({
        id,
        invoice_no,
        customer: { name: customer_name, city: { name: customer_city_name }, zone: { name: customer_zone_name }, phone: customer_phone, delivery_address, address: customer_address },
        sale_items,
        grand_total,
        total_amount,
        total_discount,
        outstanding_amount,
        paid_amount,
        total_qty,
        note,
        delivery_address,
        sale_payments
      }))(JSON.parse(JSON.stringify(data)))
    },
    async onAddDeli () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.deli_observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const voucher_payload = this.$model.CREATE_NEW_VOUCHER_PAYLOAD(this)
        const { message, status, data } = (await this.$request.postData(`${this.$url.VOUCHER_URL}`, voucher_payload, this.merchantJWT))
        if (status === 1) {
          this.model.delivery_amount = parseInt(this.marathonDeli.delivery_amount)
          successMessage = `Success: Sale "${this.model.invoice_no}"  was connected to Marathon!.`
          const update_deli_payload = {
            delivery_amount: this.model.delivery_amount,
            delivery_payment_type: 'NetTotal',
            delivery_voucher_no: data.voucher_no,
            thirdparty_invoice: this.model.invoice_no
          }
          this.model.delivery_voucher_no = data.voucher_no
          this.informDeliAdded(update_deli_payload)
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }

      this.isLoading = false
      this.disabledButton = false
    },
    async informDeliAdded (update_deli_payload = {}) {
      this.disabledButton = true
      this.isLoading = true
      let successMessage = ''
      try {
        const { message, status } = (await this.$request.postData(`${this.$url.SALE_URL}/${this.model.id}/add_delivery`, update_deli_payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Sale "${this.model.invoice_no}"  was connected to Marathon!.`
          // this.closeForm(data)
          this.showMarathonDeli = false
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }

      this.isLoading = false
      this.disabledButton = false
    },
    async onUpdateDeliFee () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.deli_fee_observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const payload = { delivery_amount: this.model.delivery_amount, note: this.model.note }
        const { message, status } = (await this.$request.postData(`${this.$url.SALE_URL}/${this.model.id}/update_deli_amount`, payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Delivery Fee was Updated to "${this.model.delivery_amount}"!.`
          // this.closeForm(data)
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }

      this.isLoading = false
      this.disabledButton = false
    },
    async saleReturn () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.deli_fee_observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const payload = { return_date: this.model.return_date, return_note: this.model.return_note }
        const { message, status } = (await this.$request.postData(`${this.$url.SALE_URL}/${this.model.id}/return`, payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Success "${this.model.invoice_no}" Returned!.`
          // this.closeForm(data)
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.dialog = false
      this.isLoading = false
      this.disabledButton = false
    },
    async editItem (item) {
      this.editedIndex = this.model.sale_items.indexOf(item)

      const { stock_count } = await this.$request.fetchData(
              `${this.$url.BOTTLE_RETURN_COUNT_URL}?customer_id=${this.model.customer.customer_id}&product_id=${item.product_id}`,
              this.jwt
      )

      this.selectedItem = Object.assign({ ...this.selectedItem }, (({ id, qty, price, unit_price }) => ({ id, stock: stock_count, qty: parseInt(qty), price: parseInt(price), unit_price: parseInt(unit_price) }))(item))

      this.editedProduct = Object.assign({}, (({ product_id, product_name, product_item_code, qty, price, amount, discount_amount }) => ({ product_id, product_name, product_item_code, qty, price, amount, discount_amount }))(item))
    },
    async saveItem () {
      if (this.editedIndex > -1) {
        this.isLoading = true
        let successMessage = ''
        try {
          const update_payload = this.editedProduct
          const { message, status, data } = (await this.$request.putData(`${this.$url.SALE_ITEM_URL}/${this.selectedItem.id}`, update_payload, this.jwt))
          if (status === 1) {
            Object.assign(this.model.sale_items[this.editedIndex], data)
            successMessage = `Success: Item "${this.editedProduct.product_name}"  was Updated!.`
          }
          this.handleStatus({ status, message, that: this, successMessage })
          this.closeItem()
        } catch (error) {
          this.handleException({ error, that: this })
        }
        this.isLoading = false
      }
    },
    closeItem () {
      setTimeout(() => {
        this.selectedItem = {}
        this.editedProduct = {}
        this.editedIndex = -1
        this.removeAddedObj()
      }, 300)
    },
    removeAddedObj () {
      if (Object.keys(this.addObj).length > 0) {
        const addedIndex = this.model.sale_items.indexOf(this.addObj)
        this.model.sale_items.splice(addedIndex, 1)
        this.addObj = {}
      }
    },
    async makeVoid () {
      let successMessage = ''
      try {
        this.loadingData = true
        // const create_payload = { order_id: this.order.id }
        const { message, status } = await this.$request.postData(`${this.$url.SALE_URL}/${this.model.id}/void`, {}, this.jwt)
        if (status === 1) {
          this.hideSaleButton = true
          this.loadingData = false
          this.model.status = 'void'
          successMessage = 'Success:  Voided Successfully"!.'
        } else {
          this.loadingData = false
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },
    async getCustomer () {
      this.showMarathonDeli = !this.showMarathonDeli
      if (!this.showMarathonDeli) {
        return
      }
      if (this.marathonDeli.receiver_city_id !== '' || this.marathonDeli.receiver_zone_id !== '') {
        this.step = 2
        return
      }
      try {
        this.loadingData = true
        const { data, message, status } = await this.$request.fetchData(`${this.$url.MERCHANT_CUSTOMER_URL}?search=${this.model.customer.phone}`, this.merchantJWT)
        if (status === 1) {
          if (data.length) {
            this.marathonDeli.receiver_city_id = data[0].city.id
            this.marathonDeli.receiver_zone_id = data[0].zone.id
          }
          this.step = 2
        } else {
          this.handleStatus({ status, message, that: this })
        }
      } catch (error) {
        this.handleException({ error, that: this })
      }
      this.fetchingCustomer = false
    }
  }
}
</script>

<style>
.qtyField{
  width:max-content !important;
}
</style>
