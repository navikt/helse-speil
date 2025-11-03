import React from 'react';

import { useArsaker } from '@external/sanity';
import { AnnullerDocument, AnnulleringArsakInput } from '@io/graphql';
import { ArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAddToast } from '@state/toasts';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { createMock, render, screen, within } from '@test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnnulleringsModal } from './AnnulleringsModal';

jest.mock('@components/Inntektsforholdnavn');
jest.mock('@external/sanity');
jest.mock('@state/toasts');

const enArbeidsgiverReferanse = (): ArbeidsgiverReferanse => ({
    type: 'Arbeidsgiver',
    organisasjonsnummer: '987654321',
});

const defaultProps = {
    closeModal: () => null,
    showModal: true,
    person: enPerson({
        fodselsnummer: '12345678910',
        aktorId: '12345678910',
    }),
    periode: enBeregnetPeriode(),
    inntektsforholdReferanse: enArbeidsgiverReferanse(),
    vedtaksperiodeId: 'EN-VEDTAKSPERIODEID',
    utbetalingId: 'EN-UTBETALINGID',
    arbeidsgiverFagsystemId: 'EN-FAGSYSTEMID',
    personFagsystemId: 'EN-FAGSYSTEMID',
    skjæringstidspunkt: '2022-01-01',
    linjer: [{ fom: '2022-01-01', tom: '2022-01-31', totalbelop: 30000 }],
};

const createMocks = (annullerDone?: jest.Mock, arsaker: AnnulleringArsakInput[] = []) => [
    createMock({
        request: {
            query: AnnullerDocument,
            variables: {
                annullering: {
                    aktorId: '12345678910',
                    fodselsnummer: '12345678910',
                    organisasjonsnummer: '987654321',
                    vedtaksperiodeId: 'EN-VEDTAKSPERIODEID',
                    utbetalingId: 'EN-UTBETALINGID',
                    arbeidsgiverFagsystemId: 'EN-FAGSYSTEMID',
                    personFagsystemId: 'EN-FAGSYSTEMID',
                    arsaker,
                    kommentar: undefined,
                },
            },
        },
        result: () => {
            annullerDone?.();
            return {
                data: {
                    annuller: true,
                },
            };
        },
    }),
];

(useArsaker as jest.Mock).mockReturnValue({
    loading: false,
    arsaker: [
        {
            arsaker: [
                {
                    _key: 'key01',
                    arsak: 'Ferie',
                },
                {
                    _key: 'key02',
                    arsak: 'Annet',
                },
            ],
        },
    ],
});

const addToastMock = jest.fn();
(useAddToast as jest.Mock).mockReturnValue(addToastMock);

describe('Annulleringsmodal', () => {
    it('viser feilmelding ved manglende årsak', async () => {
        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(),
        });

        await userEvent.click(screen.getByText('Annuller'));

        expect(await screen.findByText('Velg minst én årsak')).toBeInTheDocument();
    });

    test('viser feilmelding ved manglende kommentar', async () => {
        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(undefined, [{ _key: 'key02', arsak: 'Annet' }]),
        });

        const kanIkkeRevurderesSection = within(
            screen.getByRole('group', {
                name: /hvorfor kunne ikke vedtaket revurderes\?/i,
            }),
        );
        await userEvent.click(kanIkkeRevurderesSection.getByRole('checkbox', { name: 'Annet' }));

        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        expect(screen.getByText('Skriv en kommentar hvis du velger årsaken "annet"')).toBeInTheDocument();
    });

    test('gjør annulleringsmutation på annuller', async () => {
        const annulleringMutationDone = jest.fn();

        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(annulleringMutationDone, [{ _key: 'key01', arsak: 'Ferie' }]),
        });

        await userEvent.click(screen.getByRole('checkbox', { name: 'Ferie' }));
        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        expect(annulleringMutationDone).toHaveBeenCalled();
    });

    test('viser toast etter at annullering-kallet er gjort', async () => {
        const annulleringMutationDone = jest.fn();

        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(annulleringMutationDone, [{ _key: 'key01', arsak: 'Ferie' }]),
        });

        await userEvent.click(screen.getByRole('checkbox', { name: 'Ferie' }));
        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        await waitFor(() =>
            expect(addToastMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: defaultProps.utbetalingId,
                }),
            ),
        );

        expect(annulleringMutationDone).toHaveBeenCalled();
    });
});
