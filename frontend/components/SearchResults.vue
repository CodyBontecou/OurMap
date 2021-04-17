<template>
  <div class="flex flex-col z-1000" :class="{ 'py-2': results.length > 0 }">
    <ul class="w-full autocomplete-results" style="overflow: auto">
      <li
        v-for="(result, i) in results"
        :key="i"
        class="p-2 mx-2 flex rounded-sm autocomplete-result hover:bg-gray-200 cursor-pointer"
        @click="resultClicked(result)"
      >
        <i class="pl-3 pr-5 material-icons text-xl text-gray-500">room</i>
        <div class="text-sm text-gray-700">
          {{ result.name }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    props: {
      results: {
        type: Array,
        required: true,
        default: () => [],
      },
    },
    computed: {
      ...mapGetters({ searching: 'getSearching', focus: 'getFocus' }),
    },
    methods: {
      ...mapActions({ setFocus: 'setFocus', setSearching: 'setSearching' }),
      emitFocus(obj) {
        this.$root.$emit('focus', obj)
      },
      resultClicked(result) {
        this.stopSearching()
        this.setFocus(result)
      },
      stopSearching() {
        this.setSearching(false)
      },
    },
  }
</script>
