<template>
  <button
    v-show="!searching"
    class="group flex items-center"
    style="height: 36px"
  >
    <div class="flex">
      <i
        class="pl-3 pr-5 material-icons text-xl text-gray-700 group-hover:text-gray-900"
        >keyboard_arrow_down</i
      >
      <div class="text-sm text-gray-700 group-hover:text-gray-900">
        See travel times, traffic, and nearby places.
      </div>
    </div>
  </button>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({ searching: 'getSearching' }),
    },
  }
</script>
