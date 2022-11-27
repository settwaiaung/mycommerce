<template>
  <v-stepper-content step="2" class="content_wrapper_stepper">
    <v-progress-linear
      v-show="isLoading"
      :indeterminate="isLoading"
      color="primary"
    />
    <v-row>
      <v-col md="10">
        Here is Form
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat vitae dicta dignissimos in, exercitationem quis quos magni nostrum, iste inventore quas ab! Repellendus hic quas illo perferendis dolor. Ratione, enim!
      </v-col>
      <v-col
        md="2"
        class="tw-bg-yellow-200"
      >
        <v-btn
          outlined
          class="d-flex flex-column"
          color="primary"
          @click="closeForm()"
        >
          <v-icon
            dark
          >
            mdi-arrow-left-bold-box
          </v-icon>
          Back
        </v-btn>
        <v-btn color="secondary" outlined class="d-flex flex-column">
          Print Invoice
        </v-btn>asdf
      </v-col>
    </v-row>
  </v-stepper-content>
</template>
<script>
export default {
  methods: {
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
    }
  }
}
</script>
