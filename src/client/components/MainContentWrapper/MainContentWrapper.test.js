'use strict';

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainContentWrapper from './MainContentWrapper';
import ReactModal from 'react-modal';
import { MemoryRouter } from 'react-router-dom';
import { BehandlingerContext } from '../../context/BehandlingerContext';

ReactModal.setAppElement('*'); // suppresses modal-related test warnings.
afterEach(cleanup);

const behandling1 = {
    behandlingsId: '123',
    originalSøknad: { fom: '2019-05-10', tom: '2019-05-20' }
};
const wrapperProps = {
    state: {
        behandlinger: [
            behandling1,
            { behandlingsId: '456', originalSøknad: { fom: '2019-06-10', tom: '2019-06-20' } }
        ]
    },
    velgBehandling: jest.fn(),
    valgtBehandling: undefined
};

jest.mock('../PersonBar', () => () => <div />);
jest.mock('../LeftMenu', () => () => <div />);

jest.mock('nav-frontend-lukknapp-style', () => {
    return {};
});
jest.mock('nav-frontend-modal-style', () => {
    return {};
});
jest.mock('nav-frontend-typografi-style', () => {
    return {};
});
jest.mock('nav-frontend-skjema-style', () => {
    return {};
});
jest.mock('nav-frontend-knapper-style', () => {
    return {};
});
jest.mock('nav-frontend-paneler-style', () => {
    return {};
});
jest.mock('nav-frontend-chevron-style', () => {
    return {};
});

describe('MainContentWrapper', () => {
    it('render modal when no behandling is chosen', () => {
        const { getByText, container } = render(
            <MemoryRouter>
                <BehandlingerContext.Provider
                    value={{
                        ...wrapperProps,
                        userMustSelectBehandling: true
                    }}
                >
                    <MainContentWrapper />
                </BehandlingerContext.Provider>
            </MemoryRouter>
        );
        expect(
            getByText('Denne brukeren har flere saker. Velg den saken du vil se på.')
        ).toBeDefined();
        expect(container.querySelector('.main-content')).toBe(null);
    });

    it('does not render modal when behandling is chosen', () => {
        const { container } = render(
            <BehandlingerContext.Provider
                value={{
                    ...wrapperProps,
                    valgtBehandling: { ...behandling1 }
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
                        state: {
                            behandlinger: []
                        }
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
