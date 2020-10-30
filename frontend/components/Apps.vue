<template>
  <div class="relative">
    <button
      class="group h-8 w-8 rounded-full overflow-hidden focus:outline-none tooltip"
      @click="isOpen = !isOpen"
    >
      <i
        class="align-middle material-icons text-gray-700 group-hover:text-black"
        >apps</i
      >
      <span class="tooltip-text mt-8 -ml-8 capitalize">
        {{ apps.name }}
      </span>
    </button>

    <button
      v-if="isOpen"
      class="fixed top-0 bottom-0 left-0 w-full h-full"
      @click="isOpen = false"
    ></button>

    <div
      v-if="isOpen"
      class="absolute flex flex-wrap right-0 w-84 p-4 mt-2 bg-white rounded-lg shadow-xl"
    >
      <nuxt-link
        v-for="app in apps.apps"
        :key="app.id"
        :to="localePath(app.to)"
        class="flex flex-col items-center w-1/3 pt-2 pb-1 rounded hover:bg-blue-100"
      >
        <img
          class="h-10 w-10 mb-2 text-center rounded-full focus:outline-none"
          :src="app.img.src"
          :alt="app.img.alt"
        />
        <div class="capitalize tracking-wide text-gray-900">{{ app.name }}</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      apps: {
        type: Object,
        required: true,
        default: () => {},
      },
    },
    data: () => {
      return {
        isOpen: false,
      }
    },
    created() {
      const handleEscape = (e) => {
        if (e.key === 'Esc' || e.key === 'Escape') {
          this.isOpen = false
        }
      }

      // eslint-disable-next-line nuxt/no-globals-in-created
      document.addEventListener('keydown', handleEscape)

      this.$once('hook:beforeDestroy', () => {
        // eslint-disable-next-line nuxt/no-globals-in-created
        document.removeEventListener('keydown', handleEscape)
      })
    },
  }
</script>

<style scoped></style>
