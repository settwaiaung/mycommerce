<template>
  <v-stepper-content class="content_wrapper_stepper" step="2">
    <validation-observer
      ref="observer"
    >
      <v-form ref="form" @submit.prevent="onReturnBottle" @keyup.enter="onReturnBottle">
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
              Return
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col md="4" cols="12" class="section_container">
                <v-data-table
                  :headers="bottleHistoriesHeader"
                  :items="model.bottle_return_histories"
                  :loading-text="trans('tableDataLoading')"
                  class="elevation-1"
                >
                  <template #top>
                    <v-toolbar
                      flat
                      color="primary"
                    >
                      Return History
                    </v-toolbar>
                  </template>
                </v-data-table>
              </v-col>
              <v-col md="6" cols="12" class="section_container">
                <CustomerInfo :customer="model.customer">
                  <div v-for="(item,key) in summary" :key="key" class="customer_info_data">
                    <strong class="tw-leading-9">{{ key }}</strong>
                    <strong class="tw-leading-9 text-right">{{ item }}</strong>
                  </div>
                </CustomerInfo>
                <v-data-table
                  :headers="bottleItemsHeader"
                  :items="model.bottle_return_items"
                  :loading-text="trans('tableDataLoading')"
                  class="elevation-1"
                />
              </v-col>
              <v-col md="2" cols="12" class="section_container">
                <v-card>
                  <v-card-title class="align-end tw-bg-indigo-200 pa-3">
                    Return The Bottle
                  </v-card-title>
                  <v-card-text>
                    <div v-for="(item,key) in bottle_info" :key="key" class="customer_info_data">
                      <strong class="tw-leading-9">{{ key }}</strong>
                      <strong class="tw-leading-9 text-right">{{ item }}</strong>
                    </div>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Bottle"
                      :rules="{required:true,oneNineDigit:true,
                               between:{min,max}}"
                    >
                      <div class="d-flex flex-row justify-space-around">
                        <!-- <div class="error--text">
                          {{ errors[0] }}
                        </div> -->
                        <v-spacer />
                        <v-text-field
                          v-model="model.returnning_bottle"
                          label="Bottle *"
                          required
                          :error-messages="errors"
                          outlined
                          dense
                          type="number"
                          class="qtyField"
                          :disabled="disabledButton||model.remain_bottle < 1"
                          @keypress="isNumber($event)"
                        />
                      </div>
                    </validation-provider>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </validation-observer>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
import CustomerInfo from '@/components/widgets/customer/CustomerInfo.vue'
export default {
  components: {
    CustomerInfo
  },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data: () => {
    return {
      showHistory: false,
      dialogTitle: '',
      disabledButton: false,
      isLoading: false,
      search_return_history: ''
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      locale: 'locale/getLocale'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    },
    summary () {
      const info = {
        'Product Name': this.model.product?.name
      }
      return info
    },
    bottle_info () {
      const info = {
        'Total Bottle': this.model.total_bottle,
        'Remain Bottle': this.model.remain_bottle
      }
      return info
    },
    min () {
      return 1
    },
    max () {
      return this.model.remain_bottle
    },
    bottleHistoriesHeader () {
      return this.$tableHeaders.bottleHistoriesHeader(this.locale)
    },
    bottleItemsHeader () {
      return this.$tableHeaders.bottleItemsHeader(this.locale)
    }
  },
  methods: {
    async onReturnBottle () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      try {
        const update_payload = { returned_bottle: this.model.returnning_bottle }
        const bottle_unit = this.model.returnning_bottle > 1 ? 'Bottles' : 'Bottle'
        const { message, status, data } = (await this.$request.putData(`${this.$url.BOTTLE_URL}/${this.model.id}`, update_payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: "${this.model.returnning_bottle} ${bottle_unit} "  was Returned!.`
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
      this.$emit('onGoBack', data, action)
      // this.resetForm(this)
    }
  }
}
</script>
