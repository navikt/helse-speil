import ResultatOk from './testdata/ResultatOk';
import ResultatFlyttetTilSverige from './testdata/ResultatFlyttetTilSverige';
import { render, cleanup, waitForElement } from 'react-testing-library';
import Summary from "../src/components/Summary/Summary";
import 'jest-dom/extend-expect'
import React from "react";

test('test resultat ok', async () => {
  const { getByText, getByTestId, container, asFragment } = render(
    <Summary result={ResultatOk} />
  )

  const aktorId = await waitForElement(() =>
    container.querySelector('#aktorid')
  )

  expect(aktorId).toHaveTextContent('9901108329242');
})

test('test flyttet til sverige', async () => {
  const { getByText, getByTestId, container, asFragment } = render(
    <Summary result={ResultatFlyttetTilSverige} />
  )

  const aktorId = await waitForElement(() =>
    container.querySelector('#aktorid')
  )

  expect(aktorId).toHaveTextContent('9901109123044');
})