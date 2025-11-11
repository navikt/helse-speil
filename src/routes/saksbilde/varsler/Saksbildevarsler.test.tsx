import { useSkalViseUnder20SykdomsgradsvarselSomFeil } from '@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel';
import { useFetchPersonQuery } from '@state/person';
import { render } from '@test-utils';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

import { Saksbildevarsler } from './Saksbildevarsler';

jest.mock('@state/person');
jest.mock('@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel');

describe('Saksbildevarsler', () => {
    (useFetchPersonQuery as jest.Mock).mockReturnValue({ data: null });
    (useSkalViseUnder20SykdomsgradsvarselSomFeil as jest.Mock).mockReturnValue(false);

    test('viser feilvarsel om utbetaling har feilet', () => {
        render(
            <Saksbildevarsler
                periodState="utbetalingFeilet"
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
            />,
        );
        expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
    });
    test('viser varsel om at perioden venter på inntektsmelding', () => {
        render(
            <Saksbildevarsler
                periodState="venterPåInntektsopplysninger"
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
            />,
        );
        expect(screen.getByText('Ikke klar til behandling - venter på inntektsmelding')).toBeVisible();
    });
    test('viser feilvarsel om annullering feilet', () => {
        render(
            <Saksbildevarsler
                periodState="annulleringFeilet"
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
            />,
        );
        expect(screen.getByText('Annulleringen feilet. Kontakt utviklerteamet.')).toBeVisible();
    });
    test('viser feilvarsel om perioden har en aktiv oppgave men mangler oppgavereferanse', () => {
        render(
            <Saksbildevarsler
                periodState="tilGodkjenning"
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
            />,
        );
        expect(
            screen.getByText(
                `Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.`,
            ),
        ).toBeVisible();
    });
    test('viser feilvarsel om vedtaksperioden har en ukjent tilstand', () => {
        render(
            <Saksbildevarsler periodState="ukjent" harTotrinnsvurdering={false} harTilkommenInntektEndring={false} />,
        );
        expect(screen.getByText('Kunne ikke lese informasjon om periodens tilstand.')).toBeVisible();
    });
    test('viser varsler', () => {
        render(
            <Saksbildevarsler
                periodState="utbetalt"
                varsler={[
                    {
                        __typename: 'VarselDTO',
                        id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
                        definisjonId: 'EN_ID',
                        generasjonId: 'EN_ID',
                        opprettet: '2020-01-01',
                        kode: 'EN_KODE',
                        tittel: 'Dette er en aktivitet',
                        forklaring: null,
                        handling: null,
                        vurdering: null,
                    },
                    {
                        __typename: 'VarselDTO',
                        id: 'fcce7e53-6a16-4d16-a770-9f4400c62167',
                        definisjonId: 'EN_ID',
                        generasjonId: 'EN_ID',
                        opprettet: '2020-01-01',
                        kode: 'EN_KODE',
                        tittel: 'Dette er også en aktivitet',
                        forklaring: null,
                        handling: null,
                        vurdering: null,
                    },
                ]}
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
            />,
        );
        expect(screen.getByText('Dette er en aktivitet')).toBeVisible();
        expect(screen.getByText('Dette er også en aktivitet')).toBeVisible();
    });

    test('viser besluttervarsler for tilkommen inntekt', () => {
        render(
            <Saksbildevarsler
                periodState="utbetalt"
                varsler={[]}
                harTotrinnsvurdering={true}
                harTilkommenInntektEndring={true}
            />,
        );
        const kontrollerElement = screen.getByText('Kontroller:');
        expect(kontrollerElement).toBeVisible();
        const tilkommenInntektElement = screen.getByText('Tilkommen inntekt');
        expect(tilkommenInntektElement).toBeVisible();
        expect(kontrollerElement.parentElement).toContainElement(tilkommenInntektElement);
    });
});
