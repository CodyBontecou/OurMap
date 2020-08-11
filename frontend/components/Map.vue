<template>
  <div id="map" ref="map"></div>
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
        lng: -98.5556199
      },
      zoomControl: false,
      userLocationMarker: null
    };
  },
  mounted() {
    let map = L.map("map", {
      zoomControl: this.zoomControl
    }).setView([this.center.lat, this.center.lng], this.zoom);

    L.tileLayer(this.tileLayerUrl, {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      attribution: this.attribution
    }).addTo(map);

    map.setMaxBounds([[-90, Number.NEGATIVE_INFINITY], [90, Number.POSITIVE_INFINITY]]);

    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" })
        .then(function(permissionStatus) {
          if (permissionStatus.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              function success(position) {
                L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
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
        });
    }

    const that = this;
    // custom zoom bar control that includes a Zoom Home function
    L.Control.ZoomUserLocation = L.Control.extend({
      options: {
        position: "bottomright",
        zoomInText: "<i class=\"material-icons text-sm align-middle\">add</i>",
        zoomInTitle: "Zoom in",
        zoomOutText: "<i class=\"material-icons text-sm align-middle\">remove</i>",
        zoomOutTitle: "Zoom out",
        zoomUserLocationText: "<i class=\"material-icons text-sm align-middle\">gps_fixed</i>",
        zoomUserLocationTitle: "Zoom home"
      },

      onAdd: function(map) {
        const controlName = "gin-control-zoom",
          container = L.DomUtil.create("div", controlName + " leaflet-bar"),
          options = this.options;

        this._zoomUserLocationButton = this._createButton(options.zoomUserLocationText, options.zoomUserLocationTitle,
          controlName + "-home", container, this._zoomUserLocation);
        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
          controlName + "-in", container, this._zoomIn);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
          controlName + "-out", container, this._zoomOut);

        this._updateDisabled();
        map.on("zoomend zoomlevelschange", this._updateDisabled, this);

        return container;
      },

      onRemove: function(map) {
        map.off("zoomend zoomlevelschange", this._updateDisabled, this);
      },

      _zoomIn: function(e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
      },

      _zoomOut: function(e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
      },

      // TODO: 1. Change icon color when success
      // TODO: 2. Disable the icon and setView logic if location was designed
      // TODO: 3. Neutral case where user hasn't given permission yet.
      _zoomUserLocation: function() {
        if ("geolocation" in navigator) {
          // check if geolocation is supported/enabled on current browser
          // TODO: 1. Not working on mobile browsers (Chrome + Firefox). Think I need SSL
          navigator.geolocation.getCurrentPosition(
            function success(position) {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;

              if (that.userLocationMarker !== null) {
                that.userLocationMarker.remove();
              }

              that.userLocationMarker = L.marker([lat, lng]).addTo(map);

              map.setView(
                new L.LatLng(lat, lng),
                16
              );
            },
            function error(error_message) {
              // for when getting location results in an error
              console.error(
                "An error has occurred while retrieving location",
                error_message
              );
            }
          );
        } else {
          // set map to default, onload view
          map.setView([that.center.lat, that.center.lng], that.zoom);
        }
      },

      _createButton: function(html, title, className, container, fn) {
        let link = L.DomUtil.create("a", className, container);
        link.innerHTML = html;
        link.href = "#";
        link.title = title;

        L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
          .on(link, "click", L.DomEvent.stop)
          .on(link, "click", fn, this)
          .on(link, "click", this._refocusOnMap, this);

        return link;
      },

      _updateDisabled: function() {
        let map = this._map,
          className = "leaflet-disabled";

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
    const zoomUserLocation = new L.Control.ZoomUserLocation();
    zoomUserLocation.addTo(map);

    new L.Hash(map);

    // Custom Icon
    // TODO: 1. Icon needs to properly scale with zoom. Currently as you zoom out the icon slowly moves away from the location.
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: "<i class='material-icons text-blue-700'>fiber_manual_record</i>",
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

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
