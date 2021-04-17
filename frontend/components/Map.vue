<template>
  <div>
    <client-only>
      <l-map
        id="map"
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
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
            :ref="`marker-${location.id}`"
            :key="location.id"
            :lat-lng="[location.latitude, location.longitude]"
          >
            <l-popup :options="popupOptions">
              <ul>
                <li>
                  <span class="font-medium">{{ location.name }}</span>
                </li>
                <li>
                  <span class="font-medium">{{ location.tempF }} °F</span>
                </li>
                <li>
                  <span class="font-medium">{{ location.tempC }} °C</span>
                </li>
              </ul>
            </l-popup>
          </l-marker>
        </v-marker-cluster>

        <l-control position="topright">
          <Navigation />
        </l-control>

        <l-control position="bottomright">
          <button
            id="userLocationBtn"
            class="btn border-b border-gray-300 rounded-t tooltip"
            @click="userLocation"
          >
            <i class="material-icons text-sm align-middle">gps_fixed</i>
            <span class="tooltip-text left capitalize">
              {{ i18n.location }}
            </span>
          </button>
          <button id="resetViewBtn" class="btn tooltip" @click="resetView">
            <i class="material-icons text-sm align-middle">restart_alt</i>
            <span class="text-xs tooltip-text left capitalize">
              {{ i18n.resetView }}
            </span>
          </button>
          <button
            id="zoomInBtn"
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
            id="zoomOutBtn"
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
        popupOptions: {
          closeOnClick: false,
        },
      }
    },
    computed: {
      ...mapGetters({
        locations: 'getLocations',
        zoom: 'getZoom',
        center: 'getCenter',
        focus: 'getFocus',
      }),
      i18n() {
        return this.$t('map')
      },
    },
    watch: {
      focus() {
        this.setView(this.focus)
        this.$refs[`marker-${this.focus.id}`][0].mapObject.openPopup()
      },
    },
    mounted() {
      this.openStreetMapLayer = new this.$L.TileLayer(this.tileProviders[0].url)
      this.satelliteLayer = new this.$L.TileLayer(this.tileProviders[1].url)
      this.minimapLayer = this.satelliteLayer
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
      resetView() {
        const map = this.$refs.map.mapObject
        map.setView(new this.$L.LatLng(39.8097343, -98.5556199), 5)
      },
      setView(obj) {
        const map = this.$refs.map.mapObject
        map.setView(new this.$L.LatLng(obj.latitude, obj.longitude), 16)
        this.setSatteliteLayer()
      },
      setOpenStreetMapsLayer() {
        const minimap = this.$refs.minimap
        this.minimapLayer = this.satelliteLayer
        minimap.changeLayer(this.satelliteLayer)
        this.tileProviders[0].visible = true
        this.tileProviders[1].visible = false
      },
      setSatteliteLayer() {
        const minimap = this.$refs.minimap
        this.minimapLayer = this.openStreetMapLayer
        minimap.changeLayer(this.openStreetMapLayer)
        this.tileProviders[0].visible = false
        this.tileProviders[1].visible = true
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
        if (this.minimapLayer === this.satelliteLayer) {
          this.setSatteliteLayer()
        } else if (this.minimapLayer === this.openStreetMapLayer) {
          this.setOpenStreetMapsLayer()
        }
        console.log(this.minimapLayer)
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
