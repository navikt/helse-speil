import { RecoilWrapper } from '@test-wrappers';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import React from 'react';

import type { AnnulleringDTO } from '@io/http/types';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Annulleringsmodal } from './Annulleringsmodal';

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
        await userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.getByText('Velg minst én begrunnelse')).toBeInTheDocument();
        });
    });
    test('viser feilmelding ved manglende kommentar', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { wrapper: RecoilWrapper });
        await userEvent.click(screen.getByText('Annet'));
        await userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.getByText('Skriv en kommentar hvis du velger begrunnelsen "annet"')).toBeInTheDocument();
        });
    });
    test('bygger AnnulleringDTO ved post av annullering', async () => {
        render(<Annulleringsmodal {...defaultProps} />, { wrapper: RecoilWrapper });
        await userEvent.click(screen.getByText('Ferie'));
        await userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(cachedAnnullering?.aktørId).toEqual('12345678910');
        });
        expect(cachedAnnullering?.fødselsnummer).toEqual('12345678910');
        expect(cachedAnnullering?.organisasjonsnummer).toEqual('987654321');
        expect(cachedAnnullering?.fagsystemId).toEqual('EN-FAGSYSTEMID');
        expect(cachedAnnullering?.begrunnelser?.length).toEqual(1);
    });
});
