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
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          layer-type="base"/>
        <v-leaflet-minimap
          ref="minimap"
          :layer="minimapLayer"
          :options="minimapOptions"
          @ready="initToggleLayer()"
        />

        <v-marker-cluster>
          <l-marker :lat-lng="[location.latitude, location.longitude]" v-for="location in locations" :key="location.id">
            <l-popup>
              {{ location.name }}
            </l-popup>
          </l-marker>
        </v-marker-cluster>

        <l-control position="topleft">
          <SearchBar />
        </l-control>

        <l-control position="topright">
          <Navigation />
        </l-control>

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
      tileProviders: [
        {
          name: "OpenStreetMap",
          visible: true,
          attribution:
            "&copy; <a target=\"_blank\" href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        // TODO: Super long attribution wraps in an odd way on mobile.
        {
          name: "Satellite View",
          visible: false,
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png",
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        }
      ],
      currentZoom: 11.5,
      currentCenter: [47.41322, -1.219482],
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false
      },
      userLocationMarker: null,
      minimapLayer: null,
      satelliteLayer: null,
      openStreetMapLayer: null,
      minimapOptions: {
        position: "bottomleft",
        width: 75,
        height: 75,
        zoomLevelFixed: true
      },
    };
  },
  computed: {
    ...mapGetters({ locations: "getLocations", zoom: "getZoom", center: "getCenter" })
  },
  methods: {
    // TODO: Zoom levels should impact css classes on zoom buttons when max/min zoom level
    zoomUpdate(zoom) {
      this.$store.commit("setZoom", zoom);
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
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
    },
    initToggleLayer() {
      const that = this;
      const minimap = this.$refs.minimap

      function toggleLayer () {
        if (that.minimapLayer === that.satelliteLayer) {
          that.minimapLayer = that.openStreetMapLayer
          minimap.changeLayer(that.openStreetMapLayer)
          that.tileProviders[0].visible = false
          that.tileProviders[1].visible = true
        }
        else if (that.minimapLayer === that.openStreetMapLayer) {
          that.minimapLayer = that.satelliteLayer
          minimap.changeLayer(that.satelliteLayer)
          that.tileProviders[0].visible = true
          that.tileProviders[1].visible = false
        }
      }

      const minimapGetter = document.getElementsByClassName('leaflet-control-minimap')
      if (minimapGetter.length > 0) {
        minimapGetter[0].addEventListener("click", toggleLayer);
      }

    },
  },
  mounted() {
    this.openStreetMapLayer = new this.$L.TileLayer(this.tileProviders[0].url);
    this.satelliteLayer = new this.$L.TileLayer(this.tileProviders[1].url);
    this.minimapLayer = this.satelliteLayer
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
