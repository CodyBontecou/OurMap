<template>
  <div class="pl-3">
    <button
      class="block -z-1 h-8 w-8 rounded-full overflow-hidden focus:outline-none"
      @click="isOpen = !isOpen"
    >
      <img :src="user.smallImg" alt="Small profile Picture" />
    </button>

    <button
      v-if="isOpen"
      class="fixed top-0 bottom-0 left-0 w-full h-full"
      @click="isOpen = false"
    ></button>

    <div
      v-if="isOpen"
      class="absolute right-0 w-64 py-2 mt-2 bg-white rounded-lg shadow-xl"
    >
      <div class="relative">
        <img
          class="w-20 mx-auto rounded-full shadow mt-2 mb-4"
          :src="user.img"
          alt="Medium profile picture"
        />
        <button
          class="absolute my-auto rounded-full h-6 w-6 bg-white shadow group"
          style="top: 72%; left: 55%"
        >
          <i
            class="align-middle material-icons-outlined text-gray-700 group-hover:text-blue-700"
            style="font-size: 1rem"
            >photo_camera</i
          >
        </button>
      </div>

      <div class="text-center">
        <span
          class="block capitalize font-medium tracking-wider text-gray-900"
          >{{ user.name }}</span
        >
        <span class="block pb-6 font-medium tracking-wide text-gray-600">{{
          user.email
        }}</span>
        <div class="divide-y divide-gray-200">
          <div class="py-2">
            <button
              class="px-2 py-1 mb-4 mx-auto rounded-full border border-gray-200 hover:bg-gray-100"
            >
              <a class="font-medium" href="#"
                >Manage your Hotspringers Account</a
              >
            </button>
          </div>
          <div class="">
            <button
              class="px-8 py-2 my-4 mx-auto rounded border border-gray-200 hover:bg-gray-100"
            >
              <a class="font-medium" href="#">Sign out</a>
            </button>
          </div>
          <div class="py-2 text-xs font-medium text-gray-600">
            <button class="p-1 rounded hover:bg-gray-100">
              <a href="#">Privacy Policy</a>
            </button>
            •
            <button class="p-1 rounded hover:bg-gray-100">
              <a href="#">Terms of Service</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['user'],
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

      document.addEventListener('keydown', handleEscape)

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('keydown', handleEscape)
      })
    },
  }
</script>

<style scoped>
  .leaflet-container a {
    color: #2d3748;
  }

  .leaflet-container button a {
    @apply text-gray-900;
  }
</style>
