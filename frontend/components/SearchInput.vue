<template>
  <div
    class="flex items-center"
    :class="{ 'border-b': results.length > 0 }"
    style="height: 44px"
  >
    <form class="flex">
      <div class="flex items-center pl-3 pr-5 tooltip">
        <button>
          <i class="material-icons text-xl text-gray-700 hover:text-gray-900">
            menu
          </i>
        </button>
        <span class="tooltip-text bottom text-xs font-medium">
          {{ $t('menu') }}
        </span>
      </div>

      <div class="text-sm text-gray-800" @click="enableSearching">
        <label for="searchInput"></label>
        <input
          id="searchInput"
          v-model="search"
          class="focus:outline-none block w-full appearance-none placeholder-gray-700 font-medium capitalize"
          type="text"
          :placeholder="i18n.placeholder"
          autocomplete="off"
          style="width: 215px"
          @input="onChange"
        />
      </div>

      <div class="flex items-center px-3 tooltip">
        <button>
          <i
            class="material-icons text-xl text-gray-500"
            :class="{ 'text-blue-700': searching }"
          >
            search
          </i>
        </button>
        <span class="tooltip-text bottom text-xs font-medium">
          {{ $t('search') }}
        </span>
      </div>

      <div class="divider bg-gray-200"></div>

      <div class="flex items-center px-3 tooltip">
        <button>
          <i class="material-icons text-xl text-blue-500 hover:text-blue-600">
            directions
          </i>
        </button>
        <span class="tooltip-text bottom text-xs font-medium">
          {{ $t('directions') }}
        </span>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    props: {
      items: {
        type: Array,
        required: false,
        default: () => [],
      },
    },
    data() {
      return {
        search: '',
      }
    },
    computed: {
      ...mapGetters({
        focus: 'getFocus',
        results: 'getResults',
        searching: 'getSearching',
      }),
      i18n() {
        return this.$t('searchInput')
      },
    },
    watch: {
      focus() {
        this.search = this.focus.name
      },
    },
    methods: {
      ...mapActions({ setSearching: 'setSearching' }),
      onChange() {
        this.enableSearching()
        this.filterResults()
      },
      filterResults() {
        const results = this.items.filter((item) =>
          item.name.toLowerCase().includes(this.search.toLowerCase())
        )
        this.$store.commit('setResults', results)
      },
      enableSearching() {
        if (!this.searching && this.search.length > 0) {
          this.setSearching(true)
        } else if (this.search.length === 0) {
          this.setSearching(false)
        }
      },
    },
  }
</script>

<style>
  .divider {
    width: 1px;
  }
</style>
