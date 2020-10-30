<template>
  <div class="absolute z-1000 flex flex-col bg-white" style="top: 0; left: 0;">
    <SearchInput class="m-2 border border-gray-200 rounded-lg" :items="locations"/>
    <SearchResults class="pb-2" :results="results" v-show="searching"/>

    <div class="horizontal-divider bg-gray-200"></div>

    <div v-if="focus" class="pt-2" style="height: 500px; max-height: 100%;">
      {{focus.name}}
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      locations: 'getLocations',
      results: 'getResults',
      searching: 'getSearching',
      focus: 'getFocus'
    })
  },
}
</script>

<style scoped>
.horizontal-divider {
  height: 10px;
}
</style>
