import React from 'react'
import { render, cleanup, waitForElement } from 'react-testing-library'
import HeaderBar from '../../src/components/HeaderBar/HeaderBar'
import AuthContext from '../../src/context/AuthContext'
import 'jest-dom/extend-expect'

afterEach(cleanup)

test('Missing brukernavn is replaced with a default', async () => {
   const { getByText, getByTestId, container, asFragment } = render(
      <HeaderBar />
   )
   const brukerTextNode = await waitForElement(() =>
      container.querySelector('#bruker')
   )
   expect(brukerTextNode).toHaveTextContent('Ikke Pålogget')
})

test('Provided value from context is used as brukernavn', async () => {
   const { getByText, getByTestId, container, asFragment } = render(
      <AuthContext.Provider value={{state: {name: "Bruker Brukersen"}}}>
         <HeaderBar displayname="Bruker Brukersen" />
      </AuthContext.Provider>
   )
   const brukerTextNode = await waitForElement(() =>
      container.querySelector('#bruker')
   )
   expect(brukerTextNode).toHaveTextContent('Bruker Brukersen')
})
