import React from 'react';
import dayjs from 'dayjs';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import '@testing-library/jest-dom/extend-expect';

import type { AnnulleringDTO } from '@io/http/types';

import { Annulleringsmodal } from './Annulleringsmodal';
import { RecoilWrapper } from '@test-wrappers';

dayjs.extend(isSameOrAfter);

let cachedAnnullering: AnnulleringDTO;

jest.mock('../../../../io/http', () => ({
    postAnnullering: (annullering: AnnulleringDTO) => {
        cachedAnnullering = annullering;
        return Promise.resolve();
    },
}));

const defaultProps = {
    fødselsnummer: '12345678910',
    aktørId: '12345678910',
    organisasjonsnummer: '987654321',
    fagsystemId: 'EN-FAGSYSTEMID',
    linjer: [{ fom: '2022-01-01', tom: '2022-01-31', totalbelop: 30000 }],
    onClose: () => null,
};

describe('Annulleringsmodal', () => {
    test('viser feilmelding ved manglende begrunnelse', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { wrapper: RecoilWrapper });
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.queryByText('Velg minst én begrunnelse')).not.toBeNull();
        });
    });
    test('viser feilmelding ved manglende kommentar', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { wrapper: RecoilWrapper });
        userEvent.click(screen.getByText('Annet'));
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.queryByText('Skriv en kommentar hvis du velger begrunnelsen "annet"')).not.toBeNull();
        });
    });
    test('viser feilmelding ved manglende skjæringstidspunkt-valg', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { wrapper: RecoilWrapper });
        userEvent.click(screen.getByText('Annet'));
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Velg om endringen gjelder siste skjæringstidspunkt eller et tidligere skjæringstidspunkt',
                ),
            ).not.toBeNull();
        });
    });
    test('bygger AnnulleringDTO ved post av annullering', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { wrapper: RecoilWrapper });
        userEvent.click(screen.getByText('Ferie'));
        userEvent.click(screen.getByText('Ja, det siste skjæringstidspunktet'));
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(cachedAnnullering?.aktørId).toEqual('12345678910');
            expect(cachedAnnullering?.fødselsnummer).toEqual('12345678910');
            expect(cachedAnnullering?.organisasjonsnummer).toEqual('987654321');
            expect(cachedAnnullering?.fagsystemId).toEqual('EN-FAGSYSTEMID');
            expect(cachedAnnullering?.begrunnelser?.length).toEqual(1);
            expect(cachedAnnullering?.gjelderSisteSkjæringstidspunkt).toEqual(true);
        });
    });
});
