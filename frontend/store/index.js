export const state = () => ({
  locations: [],
  zoom: 5,
  center: [39.8097343, -98.5556199],
  map: null,
  results: [],
  searching: false,
  focus: null,
  layer: undefined,
})

export const getters = {
  getLocations(state) {
    return state.locations
  },
  getZoom(state) {
    return state.zoom
  },
  getMap(state) {
    return state.map
  },
  getCenter(state) {
    return state.center
  },
  getResults(state) {
    return state.results
  },
  getSearching(state) {
    return state.searching
  },
  getFocus(state) {
    return state.focus
  },
  directionsLink(state) {
    if (state.focus) {
      return `https://www.google.com/maps/dir/?api=1&destination=${state.focus.latitude}, ${state.focus.longitude}`
    } else {
      return '#'
    }
  },
}

export const mutations = {
  setLocations(state, locations) {
    state.locations = locations
  },
  setZoom(state, zoom) {
    state.zoom = zoom
  },
  zoomIn(state) {
    state.zoom += 2
  },
  zoomOut(state) {
    state.zoom -= 2
  },
  setMap(state, map) {
    state.map = map
  },
  setCenter(state, center) {
    state.center = center
  },
  setResults(state, results) {
    state.results = results
  },
  SET_SEARCHING(state, searching) {
    state.searching = searching
  },
  SET_FOCUS(state, obj) {
    state.focus = obj
  },
}

export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('fetchLocations')
  },
  // TODO: Currently only getting the first 100 due to pagination
  async fetchLocations({ commit }) {
    try {
      await this.$strapi
        .find('locations', { _limit: '-1' })
        .then((response) => {
          const locations = response.map((location) => {
            location.name = location.name
              .toLowerCase()
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')
            return location
          })
          commit('setLocations', locations)
        })
    } catch (e) {
      console.log(e)
    }
  },
  setSearching: ({ commit }, payload) => {
    commit('SET_SEARCHING', payload)
  },
  setFocus: ({ commit }, payload) => {
    commit('SET_FOCUS', payload)
  },
}
