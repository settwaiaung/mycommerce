<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpenFormDialog"
      max-width="400"
      persistent
    >
      <v-card>
        <!-- <v-progress-linear
          v-show="isLoading"
          :indeterminate="isLoading"
          color="primary"
        /> -->
        <v-toolbar
          color="primary"
          dark
        >
          {{ dialogTitle }}
        </v-toolbar>
        <v-card-title class="text-h6">
          Active <span class="error--text mx-1">{{ model.name }}</span>{{ screen }}?
        </v-card-title>

        <!-- <v-card-text>
          Are you sure to active this agent
        </v-card-text> -->

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="warning"
            text
            @click="closeForm"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            text
            :disabled="disabledButton"
            @click="onActiveItem()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    screen: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    model: {

    },
    isOpenFormDialog: false,
    dialogTitle: 'Active Confirmation',
    disabledButton: false,
    isLoading: false
  }),
  mounted () {
    this.$parent.$on('activeAgent', (item) => {
      this.model = item
      this.isOpenFormDialog = true
    })
  },
  methods: {
    async onActiveItem () {
      this.isLoading = true
      let successMessage = ''
      const update_payload = this.$model.UPDATE_ACTIVE_PAYLOAD(this.model)
      const { status, message } = await this.$request.postData(`${this.$api.AGENT_URL}/${this.model.id}/activate`, update_payload, this.$store.getters['auth/jwt'])
      if (status === 1) {
        successMessage = 'Success:Agent Activated !.'
        this.isOpenFormDialog = false
        this.$parent.$emit('updatedData', this.model)
      }
      this.handleStatus({ status, message, that: this, successMessage })
    },
    closeForm () {
      this.$parent.$emit('cancel', this.model)
      this.isOpenFormDialog = false
    }
  }
}
</script>
