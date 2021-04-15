import { createReadStream } from 'fs'
import parse from 'csv-parse'
import axios from 'axios'
import { getToken } from './locationGeocoding.js'
import { Location } from './location.js'

const data = []

const parser = parse({
  trim: true,
  from_line: 10,
  skip_lines_with_empty_values: true,
})

createReadStream('./NCEI-thermal-springs.csv')
  .pipe(parser)
  .on('data', (row) => {
    const r = row.filter((item) => item !== '')
    data.push(new Location(r[0], r[1], r[2], r[3], r[4], r[5]))
  })
  .on('end', async () => {
    const token = await getToken()
    for (const location of data) {
      createStrapiLocation(location, token)
    }
  })

async function createStrapiLocation(location, token) {
  try {
    const response = await axios.post(
      'https://hotspringers-api.herokuapp.com/locations',
      location,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response
  } catch (error) {
    console.error(error)
  }
}
