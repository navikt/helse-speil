import React from "react"
import { render, fireEvent, cleanup, waitForElement } from "react-testing-library"
import HeaderBar from "../src/components/HeaderBar/HeaderBar"
import 'jest-dom/extend-expect'

afterEach(cleanup)

test("Default value is used for rukernavn if none provided", async () => {
   const { getByText, getByTestId, container, asFragment } = render(<HeaderBar />)
   const brukerTextNode = await waitForElement(() => container.querySelector('#bruker'))
   expect(brukerTextNode).toHaveTextContent('Ukjent Ukjentsen')
})

test("Provided value is used as brukernavn", async () => {
   const { getByText, getByTestId, container, asFragment } = render(<HeaderBar displayname="john doe" />)
   const brukerTextNode = await waitForElement(() => container.querySelector('#bruker'))
   expect(brukerTextNode).toHaveTextContent('john doe')
})
