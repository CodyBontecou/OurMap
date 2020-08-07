<template>
  <div id="map"></div>
</template>

<script>
export default {
  data: () => {
    return {
      tileLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      minZoom: 2,
      zoom: 2,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      center: [39.8097343, -98.5556199],
    }
  },
  mounted() {
    let map = L.map('map').setView(this.center, this.zoom);
    L.tileLayer(this.tileLayerUrl, {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      attribution: this.attribution,
    }).addTo(map);
    map.setMaxBounds(  [[-90, Number.NEGATIVE_INFINITY],   [90,Number.POSITIVE_INFINITY]]  )
  }
};
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
