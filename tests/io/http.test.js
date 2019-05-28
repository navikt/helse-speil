import { cleanup } from 'react-testing-library'
import { whoami } from '../../src/io/http'
import 'jest-dom/extend-expect'

beforeEach(() => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
        return new Promise((resolve, reject) => {
          resolve({
            ok: true,
            status: 200,
            text: () => {
              new Promise((resolve, reject) => { resolve("da usah"), reject("oh noes") })
            },
          }),
          reject("oops")
        })
    })
})

afterEach(cleanup)

test('whoami', async () => {
  const response = await whoami()
  expect(fetch).toHaveBeenCalledTimes(1)
})
