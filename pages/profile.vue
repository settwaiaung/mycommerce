<template>
  <v-container grid-list-xl fluid>
    <v-row>
      <v-col
        cols="6"
        offset="2"
      >
        <v-card>
          <validation-observer
            ref="observer"
          >
            <v-form ref="form" @submit.prevent="onSaveProfile" @keyup.enter="onSaveProfile">
              <v-card-text>
                <v-row>
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
                      name="User Name"
                      rules="required"
                    >
                      <v-text-field
                        v-model="model.username"
                        :error-messages="errors"
                        label="User Name"
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
                      name="Phone"
                      rules="required|phone"
                    >
                      <v-text-field
                        v-model="model.phone"
                        label="Phone"
                        :error-messages="errors"
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
                      name="Email"
                      rules="email"
                    >
                      <v-text-field
                        v-model="model.email"
                        label="Email"
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
                      name="Address"
                    >
                      <v-text-field
                        v-model="model.address"
                        label="Address"
                        :error-messages="errors"
                      />
                    </validation-provider>
                  </v-col>
                  <!-- <v-col
                    cols="12"
                    md="6"
                  >
                    <v-btn
                      color="primary"
                      class="ml-0"
                      @click="change_password = !change_password"
                    >
                      {{ change_password ? 'Cancel' : 'Change Password' }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row> -->
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Old Password"
                      :rules="{
                        required:change_password
                      }"
                    >
                      <v-text-field
                        v-show="change_password"
                        v-model="model.old_password"
                        :append-icon="
                          isOldPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isOldPasswordHidden ? 'password' : 'text'"
                        label="Old Password"
                        name="old_password"
                        required:change_password
                        :error-messages="errors"
                        @click:append="() => (isOldPasswordHidden = !isOldPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="New Password"
                      :rules="{
                        required:change_password
                      }"
                    >
                      <v-text-field
                        v-show="change_password"
                        v-model="model.new_password"
                        :append-icon="
                          isNewPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isNewPasswordHidden ? 'password' : 'text'"
                        label="New Password"
                        name="new_password"
                        required:change_password
                        :error-messages="errors"
                        @click:append="() => (isNewPasswordHidden = !isNewPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="new_password_confirmation"
                      :rules="{
                        required:change_password
                      }"
                    >
                      <v-text-field
                        v-show="change_password"
                        v-model="model.new_password_confirmation"
                        :append-icon="
                          isConfirmPasswordHidden ? 'visibility' : 'visibility_off'
                        "
                        :type="isConfirmPasswordHidden ? 'password' : 'text'"
                        label="new_password_confirmation"
                        name="new_password_confirmation"
                        :error-messages="errors"
                        required:change_password
                        @click:append="() => (isConfirmPasswordHidden = !isConfirmPasswordHidden)"
                      />
                    </validation-provider>
                  </v-col>
                  <!-- </v-row> -->
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                  color="primary"
                  type="submit"
                  text
                  @click="closeForm"
                >
                  Cancel
                </v-btn>
                <v-btn
                  :disabled="disabledButton"
                  color="primary"
                  type="submit"
                  text
                  :loading="isLoading"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'dashboard',
  middleware: ['isAuth'],
  data: () => ({
    model: {
      id: '',
      name: '',
      username: '',
      phone: '',
      email: '',
      address: '',
      department_id: '',
      old_password: '',
      new_password: '',
      new_password_confirmation: ''
    },
    isOldPasswordHidden: false,
    isNewPasswordHidden: false,
    isConfirmPasswordHidden: false,
    change_password: true,
    old_password: '',
    new_password: '',
    new_password_confirmation: ''
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt',
      user: 'auth/user'
    })
  },
  mounted () {
    this.model.id = this.user.id
    this.model.name = this.user.name
    this.model.username = this.user.username
    this.model.phone = this.user.phone
    this.model.email = this.user.email
    this.model.address = this.user.address
    this.model.department_id = this.user.department_id
    const breadCrumbs = [
      {
        text: 'Profile',
        disabled: true
      }
    ]
    this.$store.dispatch('setBreadCrumbItems', breadCrumbs)
    this.$store.dispatch('setTitle', 'Profile')
    this.$store.dispatch('setNavShow', true)
  },
  methods: {
    async onSaveProfile () {
      this.disabledButton = true
      this.isLoading = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        this.isLoading = false
        return false
      }
      let successMessage = ''
      try {
        const update_payload = this.$model.UPDATE_PROFILE_PAYLOAD(this.model)
        const { message, status } = (await this.$request.postData(`${this.$url.PROFILE_URL}`, update_payload, this.jwt))
        if (status === 1) {
          successMessage = `Success: Profile "${this.model.name}"  was Updated!.`
          this.closeFormDialog(this)
        }
        this.handleStatus({ status, message, that: this, successMessage })
      } catch (error) {
        this.handleException({ error, that: this })
      }
    },
    async closeForm () {
      await setTimeout(() => {
        this.$router.push('/dashboard')
      }, 100)
    }
  }
}
</script>
