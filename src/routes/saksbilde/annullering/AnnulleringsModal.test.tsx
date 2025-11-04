import React from 'react';

import { customAxios } from '@app/axios/axiosClient';
import { ArsakerQueryResult, SANITY_URL } from '@external/sanity';
import { ArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAddToast } from '@state/toasts';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen, within } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnnulleringsModal } from './AnnulleringsModal';

jest.mock('@state/toasts');

const enArbeidsgiverReferanse = (): ArbeidsgiverReferanse => ({
    type: 'Arbeidsgiver',
    organisasjonsnummer: '987654321',
});

const defaultProps = {
    closeModal: () => null,
    showModal: true,
    inntektsforholdReferanse: enArbeidsgiverReferanse(),
    vedtaksperiodeId: 'EN-VEDTAKSPERIODEID',
    arbeidsgiverFagsystemId: 'EN-FAGSYSTEMID',
    personFagsystemId: 'EN-FAGSYSTEMID',
    person: enPerson({
        fodselsnummer: '12345678910',
        aktorId: '12345678910',
    }),
    periode: enBeregnetPeriode(),
};

const addToastMock = jest.fn();
(useAddToast as jest.Mock).mockReturnValue(addToastMock);

const stubbedeÅrsaker: ArsakerQueryResult = {
    result: [
        {
            _id: 'foo',
            arsaker: [
                { _key: 'key01', arsak: 'Ferie' },
                { _key: 'key02', arsak: 'Annet' },
            ],
        },
    ],
};

describe('Annulleringsmodal', () => {
    beforeEach(() => {
        (customAxios.post as jest.Mock).mockImplementation((url: string, { query }: { query: string }) => {
            if (url === SANITY_URL && query.includes('_type == "arsaker"')) {
                return Promise.resolve({ data: stubbedeÅrsaker });
            }
            return Promise.reject();
        });
    });
    it('viser feilmelding ved manglende årsak', async () => {
        render(<AnnulleringsModal {...defaultProps} />);

        await userEvent.click(screen.getByText('Annuller'));

        expect(await screen.findByText('Velg minst én årsak')).toBeInTheDocument();
    });

    test('viser feilmelding ved manglende kommentar', async () => {
        render(<AnnulleringsModal {...defaultProps} />);

        const kanIkkeRevurderesSection = within(
            screen.getByRole('group', {
                name: /hvorfor kunne ikke vedtaket revurderes\?/i,
            }),
        );
        await userEvent.click(await kanIkkeRevurderesSection.findByRole('checkbox', { name: 'Annet' }));
        await userEvent.click(await screen.findByRole('button', { name: 'Annuller' }));

        expect(screen.getByText('Skriv en kommentar hvis du velger årsaken "annet"')).toBeInTheDocument();
    });

    test('gjør annulleringsmutation på annuller', async () => {
        render(<AnnulleringsModal {...defaultProps} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Ferie' }));
        await userEvent.click(await screen.findByRole('button', { name: 'Annuller' }));

        expect(customAxios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'POST',
                url: '/api/spesialist/vedtaksperioder/EN-VEDTAKSPERIODEID/annuller',
                data: {
                    arbeidsgiverFagsystemId: 'EN-FAGSYSTEMID',
                    personFagsystemId: 'EN-FAGSYSTEMID',
                    årsaker: [{ key: 'key01', årsak: 'Ferie' }],
                    kommentar: undefined,
                },
            }),
        );
    });

    test('viser toast etter at annullering-kallet er gjort', async () => {
        render(<AnnulleringsModal {...defaultProps} />);

        await userEvent.click(await screen.findByRole('checkbox', { name: 'Ferie' }));
        await userEvent.click(await screen.findByRole('button', { name: 'Annuller' }));

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: 'annullering',
                }),
            ),
        );

        expect(customAxios).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'POST',
                url: '/api/spesialist/vedtaksperioder/EN-VEDTAKSPERIODEID/annuller',
            }),
        );
    });
});
