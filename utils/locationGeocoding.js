import axios from "axios"

// TODO: Needs to take into account pagination
async function getLocations() {
  // Fetches all locations
  try {
    const { data } = await axios
      .get("http://localhost:1337/locations")
      .catch((error) => console.error(error))
    return data
  } catch (error) {
    console.error(error)
  }
}

async function getLocation(id) {
  // Given an id, we will fetch a single location
  try {
    const { data } = await axios
      .get("http://localhost:1337/locations/" + id)
      .catch((error) => console.error(error))
    return data
  } catch (error) {
    console.error(error)
  }
}

async function updateLocation(id, data, token) {
  // Given an id, we will update a single location with the provided data
  try {
    const response = await axios
      .put("http://localhost:1337/locations/" + id, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => console.error(error))
    return response
  } catch (error) {
    console.error(error)
  }
}

async function strapiLogin() {
  try {
    const { data } = await axios
      .post("http://localhost:1337/auth/local", {
        identifier: process.env.STRAPI_LOGIN,
        password: process.env.STRAPI_PASSWORD,
      })
      .catch((error) => console.error(error))
    return data
  } catch (error) {
    console.error(error)
  }
}

async function createAddressComponent(component, token) {
  try {
    const { data } = await axios.post(
      "http://localhost:1337/address-components",
      component,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return data
  } catch (error) {
    console.error(error)
  }
}

async function getToken() {
  try {
    const { jwt } = await strapiLogin()
    return jwt
  } catch (error) {
    console.error(error)
  }
}

async function getGeocodeData(location) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.GEOCODING_KEY}`
  const response = await axios.get(url).catch((error) => console.error(error))
  return response
}

async function run() {
  const token = await getToken()
  const locations = await getLocations()

  for (const location of locations) {
    const geocodeData = await getGeocodeData(location)
    const components = geocodeData.data.results[0].address_components
    const promises = await components.map((addressComponent) => {
      return createAddressComponent(addressComponent, token).then(
        (response) => {
          return response
        }
      )
    })
    Promise.all(promises).then(function (results) {
      const newLocation = location
      newLocation.address_components = results

      updateLocation(location.id, newLocation, token)
        .then((response) => console.log(response))
        .catch((error) => console.error(error.message))
    })
  }
}

run()
