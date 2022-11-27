<template>
  <div class="text-center">
    <v-progress-circular
      v-show="loadingData"
      :indeterminate="loadingData"
      color="primary"
      :size="100"
      :width="5"
    />
  </div>
</template>
<script>

export default {
  props: {
    loadingData: {
      type: Boolean,
      default: false
    }
  }
}
</script>
