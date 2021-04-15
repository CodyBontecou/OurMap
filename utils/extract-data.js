import { createReadStream } from 'fs'
import parse from 'csv-parse'
import { Location } from './location.js'

const data = []

const parser = parse({
  trim: true,
  from_line: 10,
  skip_lines_with_empty_values: true,
})

createReadStream('./data/Commercial_Hot_Springs.csv')
  .pipe(parser)
  .on('data', (row) => {
    const r = row.filter((item) => item !== '')
    data.push(new Location(undefined, r[1], r[0], r[2]))
  })
  .on('end', async () => {
    // const token = await getToken()
    // for (const location of data) {
    // createStrapiLocation(location, token)
    // }
    console.log(data)
  })
