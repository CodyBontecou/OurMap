export const state = () => ({
  locations: [],
  zoom: 3,
  map: null,
});

export const getters = {
  getLocations(state) {
    return state.locations
  },
  getZoom(state) {
    return state.zoom
  },
  getMap(state) {
    return state.map
  }
};

export const mutations = {
  setLocations(state, locations) {
    state.locations = locations;
  },
  setZoom(state, zoom) {
    state.zoom = zoom
  },
  zoomIn(state) {
    state.zoom += 1
  },
  zoomOut(state) {
    state.zoom -= 1
  },
  setMap(state, map) {
    state.map = map
  }
};

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('fetchLocations')
  },
  //TODO: Currently only getting the first 100 due to pagination
  async fetchLocations({ commit }) {
    try {
      await this.$strapi.$locations.find().then(response => {
        commit("setLocations", response);
      });
    }
    catch (e) {
      console.log(e)
    }
  }
};
