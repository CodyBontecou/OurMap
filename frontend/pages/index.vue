<template>
  <div id="main">
    <SocialHead :title="title" :description="description" :image="image" />
    <Map />
    <SearchBar />
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data: () => {
      return {
        title: 'Hotspringers | Mapped Interests | Open Sourced | Crowd Sourced',
        description:
          'Mapping hotsprings around the globe, emphasizing community through comments and crowd sourced content',
        image:
          'https://lh3.googleusercontent.com/pw/ACtC-3e9OooYBDpyGofXUjhiMwwHf9Ym-UR1QewKFK7YZp9fiyHdLhZO5hfzvOxq2A2WjFhVbter5t5ztgN4JC5ZcynUScfDH8v8m2RUdCYDAZwElyc3V0AXW1xZcIjUL0VF-C_Pp0nUuLpRpnRzWeFfD0c=w2880-h1594-no?authuser=0',
      }
    },
  }
</script>

<style scoped>
  #main {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
