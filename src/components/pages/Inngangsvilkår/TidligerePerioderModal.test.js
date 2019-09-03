'use strict';

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TidligerePerioderModal from './TidligerePerioderModal';
import ReactModal from 'react-modal';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);


ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

const modalProps = {
    perioder: [
        { fom: '2019-04-02', tom: '2019-04-13' },
        { fom: '2019-02-02', tom: '2019-02-13' },
        { fom: '2018-04-02', tom: '2018-04-13' }
    ],
    onClose: jest.fn().mockImplementation(() => {}),
    førsteFraværsdag: '2019-07-23'
};

jest.mock('nav-frontend-lukknapp-style', () => {
    return {
    }
});
jest.mock('nav-frontend-modal-style', () => {
    return {
    }
});
jest.mock('nav-frontend-typografi-style', () => {
    return {
    }
});

test('list of periods with 26 weeks interval', async () => {
    const { getByText } = render(<TidligerePerioderModal {...modalProps} />);
    expect(getByText('Første 26-ukers mellomrom')).toBeDefined();

});

test('empty list of periods', async () => {
    const { getByText } = render(<TidligerePerioderModal {...modalProps} perioder={[]} />);
    expect(getByText('Ingen tidligere perioder.')).toBeDefined();
});

test('list of periods without 26 weeks interval', async () => {
    const { queryByText } = render(<TidligerePerioderModal {...modalProps} perioder={[
        { fom: '2019-04-02', tom: '2019-04-13' },
        { fom: '2019-02-02', tom: '2019-02-13' },
        { fom: '2019-01-02', tom: '2019-01-13' }]} />);
    expect(queryByText('Første 26-ukers mellomrom')).toBe(null);
});

test('list of periods with 26 weeks interval at the beginning', async () => {
    const { getByText } = render(<TidligerePerioderModal {...modalProps} perioder={[
        { fom: '2018-04-02', tom: '2018-04-13' },
        { fom: '2018-02-02', tom: '2018-02-13' },
        { fom: '2017-04-02', tom: '2017-04-13' }
    ]} />);
    expect(getByText('Det er 26 uker eller mer siden forrige periode.')).toBeDefined();
});
