import React from 'react'
import { render, cleanup, waitForElement } from 'react-testing-library'
import HeaderBar from '../src/components/HeaderBar/HeaderBar'
import 'jest-dom/extend-expect'
import UserContext from '../src/state/User'

afterEach(cleanup)

test('Missing brukernavn is accepted', async () => {
   const { getByText, getByTestId, container, asFragment } = render(
      <HeaderBar />
   )
   const brukerTextNode = await waitForElement(() =>
      container.querySelector('#bruker')
   )
   expect(brukerTextNode).toHaveTextContent('')
})

test('Provided value from context is used as brukernavn', async () => {
   const { getByText, getByTestId, container, asFragment } = render(
      <UserContext.Provider value={{ displayname: 'Bruker Brukersen' }}>
         <HeaderBar />
      </UserContext.Provider>
   )
   const brukerTextNode = await waitForElement(() =>
      container.querySelector('#bruker')
   )
   expect(brukerTextNode).toHaveTextContent('Bruker Brukersen')
})
