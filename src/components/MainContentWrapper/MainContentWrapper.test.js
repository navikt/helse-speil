'use strict';

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainContentWrapper from './MainContentWrapper';
import ReactModal from 'react-modal';

ReactModal.setAppElement('*'); // suppresses modal-related test warnings.
afterEach(cleanup);

const behandling1 = {
    behandlingsId: '123',
    originalSøknad: { fom: '2019-05-10', tom: '2019-05-20' }
};
const wrapperProps = {
    behandlinger: [
        behandling1,
        { behandlingsId: '456', originalSøknad: { fom: '2019-06-10', tom: '2019-06-20' } }
    ],
    setValgtBehandling: jest.fn(),
    behandling: undefined
};

jest.mock('../widgets/Personinfo/Personinfo', () => () => <div />);
jest.mock('../LeftMenu/LeftMenu', () => () => <div />);
jest.mock('../../context/BehandlingerContext', () => ({
    withBehandlingContext: jest
        .fn()
        .mockImplementation(Component => props => <Component {...props} />)
}));

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
jest.mock('nav-frontend-etiketter-style', () => {
    return {};
});

describe('MainContentWrapper', () => {
    it('render modal when no behandling is chosen', () => {
        const { getByText, container } = render(<MainContentWrapper {...wrapperProps} />);
        expect(
            getByText('Denne brukeren har flere saker. Velg den saken du vil se på.')
        ).toBeDefined();
        expect(container.querySelector('.main-content')).toBe(null);
    });

    it('doesnt render modal when behandling is chosen', () => {
        const { container } = render(
            <MainContentWrapper {...wrapperProps} behandling={behandling1} />
        );
        expect(container.querySelector('.main-content')).toBeDefined();
    });

    it('render empty state view when there are no behandlinger', () => {
        const { getByText, container } = render(
            <MainContentWrapper {...wrapperProps} behandlinger={[]} />
        );
        expect(
            getByText(
                'Gjør oppslag på en person ved å skrive inn fødselsnummer eller aktør-ID i feltet over'
            )
        ).toBeDefined();
    });
});
