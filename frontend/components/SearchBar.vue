<template>
  <div class="ml-2 mt-2 flex flex-col rounded-lg bg-white" style="width: 355px; height: 82px;">

    <div class="flex items-center shadow-md" style="height: 44px;">
      <form class="flex">

        <div class="flex items-center pl-3 pr-5 tooltip">
          <button>
            <i class="material-icons text-xl text-gray-700 hover:text-gray-900">menu</i>
          </button>
          <span class='tooltip-text'>Menu</span>
        </div>

        <div class="text-sm text-gray-800">
          <label for="searchInput"></label>
          <input
            class="focus:outline-none rounded-lg block w-full appearance-none placeholder-gray-700"
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

    <button class="group flex items-center" style="height: 36px;">
      <i class="pl-3 pr-5 material-icons text-xl text-gray-700 group-hover:text-gray-900">keyboard_arrow_down</i>
      <div class="text-sm text-gray-700 group-hover:text-gray-900">
        See travel times, traffic, and nearby places.
      </div>
    </button>
  </div>
</template>

<style>
.divider {
  width: 1px;
}
</style>
