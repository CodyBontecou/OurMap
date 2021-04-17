<template>
  <div class="absolute z-1000 flex flex-col" style="top: 0; left: 0">
    <div
      v-show="searching && results.length > 0"
      class="horizontal-divider bg-gray-200"
    ></div>

    <div v-if="focus" class="pt-2" style="height: 500px; max-height: 100%">
      <button class="p-4 rounded-full" @click="setFocus(false)">
        <span>x</span>
      </button>
      {{ focus.name }}
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        locations: 'getLocations',
        results: 'getResults',
        searching: 'getSearching',
        focus: 'getFocus',
      }),
    },
    methods: {
      ...mapActions({ setFocus: 'setFocus' }),
    },
  }
</script>

<style scoped>
  .horizontal-divider {
    height: 5px;
  }
</style>
