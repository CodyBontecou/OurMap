<template>
  <div id="map"></div>
</template>

<script>
export default {
  data: () => {
    return {
      tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      maxZoom: 19,
      minZoom: 2,
      zoom: 3,
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
      center: {
        lat: 39.8097343,
        lng: -98.5556199,
      },
      zoomControl: false,
    };
  },
  mounted() {
    let map = L.map("map", {
      zoomControl: this.zoomControl,
    }).setView([this.center.lat, this.center.lng], this.zoom)

    L.tileLayer(this.tileLayerUrl, {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      attribution: this.attribution
    }).addTo(map)

    map.setMaxBounds([[-90, Number.NEGATIVE_INFINITY], [90, Number.POSITIVE_INFINITY]])

    // custom zoom bar control that includes a Zoom Home function
    let that = this
    L.Control.zoomHome = L.Control.extend({
      options: {
        position: 'bottomright',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
        zoomHomeTitle: 'Zoom home'
      },

      onAdd: function (map) {
        var controlName = 'gin-control-zoom',
          container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
          options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
          controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
          controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
          controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
      },

      onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
      },

      _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
      },

      _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
      },

      _zoomHome: function (e) {
        map.setView([that.center.lat, that.center.lng], that.zoom);
      },

      _createButton: function (html, title, className, container, fn, to) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
          .on(link, 'click', L.DomEvent.stop)
          .on(link, 'click', fn, this)
          .on(link, 'click', this._refocusOnMap, this);

        return link;
      },

      _updateDisabled: function () {
        var map = this._map,
          className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
          L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
          L.DomUtil.addClass(this._zoomInButton, className);
        }
      }
    });
    // add the new control to the map
    var zoomHome = new L.Control.zoomHome();
    zoomHome.addTo(map);
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
