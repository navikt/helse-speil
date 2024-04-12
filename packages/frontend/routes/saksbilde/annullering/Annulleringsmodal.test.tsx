import { RecoilWrapper } from '@test-wrappers';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { AnnullerDocument, OpprettAbonnementDocument } from '@io/graphql';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Annulleringsmodal } from './Annulleringsmodal';

dayjs.extend(isSameOrAfter);

let annulleringMutationKalt = false;

jest.mock('../../../io/http', () => ({
    postAbonnerPåAktør: () => {
        return Promise.resolve();
    },
}));

jest.mock('@utils/featureToggles', () => ({
    erUtvikling: () => true,
    erProd: () => false,
    erDev: () => false,
}));

const defaultProps = {
    fødselsnummer: '12345678910',
    aktørId: '12345678910',
    organisasjonsnummer: '987654321',
    fagsystemId: 'EN-FAGSYSTEMID',
    utbetalingId: 'EN-UTBETALINGID',
    skjæringstidspunkt: '2022-01-01',
    linjer: [{ fom: '2022-01-01', tom: '2022-01-31', totalbelop: 30000 }],
    onClose: () => null,
};

const mocks = [
    {
        request: {
            query: AnnullerDocument,
            variables: {
                annullering: {
                    aktorId: '12345678910',
                    fodselsnummer: '12345678910',
                    organisasjonsnummer: '987654321',
                    fagsystemId: undefined,
                    utbetalingId: 'EN-UTBETALINGID',
                    begrunnelser: ['ferie'],
                    kommentar: undefined,
                },
            },
        },
        result: () => {
            annulleringMutationKalt = true;
            return {
                data: {
                    annuller: true,
                },
            };
        },
    },
    {
        request: {
            query: OpprettAbonnementDocument,
            variables: {
                personidentifikator: '12345678910',
            },
        },
        result: {
            data: {
                opprettAbonnement: true,
            },
        },
    },
];

describe('Annulleringsmodal', () => {
    test('viser feilmelding ved manglende begrunnelse', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RecoilWrapper>
                    <Annulleringsmodal {...defaultProps} />
                </RecoilWrapper>
            </MockedProvider>,
        );
        await userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.getByText('Velg minst én begrunnelse')).toBeInTheDocument();
        });
    });
    test('viser feilmelding ved manglende kommentar', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RecoilWrapper>
                    <Annulleringsmodal {...defaultProps} />
                </RecoilWrapper>
            </MockedProvider>,
        );
        await userEvent.click(screen.getByText('Annet'));
        await userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.getByText('Skriv en kommentar hvis du velger begrunnelsen "annet"')).toBeInTheDocument();
        });
    });
    test('gjør annulleringsmutation på annuller', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RecoilWrapper>
                    <Annulleringsmodal {...defaultProps} />
                </RecoilWrapper>
            </MockedProvider>,
        );
        await userEvent.click(screen.getByText('Ferie'));
        const annulleringsknapp = screen.getByText('Annuller');
        await userEvent.click(annulleringsknapp);

        await waitFor(() => expect(annulleringMutationKalt).toBeTruthy());
    });
});
