'use strict';

import React from 'react';
import MainContentWrapper from './MainContentWrapper';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { PersonContext } from '../../context/PersonContext';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

const person = { behandlingsId: '123', originalSøknad: { fom: '2019-05-10', tom: '2019-05-20' } };

const wrapperProps = {
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
    it('renders content when a person is selected', () => {
        const { container } = render(
            <PersonContext.Provider
                value={{
                    ...wrapperProps,
                    personTilBehandling: { ...person }
                }}
            >
                <MainContentWrapper />
            </PersonContext.Provider>
        );
        expect(container.querySelector('.main-content')).toBeTruthy();
    });

    it('render empty state view when no person is selected', () => {
        const { getByText } = render(
            <MemoryRouter>
                <PersonContext.Provider
                    value={{
                        ...wrapperProps
                    }}
                >
                    <MainContentWrapper />
                </PersonContext.Provider>
            </MemoryRouter>
        );
        expect(
            getByText(
                'Gjør oppslag på en person ved å skrive inn fødselsnummer eller aktør-ID i feltet over'
            )
        ).toBeDefined();
    });
});
