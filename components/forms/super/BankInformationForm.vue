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
        <v-form ref="form" @submit.prevent="onSaveUser" @keyup.enter="onSaveUser">
          <v-card-title class="primary--text">
            {{ model.id?model.name:'New Bank Information' }}
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
              <v-col cols="12" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Bank"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.bank_id"
                    label="Bank *"
                    :items="banks"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Account Number"
                  rules="required|onlydigit"
                >
                  <v-text-field
                    v-model="model.account_no"
                    :error-messages="errors"
                    label="Account Number *"
                    required
                    type="number"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Account Name"
                  rules="required|onlydigit"
                >
                  <v-text-field
                    v-model="model.account_name"
                    :error-messages="errors"
                    label="Account Name *"
                    required
                  />
                </validation-provider>
              </v-col>
              <v-divider
                vertical
              />
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="model.phone"
                  label="Phone"
                  :counter="11"
                />
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
      banks: [],
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
    this.banks = await this.getFromLocalStorage('stored:banks')
  },
  methods: {
    async onSaveUser () {
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
          const create_payload = this.$model.CREATE_USER_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.postData(this.$url.USER_URL, create_payload, this.jwt))
          if (status === 1) {
            this.$parent.$emit('createdData', data)
            successMessage = `Success: New User "${data.name}" was Created!.`
            this.closeForm(data, 'created')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      } else {
        try {
          const update_payload = this.$model.CREATE_USER_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.putData(`${this.$url.USER_URL}/${this.model.id}`, update_payload, this.jwt))
          if (status === 1) {
            this.$parent.$emit('updatedData', data)
            successMessage = `Success: User "${this.model.name}"  was Updated!.`
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
