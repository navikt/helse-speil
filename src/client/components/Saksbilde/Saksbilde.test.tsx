import React from 'react';
import Saksbilde from './Saksbilde';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { PersonContext } from '../../context/PersonContext';
import mockperson from '../../../../__mock-data__/mock-person_2perioder.json';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

const person = mockperson;

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

describe('Saksbilde', () => {
    it('renders content when a vedtaksperiode is selected', () => {
        const { container } = render(
            <PersonContext.Provider
                value={{
                    ...wrapperProps,
                    // @ts-ignore
                    personTilBehandling: { ...person }
                }}
            >
                <Saksbilde />
            </PersonContext.Provider>
        );
        expect(container.querySelector('.Saksbilde')).toBeTruthy();
    });

    it('render empty state view when no vedtaksperiode is selected', () => {
        const { container } = render(
            <MemoryRouter>
                // @ts-ignore
                <PersonContext.Provider value={{ ...wrapperProps }}>
                    <Saksbilde />
                </PersonContext.Provider>
            </MemoryRouter>
        );
        expect(container.getElementsByClassName('EmptyStateView')).toBeDefined();
    });
});
