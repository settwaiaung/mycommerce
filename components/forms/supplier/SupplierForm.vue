<template>
  <v-stepper-content class="content_wrapper_stepper" step="2">
    <v-card>
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />

      <validation-observer
        ref="observer"
      >
        <v-form ref="form" @submit.prevent="onSaveSupplier" @keyup.enter="onSaveSupplier">
          <v-card-title class="primary--text">
            {{ model.id?model.name:'New Supplier' }}
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              class="mx-1"
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
              {{ model.id?'Update':'Save' }}
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col md="3" cols="12">
                <supplierInfo v-show="model.id" :supplier="model" :billing="{}" />
              </v-col>
              <v-col v-show="editSupplierInfo" class="section_container" md="7" cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.name"
                    :error-messages="errors"
                    label="Name *"
                    required
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="email"
                >
                  <v-text-field
                    v-model="model.email"
                    label="Email *"
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Phone"
                  rules="required|phone"
                >
                  <v-text-field
                    v-model="model.phone"
                    label="Phone *"
                    :error-messages="errors"
                    required
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Another Phone"
                  rules="phone"
                >
                  <v-text-field
                    v-model="model.another_phone"
                    label="Another Phone *"
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- city_id -->
                <validation-provider
                  v-slot="{ errors }"
                  name="City"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.city_id"
                    label="City *"
                    :items="cities"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- zone_id -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Zone"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.zone_id"
                    label="Zone *"
                    :items="zones"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- address -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <v-textarea
                    v-model="model.address"
                    solo
                    label="Address"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </validation-observer>
    </v-card>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
import supplierInfo from '@/components/widgets/supplier/SupplierInfo.vue'
export default {
  components: {
    supplierInfo
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        requiredPassword: false
      })
    }
  },
  data: () => {
    return {
      cities: [],
      origin_zones: [],
      zones: [],
      disabledButton: false,
      isLoading: false,
      tabIndex: 0,
      loadingData: false,
      editSupplierInfo: true
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
    query () {
      let query = ''
      for (const property in this.filters) {
        if (this.filters[property]) { query += `&${property}=${this.filters[property]}` }
      }
      return query
    }
  },
  watch: {
    'model.city_id': {
      handler (newVal, oldVal) {
        if (!newVal || (newVal === oldVal)) { return }
        this.zones = this.origin_zones.filter(zone => zone.city.id === newVal)
      },
      deep: true
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
    this.origin_zones = await this.getFromLocalStorage('stored:zones')
  },
  methods: {
    setColor (condition) {
      if (condition) {
        return 'primary'
      } else {
        return ''
      }
    },
    async onSaveSupplier () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      if (!this.model.id) {
        try {
          const create_payload = this.$model.CREATE_SUPPLIER_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.postData(this.$url.SUPPLIER_URL, create_payload, this.jwt))
          if (status === 1) {
            // this.$parent.$emit('createdData', data)
            successMessage = `Success: New Supplier "${data.name}" was Created!.`
            this.closeForm(data, 'created')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      } else {
        try {
          const update_payload = this.$model.CREATE_SUPPLIER_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.putData(`${this.$url.SUPPLIER_URL}/${this.model.id}`, update_payload, this.jwt))
          if (status === 1) {
            // this.$parent.$emit('updatedData', data)
            successMessage = `Success: Supplier "${this.model.name}"  was Updated!.`
            this.closeForm(data, 'updated')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      }
      this.isLoading = false
      this.disabledButton = false
    },
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
      this.closeFormDialog(this)
    }
  }
}
</script>
