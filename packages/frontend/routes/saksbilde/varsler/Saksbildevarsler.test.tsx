import React from 'react';
import { RecoilRoot } from 'recoil';

import { Maybe, VarselDto } from '@io/graphql';
import '@testing-library/jest-dom/extend-expect';
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
        <RecoilRoot>
            <Saksbildevarsler periodState={periodState} varsler={varsler} />
        </RecoilRoot>
    );

    test('viser infovarsel når saken har gått til utbetaling', () => {
        render(<SaksbildevarslerWrapper periodState="tilUtbetaling" />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken har blitt utbetalt', () => {
        render(<SaksbildevarslerWrapper periodState="utbetalt" />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når revurdert periode har gått til utbetaling', () => {
        render(<SaksbildevarslerWrapper periodState="revurdert" />);
        expect(screen.getByText('Utbetalingen er sendt til oppdragsystemet.')).toBeVisible();
    });
    test('viser infovarsel når saken er godkjent uten utbetaling', () => {
        render(<SaksbildevarslerWrapper periodState="ingenUtbetaling" />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder ferie', () => {
        render(<SaksbildevarslerWrapper periodState="kunFerie" />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser infovarsel når saken kun inneholder permisjon', () => {
        render(<SaksbildevarslerWrapper periodState="kunPermisjon" />);
        expect(screen.getByText('Perioden er godkjent, ingen utbetaling.')).toBeVisible();
    });
    test('viser feilvarsel om utbetaling har feilet', () => {
        render(<SaksbildevarslerWrapper periodState="utbetalingFeilet" />);
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser infovarsel om saken er annullert', () => {
        render(<SaksbildevarslerWrapper periodState="annullert" />);
        expect(screen.getByText('Utbetalingen er annullert.')).toBeVisible();
    });
    test('viser infovarsel om saken er sendt til annullering', () => {
        render(<SaksbildevarslerWrapper periodState="tilAnnullering" />);
        expect(screen.getByText('Annullering venter.')).toBeVisible();
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
    test('viser infovarsel om vedtaksperioden er automatisk behandlet', () => {
        render(<SaksbildevarslerWrapper periodState="tilUtbetalingAutomatisk" />);
        expect(screen.getByText('Perioden er automatisk godkjent')).toBeVisible();
    });
    test('viser varslerState fra aktivitetsloggen', () => {
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
