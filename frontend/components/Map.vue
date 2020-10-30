<template>
  <div>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        @update:center="centerUpdated"
        @update:zoom="zoomUpdated"
      >
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          layer-type="base"
        />
        <v-leaflet-minimap
          ref="minimap"
          :layer="minimapLayer"
          :options="minimapOptions"
          @ready="initToggleLayer()"
        />

        <v-marker-cluster>
          <l-marker
            v-for="location in locations"
            :key="location.id"
            :lat-lng="[location.latitude, location.longitude]"
            @click="setFocus(location)"
          >
            <l-popup>
              {{ location.name }}
            </l-popup>
          </l-marker>
        </v-marker-cluster>

        <l-control position="topright">
          <Navigation />
        </l-control>

        <l-control position="bottomright">
          <button
            class="btn border-b border-gray-300 rounded-t tooltip"
            @click="userLocation"
          >
            <i class="material-icons text-sm align-middle">gps_fixed</i>
            <span class="tooltip-text left capitalize">
              {{ i18n.location }}
            </span>
          </button>
          <button
            class="btn tooltip"
            :class="{ 'cursor-not-allowed': zoom === 18 }"
            @click="zoomIn"
          >
            <i class="material-icons text-sm align-middle">add</i>
            <span class="text-xs tooltip-text left capitalize">
              {{ i18n.zoomIn }}
            </span>
          </button>
          <button
            class="btn border-t border-gray-300 rounded-b tooltip"
            @click="zoomOut"
          >
            <i class="material-icons text-sm align-middle">remove</i>
            <span class="tooltip-text left capitalize">
              {{ i18n.zoomOut }}
            </span>
          </button>
        </l-control>
      </l-map>
    </client-only>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        tileProviders: [
          {
            name: 'OpenStreetMap',
            visible: true,
            attribution:
              '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          },
          // TODO: Super long attribution wraps in an odd way on mobile.
          {
            name: 'Satellite View',
            visible: false,
            url:
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
            attribution:
              'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          },
        ],
        mapOptions: {
          zoomSnap: 0.5,
          zoomControl: false,
        },
        userLocationMarker: null,
        minimapLayer: null,
        satelliteLayer: null,
        openStreetMapLayer: null,
        minimapOptions: {
          position: 'bottomleft',
          width: 75,
          height: 75,
          zoomLevelFixed: true,
        },
      }
    },
    computed: {
      ...mapGetters({
        locations: 'getLocations',
        zoom: 'getZoom',
        center: 'getCenter',
      }),
      i18n() {
        return this.$t('map')
      },
    },
    mounted() {
      this.openStreetMapLayer = new this.$L.TileLayer(this.tileProviders[0].url)
      this.satelliteLayer = new this.$L.TileLayer(this.tileProviders[1].url)
      this.minimapLayer = this.satelliteLayer
    },
    destroyed() {
      const minimap = this.$refs.minimap
      minimap[0].removeEventListener('click', this.toggleLayer)
    },
    methods: {
      centerUpdated(center) {
        this.$store.commit('setCenter', center)
      },
      // TODO: Zoom levels should impact css classes on zoom buttons when max/min zoom level
      zoomIn() {
        this.$store.commit('zoomIn')
      },
      zoomOut() {
        this.$store.commit('zoomOut')
      },
      zoomUpdated(zoom) {
        this.$store.commit('setZoom', zoom)
      },
      setFocus(obj) {
        const that = this
        this.$store.commit('setFocus', obj)
        this.$root.$on('focus', (filter) => {
          that.setView(filter)
        })
      },
      setView(obj) {
        const map = this.$refs.map.mapObject
        map.setView(new this.$L.LatLng(obj.latitude, obj.longitude), 18)
      },
      userLocation() {
        const that = this
        const map = this.$refs.map.mapObject
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            function success(position) {
              if (that.userLocationMarker !== null) {
                that.userLocationMarker.remove()
              }

              const lat = position.coords.latitude
              const lng = position.coords.longitude

              that.userLocationMarker = that.$L.marker([lat, lng]).addTo(map)
              map.setView(new that.$L.LatLng(lat, lng), 16)
            },
            function error(error) {
              // for when getting location results in an error
              console.error(
                'An error has occurred while retrieving location',
                error
              )
            }
          )
        }
      },
      toggleLayer() {
        const that = this
        const minimap = this.$refs.minimap
        if (this.minimapLayer === this.satelliteLayer) {
          this.minimapLayer = this.openStreetMapLayer
          minimap.changeLayer(that.openStreetMapLayer)
          this.tileProviders[0].visible = false
          this.tileProviders[1].visible = true
        } else if (this.minimapLayer === this.openStreetMapLayer) {
          this.minimapLayer = this.satelliteLayer
          minimap.changeLayer(that.satelliteLayer)
          this.tileProviders[0].visible = true
          this.tileProviders[1].visible = false
        }
      },
      initToggleLayer() {
        const minimapGetter = document.getElementsByClassName(
          'leaflet-control-minimap'
        )
        if (minimapGetter.length > 0) {
          minimapGetter[0].addEventListener('click', this.toggleLayer)
        }
      },
    },
  }
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
