<template>
  <div
    id="searchBarContainer"
    class="absolute z-1000 ml-2 mt-2 flex flex-col rounded-lg bg-white top-0 left-0"
    style="max-width: 356px"
  >
    <SearchInput :items="locations" />
    <SearchResults v-show="searching" :results="results" />
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
    mounted() {
      document.addEventListener('click', this.handleClickOutside)
    },
    destroyed() {
      document.removeEventListener('click', this.handleClickOutside)
    },
    method: {
      ...mapActions({ setSearching: 'setSearching' }),
      handleClickOutside(evt) {
        if (!this.$el.contains(evt.target)) {
          this.setSearching(false)
        }
      },
    },
  }
</script>
