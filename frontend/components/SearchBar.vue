<template>
  <div class="flex items-center ml-2 mt-2 bg-white rounded-t-lg" style="width: 355px; height: 44px;">
    <form class="flex">
      <div class="flex items-center pl-3 pr-5 tooltip">

        <button>
          <i class="material-icons text-xl text-gray-700 hover:text-gray-900">menu</i>
        </button>
        <span class='tooltip-text'>Menu</span>
      </div>

      <div class="text-base">
        <label for="searchInput"></label>
        <input
          class="bg-white focus:outline-none rounded-lg block w-full appearance-none text-gray-700"
          id="searchInput" type="text" placeholder="Search Hotspringers" style="width: 215px;">
      </div>

      <div class="flex items-center px-3 tooltip">
        <button>
          <i class="material-icons text-xl text-gray-500">search</i>
        </button>
        <span class='tooltip-text'>Search</span>
      </div>

      <div class="divider bg-gray-200"></div>

      <div class="flex items-center px-3 tooltip">
        <button>
          <i class="material-icons text-xl text-blue-500 hover:text-blue-600">directions</i>
        </button>
        <span class='tooltip-text'>Directions</span>
      </div>

    </form>
  </div>
</template>

<style>
.divider {
  width: 1px;
}
</style>
