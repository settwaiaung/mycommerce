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
            {{ dialogTitle }}
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
              Save
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col class="section_container" md="4" cols="12">
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
                  name="User Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.username"
                    label="User Name *"
                    :error-messages="errors"
                    required
                  />
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="model.email"
                    label="Email *"
                    :error-messages="errors"
                    required
                    email
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Department"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.department_id"
                    label="Department *"
                    :items="departments"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Roles"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.roles"
                    label="Roles *"
                    :items="roles"
                    item-text="name"
                    item-value="id"
                    required
                    multiple
                    :error-messages="errors"
                  />
                </validation-provider>
                <v-row>
                  <v-col md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Password"
                      :rules="{required:model.requiredPassword}"
                      vid="password"
                    >
                      <v-text-field
                        v-model="model.password"
                        :append-icon="
                          isPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isPasswordHidden ? 'password' : 'text'"
                        label="Password *"
                        name="password"
                        required
                        :error-messages="errors"
                        @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Confirmed Password"
                      :rules="{required:model.requiredPassword,confirmed:'password'}"
                    >
                      <v-text-field
                        v-model="model.confirmed_password"
                        :append-icon="
                          isConfirmPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isConfirmPasswordHidden ? 'password' : 'text'"
                        label="Confirmed Password *"
                        name="confirmed_password"
                        :error-messages="errors"
                        required
                        confirmed
                        @click:append="() => (isConfirmPasswordHidden = !isConfirmPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider
                vertical
              />
              <v-col class="section_container" md="5" cols="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Phone"
                  rules="phone"
                >
                  <v-text-field
                    v-model="model.phone"
                    label="Phone"
                    :counter="11"
                    :error-messages="errors"
                  />
                </validation-provider>
                <v-textarea
                  v-model="model.address"
                  solo
                  label="Address"
                />
                <v-checkbox
                  v-model="model.is_approved"
                  label="Approved?"
                  value="1"
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
      isPasswordHidden: true,
      isConfirmPasswordHidden: true,
      requiredPassword: true,
      departments: [],
      roles: [],
      dialogTitle: '',
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
    this.departments = await this.getFromLocalStorage('stored:departments')
    this.roles = await this.getFromLocalStorage('stored:roles')
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
    },
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
      return this.closeFormDialog(this)
    }
  }
}
</script>
