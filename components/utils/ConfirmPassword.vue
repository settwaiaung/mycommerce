<template>
  <v-dialog v-model="openDialog" persistent max-width="600">
    <v-card>
      <v-stepper v-model="step" class="px-0">
        <v-stepper-items>
          <v-stepper-content :step="passwordStep">
            <v-card-title
              class="headline primary"
              primary-title
            >
              Confirmation
            </v-card-title>
            <validation-observer
              ref="observer"
            >
              <v-form ref="form" @submit.prevent="confirmPassword" @keyup.enter="confirmPassword">
                <v-card-text>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                  >
                    <v-text-field
                      v-model="password"
                      :append-icon="isPasswordHidden ? 'visibility' : 'visibility_off'"
                      :type="isPasswordHidden ? 'password' : 'text'"
                      label="Password"
                      name="password"
                      required
                      :error-messages="errors"
                      @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                    />
                  </validation-provider>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" outlined @click="handleCancel">
                    <v-icon
                      dark
                    >
                      mdi-arrow-left-bold-box
                    </v-icon>
                    Back
                  </v-btn>
                  <v-btn color="primary" @click="confirmPassword">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-stepper-content>
          <slot />
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    passwordStep: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      openDialog: false,
      isPasswordHidden: true,
      password: ''
    }
  },
  computed: {
    step: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.$parent.$on('onConfirmPassword', () => {
      this.password = ''
      this.openDialog = true
    })
    this.$parent.$on('onCancelConfirm', () => {
      this.closeConfirmDialog()
    })
  },
  methods: {
    async confirmPassword () {
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) { return }
      this.openDialog = false
      this.$emit('confirmSuccess', this.password)
    },
    handleCancel () {
      if (this.step === 2) {
        this.step = 1
      } else {
        this.closeConfirmDialog()
      }
    },
    closeConfirmDialog () {
      this.openDialog = false
      this.password = ''
      this.step = 1
    }
  }
}
</script>
