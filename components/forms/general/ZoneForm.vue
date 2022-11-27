<template>
  <v-stepper-content class="pa-0" step="2">
    <v-card>
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />
      <validation-observer
        ref="observer"
      >
        <v-form ref="form" @submit.prevent="onSaveZone" @keyup.enter="onSaveZone">
          <v-card-title class="primary--text">
            {{ model.id?model.name:'New Product' }}
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              class="mx-1"
              @click="closeForm()"
            >
              Cancel
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
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <validation-provider
                  v-slot="{ errors }"
                  name="City"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.city_id"
                    label="City"
                    :items="cities"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.name"
                    :error-messages="errors"
                    label="Name"
                    required
                  />
                </validation-provider>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <validation-provider
                  v-slot="{ errors }"
                  name="MM Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.mm_name"
                    label="MM Name"
                    :error-messages="errors"
                    required
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
export default {
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
      disabledButton: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  },
  async beforeMount () {
    this.cities = await this.getFromLocalStorage('stored:cities')
  },
  methods: {
    async onSaveZone () {
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
          const create_payload = this.$model.CREATE_ZONE_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.postData(this.$url.ZONE_URL, create_payload, this.jwt))
          if (status === 1) {
            this.$parent.$emit('createdData', data)
            successMessage = `Success: New Zone "${data.name}" was Created!.`
            this.closeForm(data, 'created')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      } else {
        try {
          const update_payload = this.$model.CREATE_ZONE_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.putData(`${this.$url.ZONE_URL}/${this.model.id}`, update_payload, this.jwt))
          if (status === 1) {
            this.$parent.$emit('updatedData', data)
            successMessage = `Success: Zone "${this.model.name}"  was Updated!.`
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
      return this.closeFormDialog(this)
    }
  }
}
</script>
