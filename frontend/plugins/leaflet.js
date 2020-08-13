import Vue from 'vue'
import * as L from 'leaflet';

const LeafletPlugin = {
  install(Vue) {
    // Expose Leaflet
    Vue.prototype.$L = L
  }
}

Vue.use(LeafletPlugin)
