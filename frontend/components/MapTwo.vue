<template>
  <div>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      >
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />
        <l-marker :lat-lng="[location.latitude, location.longitude]" v-for="location in locations" :key="location.id">
          <l-popup>
            <div @click="innerClick">
              {{ location.name }}
            </div>
          </l-popup>
        </l-marker>
        <l-control position="bottomright">
          <button
            class="btn border-b border-gray-300 rounded-t"
            @click="userLocation"
          >
            <i class="material-icons text-sm align-middle">gps_fixed</i>
          </button>
          <button
            class="btn"
            @click="zoomIn"
          >
            <i class="material-icons text-sm align-middle">add</i>
          </button>
          <button
            class="btn border-t border-gray-300 rounded-b"
            @click="zoomOut"
          >
            <i class="material-icons text-sm align-middle">remove</i>
          </button>
        </l-control>
      </l-map>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      center: [39.8097343, -98.5556199],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
      withPopup: [47.41322, -1.219482],
      currentZoom: 11.5,
      currentCenter: [47.41322, -1.219482],
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false
      },
      userLocationMarker: null
    };
  },
  computed: {
    ...mapGetters({ locations: "getLocations", zoom: "getZoom" })
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
      this.$store.commit("setZoom", this.currentZoom);
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    zoomIn() {
      this.$store.commit("zoomIn");
    },
    zoomOut() {
      this.$store.commit("zoomOut");
    },
    userLocation() {
      const that = this;
      const map = this.$refs.map.mapObject;
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function success(position) {
            if (that.userLocationMarker !== null) {
              that.userLocationMarker.remove();
            }

            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            that.userLocationMarker = that.$L.marker([lat, lng]).addTo(map);
            map.setView(new that.$L.LatLng(lat, lng), 16);
          },
          function error(error_message) {
            // for when getting location results in an error
            console.error(
              "An error has occurred while retrieving location",
              error_message
            );
          }
        );
      }
    }
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

.btn {
  @apply p-2 bg-gray-100 transition duration-300 ease-in-out block;
}

.btn:hover {
  @apply bg-gray-300;
}
</style>
