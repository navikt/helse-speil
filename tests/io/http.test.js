import { cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'
import behandlingerFor from '../../src/io/http'
import fs from 'fs'

beforeEach(() => {
    const behandlinger = fs.readFileSync(`${__dirname}/../../__mock-data__/behandlinger.json`, 'utf-8')

    global.fetch = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          resolve({
            ok: true,
            status: 200,
            json: () => {
              return behandlinger
            },
          }),
          reject("oops")
        })
      })
})

afterEach(cleanup)

test('behandlinger', async () => {
    const data = await behandlingerFor('1234')
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(JSON.parse(data).behandlinger).toHaveLength(1)
})
