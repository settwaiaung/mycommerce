<template>
  <v-tabs
    v-model="tabIndex"
    fixed-tabs
    background-color="transparent"
  >
    <v-tab>
      Orders
    </v-tab>
    <v-divider
      class="mx-4"
      vertical
    />

    <v-tab>
      Sales
    </v-tab>
    <v-tabs-items v-model="tabIndex">
      <v-tab-item class="section_container">
        <!-- <v-data-table

                        :loading="loadingData"
                        :headers="customerOrderHeader"
                        :items="orders"
                        hide-default-footer
                      /> -->
        <!-- <v-data-table
                        :headers="customerOrderHeader"
                        :items="orders"
                        :loading="loadingData"
                        class="elevation-1"
                        :options.sync="options"
                        :server-items-length="options.totalcustomerOrders"
                      /> -->
        <!-- <CustomerOrderList /> -->
        <!-- <v-pagination
                        v-model="options.page"
                        :length="options.pageCount"
                      /> -->
      </v-tab-item>
      <v-tab-item>
        <!-- <CustomerOrderList :customer="model" /> -->
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>
<script>
export default {
  data: () => ({
    tabIndex: 0
  })
}
</script>
