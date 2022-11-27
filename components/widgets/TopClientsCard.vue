<template>
  <v-card min-height="300">
    <v-card-title>Top Clients</v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item,index) in clients"
              :key="index"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.phone }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'TopClients',
  props: {
    clients: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>
