<template>
  <div>
    <div class="invoice_header">
      <img class="tw-object-scale-down tw-h-48 tw-w-96" src="/google.svg">
      <h2 class="tw-text-indigo-50 tw-text-2xl">
        Invoice
      </h2>
    </div>
    <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-h-1/2">
      <div class="tw-p-4 tw-bg-indigo-200 tw-col-start-1 tw-col-end-3">
        <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
          Invoice For
        </p>
        <p>John Doe</p>
        <p>No. 1006, Kyeik Latt Lane,Yazathingaha Housing(1)</p>
        <p>Yangon</p>
      </div>
      <div class="tw-p-4 tw-bg-indigo-400 tw-col-end-7 tw-col-span-2">
        <p class="tw-text-white tw-text-xl tw-font-bold tw-leading-none">
          Invoice For
        </p>
        <p>John Doe</p>
        <p>No. 1006, Kyeik Latt Lane,Yazathingaha Housing(1)</p>
        <p>Yangon</p>
      </div>
    </div>
    <v-divider />
    <table class="tw-min-w-full tw-leading-norma">
      <thead>
        <tr>
          <th
            class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 tw-bg-gray-100 tw-text-left tw-text-xs tw-font-semibold tw-text-gray-700 tw-uppercase tw-tracking-wider"
          >
            Client / Invoice
          </th>
          <th
            class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 tw-bg-gray-100 tw-text-left tw-text-xs tw-font-semibold tw-text-gray-700 tw-uppercase tw-tracking-wider"
          >
            Amount
          </th>
          <th
            class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 tw-bg-gray-100 tw-text-left tw-text-xs tw-font-semibold tw-text-gray-700 tw-uppercase tw-tracking-wider"
          >
            Issued / Due
          </th>
          <th
            class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 tw-bg-gray-100 tw-text-left tw-text-xs tw-font-semibold tw-text-gray-700 tw-uppercase tw-tracking-wider"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 bg-white text-sm text-gray-900 whitespace-no-wrap">
            Molly Sanders
          </td>
          <td class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 bg-white text-sm text-gray-900 whitespace-no-wrap">
            $20,000
          </td>
          <td class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 bg-white text-sm text-gray-900 whitespace-no-wrap">
            Sept 28, 2019
          </td>
          <td class="tw-px-5 tw-py-3 tw-border-b-2 tw-border-yellow-400 bg-white text-sm">
            <span
              class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
            >
              <span
                aria-hidden
                class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              />
              <span class="relative">Paid</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      onclick="window.print()"
      class="
      tw-text-indigo-400 py-2 px-4
      tw-rounded tw-shadow hover:tw-shadow-xl
      hover:tw-bg-indigo-200
      tw-duration-300"
    >
      Print This Page
    </button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'dashboard',
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    })
  },
  methods: {
    print () {
      setTimeout(() => window.print(), 1000)
    }

  }
}
</script>
