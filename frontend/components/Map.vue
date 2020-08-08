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

    navigator.permissions.query({ name: "geolocation" })
      .then(function(permissionStatus) {
        console.log("geolocation permission state is ", permissionStatus.state);
      });

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

    // custom zoom bar control that includes a Zoom Home function
    let that = this;
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
          navigator.geolocation.getCurrentPosition(
            function success(position) {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;

              if (that.userLocationMarker !== null) {
                that.userLocationMarker.remove();
              }

              // TODO: 1. Change marker to be more explicit and unique.
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

    // URL Hashing
    let HAS_HASHCHANGE = (function() {
      const doc_mode = window.documentMode;
      return ("onhashchange" in window) &&
        (doc_mode === undefined || doc_mode > 7);
    })();
    L.Hash = function(map) {
      this.onHashChange = L.Util.bind(this.onHashChange, this);

      if (map) {
        this.init(map);
      }
    };
    L.Hash.parseHash = function(hash) {
      if (hash.indexOf("#") === 0) {
        hash = hash.substr(1);
      }
      let args = hash.split("/");
      if (args.length === 3) {
        let zoom = parseInt(args[0], 10),
          lat = parseFloat(args[1]),
          lon = parseFloat(args[2]);
        if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
          return false;
        } else {
          return {
            center: new L.LatLng(lat, lon),
            zoom: zoom
          };
        }
      } else {
        return false;
      }
    };
    L.Hash.formatHash = function(map) {
      const center = map.getCenter(),
        zoom = map.getZoom(),
        precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));

      return "#" + [zoom,
        center.lat.toFixed(precision),
        center.lng.toFixed(precision)
      ].join("/");
    };
    L.Hash.prototype = {
      map: null,
      lastHash: null,

      parseHash: L.Hash.parseHash,
      formatHash: L.Hash.formatHash,

      init: function(map) {
        this.map = map;

        // reset the hash
        this.lastHash = null;
        this.onHashChange();

        if (!this.isListening) {
          this.startListening();
        }
      },

      removeFrom: function() {
        if (this.changeTimeout) {
          clearTimeout(this.changeTimeout);
        }

        if (this.isListening) {
          this.stopListening();
        }

        this.map = null;
      },

      onMapMove: function() {
        // bail if we're moving the map (updating from a hash),
        // or if the map is not yet loaded

        if (this.movingMap || !this.map._loaded) {
          return false;
        }

        let hash = this.formatHash(this.map);
        if (this.lastHash !== hash) {
          location.replace(hash);
          this.lastHash = hash;
        }
      },

      movingMap: false,
      update: function() {
        const hash = location.hash;
        if (hash === this.lastHash) {
          return;
        }
        const parsed = this.parseHash(hash);
        if (parsed) {
          this.movingMap = true;

          this.map.setView(parsed.center, parsed.zoom);

          this.movingMap = false;
        } else {
          this.onMapMove(this.map);
        }
      },

      // defer hash change updates every 100ms
      changeDefer: 100,
      changeTimeout: null,
      onHashChange: function() {
        // throttle calls to update() so that they only happen every
        // `changeDefer` ms
        if (!this.changeTimeout) {
          const that = this;
          this.changeTimeout = setTimeout(function() {
            that.update();
            that.changeTimeout = null;
          }, this.changeDefer);
        }
      },

      isListening: false,
      hashChangeInterval: null,
      startListening: function() {
        this.map.on("moveend", this.onMapMove, this);

        if (HAS_HASHCHANGE) {
          L.DomEvent.addListener(window, "hashchange", this.onHashChange);
        } else {
          clearInterval(this.hashChangeInterval);
          this.hashChangeInterval = setInterval(this.onHashChange, 50);
        }
        this.isListening = true;
      },

      stopListening: function() {
        this.map.off("moveend", this.onMapMove, this);

        if (HAS_HASHCHANGE) {
          L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
        } else {
          clearInterval(this.hashChangeInterval);
        }
        this.isListening = false;
      }
    };
    L.hash = function(map) {
      return new L.Hash(map);
    };
    L.Map.prototype.addHash = function() {
      this._hash = L.hash(this);
    };
    L.Map.prototype.removeHash = function() {
      this._hash.removeFrom();
    };

    new L.Hash(map);

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
