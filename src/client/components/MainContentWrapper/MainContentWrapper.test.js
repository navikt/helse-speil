'use strict';

import React from 'react';
import MainContentWrapper from './MainContentWrapper';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

const behandlinger = [
    { behandlingsId: '123', originalSøknad: { fom: '2019-05-10', tom: '2019-05-20' } },
    { behandlingsId: '456', originalSøknad: { fom: '2019-06-10', tom: '2019-06-20' } }
];

const wrapperProps = {
    behandlinger: [...behandlinger],
    personTilBehandling: undefined
};

jest.mock('../PersonBar', () => () => <div />);
jest.mock('../Nav', () => () => <div />);

jest.mock('nav-frontend-typografi-style', () => ({}));
jest.mock('nav-frontend-lukknapp-style', () => ({}));
jest.mock('nav-frontend-knapper-style', () => ({}));
jest.mock('nav-frontend-paneler-style', () => ({}));
jest.mock('nav-frontend-chevron-style', () => ({}));
jest.mock('nav-frontend-skjema-style', () => ({}));
jest.mock('nav-frontend-modal-style', () => ({}));
jest.mock('nav-frontend-tabell-style', () => ({}));

jest.mock('nav-frontend-modal', () => ({
    setAppElement: () => {}
}));

describe('MainContentWrapper', () => {
    it('renders content when a behandling is selected', () => {
        const { container } = render(
            <BehandlingerContext.Provider
                value={{
                    ...wrapperProps,
                    personTilBehandling: { ...behandlinger[0] }
                }}
            >
                <MainContentWrapper />
            </BehandlingerContext.Provider>
        );
        expect(container.querySelector('.main-content')).toBeTruthy();
    });

    it('render empty state view when there are no behandlinger', () => {
        const { getByText } = render(
            <MemoryRouter>
                <BehandlingerContext.Provider
                    value={{
                        ...wrapperProps,
                        behandlinger: []
                    }}
                >
                    <MainContentWrapper />
                </BehandlingerContext.Provider>
            </MemoryRouter>
        );
        expect(
            getByText(
                'Gjør oppslag på en person ved å skrive inn fødselsnummer eller aktør-ID i feltet over'
            )
        ).toBeDefined();
    });
});
