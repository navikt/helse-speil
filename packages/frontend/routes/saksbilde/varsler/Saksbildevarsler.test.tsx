import { ApolloWrapper } from '@test-wrappers';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { Maybe, VarselDto } from '@io/graphql';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { Saksbildevarsler } from './Saksbildevarsler';

jest.mock('@state/person');

describe('Saksbildevarsler', () => {
    const SaksbildevarslerWrapper = ({
        periodState,
        varsler,
    }: {
        periodState: PeriodState;
        varsler?: Maybe<Array<VarselDto>>;
    }) => (
        <ApolloWrapper>
            <RecoilRoot>
                <Saksbildevarsler periodState={periodState} varsler={varsler} />
            </RecoilRoot>
        </ApolloWrapper>
    );

    test('viser feilvarsel om utbetaling har feilet', () => {
        render(<SaksbildevarslerWrapper periodState="utbetalingFeilet" />);
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        render(<SaksbildevarslerWrapper periodState="annulleringFeilet" />);
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om saken har en aktiv oppgave men mangler oppgavereferanse', () => {
        render(<SaksbildevarslerWrapper periodState="tilGodkjenning" />);
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`,
            ),
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        render(<SaksbildevarslerWrapper periodState="ukjent" />);
        expect(screen.getByText('Kunne ikke lese informasjon om sakens tilstand.')).toBeVisible();
    });
    test('viser varsler', () => {
        render(
            <SaksbildevarslerWrapper
                periodState="utbetalt"
                varsler={[
                    { definisjonId: 'EN_ID', generasjonId: 'EN_ID', kode: 'EN_KODE', tittel: 'Dette er en aktivitet' },
                    {
                        definisjonId: 'EN_ID',
                        generasjonId: 'EN_ID',
                        kode: 'EN_KODE',
                        tittel: 'Dette er også en aktivitet',
                    },
                ]}
            />,
        );
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });
});
