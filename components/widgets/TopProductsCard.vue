<template>
  <v-card min-height="370">
    <v-card-title>Best Sellers</v-card-title>
    <v-card-text>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item,index) in products"
              :key="index"
            >
              <td>
                <v-avatar
                  size="36px"
                >
                  <img :src="item.image_path" :alt="item.name">
                </v-avatar>
                {{ item.name }}
              </td>
              <td>{{ curFm(item.price) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'TopProductsCard',
  props: {
    products: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>
