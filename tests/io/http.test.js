import { whoami, behandlingerFor } from '../../src/io/http'
import 'jest-dom/extend-expect'

afterEach(() => {
  global.fetch = undefined
})

test('whoami', async () => {
   global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        text: () => { return Promise.resolve('da usah') }
     })
   })
   const response = await whoami()
   expect(fetch).toHaveBeenCalledTimes(1)
   expect(response).toEqual('da usah')
})

test('behandlinger', async () => {
  global.fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json: () => { return Promise.resolve({ prop: 'val' }) }
    })
 })
  const response = await behandlingerFor(12345)
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(response).toEqual({ prop: 'val' })
})
