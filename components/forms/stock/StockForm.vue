<template>
  <v-stepper-content class="content_wrapper_stepper" step="2">
    <v-card>
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />
      <v-card-title>
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
      </v-card-title>
      <v-divider />
      <v-card>
        <v-row>
          <v-col md="4" cols="12">
            <v-card>
              <v-card-title class="pa-2 primary mb-2">
                <h3 class="text-h6 font-weight-light text-center grow">
                  {{ model ? model.product_name : '' }}
                </h3>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col md="6" cols="12">
                    <span class="font-weight-dark">
                      Product Name :
                    </span>
                  </v-col>
                  <v-col md="6" cols="12">
                    <h3 class="font-weight-light text-center grow">
                      {{ model ? model.product_name : '' }}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="6" cols="12">
                    <span class="font-weight-dark">
                      Product Price :
                    </span>
                  </v-col>
                  <v-col md="6" cols="12">
                    <h3 class="font-weight-light text-center grow">
                      {{ model ? model.product_price : '' }}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="6" cols="12">
                    <span class="font-weight-dark">
                      Product Code :
                    </span>
                  </v-col>
                  <v-col md="6" cols="12">
                    <h3 class="font-weight-light text-center grow">
                      {{ model ? model.product_item_code : '' }}
                    </h3>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="6" cols="12">
                    <span class="font-weight-dark">
                      QTY :
                    </span>
                  </v-col>
                  <v-col md="6" cols="12">
                    <h3 class="font-weight-light text-center grow">
                      {{ model ? model.qty : '' }}
                    </h3>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider />
              <div
                class="d-flex justify-center"
              >
                <v-btn
                  class="ma-2"
                  outlined
                  color="indigo"
                  @click="showStockHistory"
                >
                  Show History
                </v-btn>
              </div>
            </v-card>
            <v-divider
              vertical
            />
          </v-col>
          <v-col v-if="showHistory" md="8" cols="12">
            <v-data-table
              :headers="stockDetailHeader"
              :items="stock_histories"
              :loading-text="trans('tableDataLoading')"
              class="elevation-1 mt-2"
            />
          </v-col>
          <v-col v-else md="8" cols="12" />
        </v-row>
      </v-card>
    </v-card>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
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
      showHistory: false,
      stock_histories: []
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
    stockDetailHeader () {
      return this.$tableHeaders.stockDetailHeader(this.locale)
    }
  },
  methods: {
    async showStockHistory () {
      const { data, message, status } = await this.$request.fetchData(`${this.$url.STOCK_URL}/${this.model.id}/histories`, this.jwt)
      if (status === 1) {
        this.stock_histories = data
        this.showHistory = true
      } else {
        this.handleStatus({ status, message, that: this })
      }
    },
    closeForm (data = null, action = null) {
      this.showHistory = false
      this.$emit('onGoBack', data, action)
    }
  }
}
</script>
