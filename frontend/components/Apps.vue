<template>
  <div class="relative">
    <button class="group h-8 w-8 rounded-full overflow-hidden focus:outline-none " @click="isOpen = !isOpen">
      <i class="align-middle material-icons text-gray-700 group-hover:text-black">apps</i>
    </button>

    <button v-if="isOpen" @click="isOpen = false" class="fixed top-0 bottom-0 left-0 w-full h-full"></button>

    <div v-if="isOpen" class="absolute flex flex-wrap right-0 w-84 p-4 mt-2 bg-white rounded-lg shadow-xl">
      <a v-for="app in apps" href="#" class="flex flex-col items-center w-1/3 pt-2 pb-1 rounded hover:bg-blue-100">
        <img class="h-10 w-10 mb-2 text-center rounded-full focus:outline-none" :src="app.img" alt="Small profile Picture">
        <div class="capitalize tracking-wide text-gray-900">{{ app.name }}</div>
      </a>
    </div>

  </div>
</template>

<script>
export default {
  props: ["apps"],
  data: () => {
    return {
      isOpen: false
    };
  },
  created() {
    const handleEscape = (e) => {
      if (e.key === "Esc" || e.key == "Escape") {
        this.isOpen = false;
      }
    };

    document.addEventListener("keydown", handleEscape);

    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener("keydown", handleEscape);
    });
  }
};
</script>

<style scoped>

</style>
