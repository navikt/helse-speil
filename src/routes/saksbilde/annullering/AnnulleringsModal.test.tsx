import React from 'react';

import { useArsaker } from '@external/sanity';
import { AnnullerDocument, AnnulleringArsakInput } from '@io/graphql';
import { enPerson } from '@test-data/person';
import { createMock, render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { AnnulleringsModal } from './AnnulleringsModal';

jest.mock('@external/sanity');

const defaultProps = {
    closeModal: () => null,
    showModal: true,
    person: enPerson({
        fodselsnummer: '12345678910',
        aktorId: '12345678910',
    }),
    organisasjonsnummer: '987654321',
    vedtaksperiodeId: 'EN-VEDTAKSPERIODEID',
    utbetalingId: 'EN-UTBETALINGID',
    arbeidsgiverFagsystemId: 'EN-FAGSYSTEMID',
    personFagsystemId: 'EN-FAGSYSTEMID',
    skjæringstidspunkt: '2022-01-01',
    linjer: [{ fom: '2022-01-01', tom: '2022-01-31', totalbelop: 30000 }],
};

const createMocks = (annullerDone?: jest.Mock, arsaker: AnnulleringArsakInput[] = [], begrunnelser: string[] = []) => [
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
                    begrunnelser,
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

describe('Annulleringsmodal', () => {
    it('viser feilmelding ved manglende begrunnelse', async () => {
        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(),
        });

        await userEvent.click(screen.getByText('Annuller'));

        expect(await screen.findByText('Velg minst én begrunnelse')).toBeInTheDocument();
    });

    test('viser feilmelding ved manglende kommentar', async () => {
        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(undefined, [{ _key: 'key02', arsak: 'Annet' }], ['Annet']),
        });

        const kanIkkeRevurderesSection = within(
            screen.getByRole('group', {
                name: /hvorfor kunne ikke vedtaket revurderes\?/i,
            }),
        );
        await userEvent.click(kanIkkeRevurderesSection.getByRole('checkbox', { name: 'Annet' }));

        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        expect(screen.getByText('Skriv en kommentar hvis du velger begrunnelsen "annet"')).toBeInTheDocument();
    });

    test('gjør annulleringsmutation på annuller', async () => {
        const annulleringMutationDone = jest.fn();

        render(<AnnulleringsModal {...defaultProps} />, {
            mocks: createMocks(annulleringMutationDone, [{ _key: 'key01', arsak: 'Ferie' }], ['Ferie']),
        });

        await userEvent.click(screen.getByRole('checkbox', { name: 'Ferie' }));
        await userEvent.click(screen.getByRole('button', { name: 'Annuller' }));

        expect(annulleringMutationDone).toHaveBeenCalled();
    });
});
