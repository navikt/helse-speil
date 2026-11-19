import { Mock, vi } from 'vitest';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { useSkalViseUnder20SykdomsgradsvarselSomFeil } from '@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel';
import { useFetchPersonQuery } from '@state/person';
import { useNyttVarseldesign } from '@state/toggles';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { Saksbildevarsler } from './Saksbildevarsler';

vi.mock('@state/person');
vi.mock('@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel');
vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useNyttVarseldesign: vi.fn(),
}));

describe('Saksbildevarsler', () => {
    beforeEach(() => {
        (useFetchPersonQuery as Mock).mockReturnValue({ data: null });
        (useSkalViseUnder20SykdomsgradsvarselSomFeil as Mock).mockReturnValue(false);
        (useNyttVarseldesign as Mock).mockReturnValue(false);
    });

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
                        id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
                        definisjonId: 'EN_ID',
                        behandlingId: 'EN_ID',
                        opprettet: '2020-01-01',
                        kode: 'EN_KODE',
                        tittel: 'Dette er en aktivitet',
                        forklaring: null,
                        handling: null,
                        vurdering: null,
                    },
                    {
                        id: 'fcce7e53-6a16-4d16-a770-9f4400c62167',
                        definisjonId: 'EN_ID',
                        behandlingId: 'EN_ID',
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

    test('viser besluttervarsler for saksbehandlerhandlinger', () => {
        render(
            <Saksbildevarsler
                periodState="utbetalt"
                varsler={[]}
                harTotrinnsvurdering={true}
                harTilkommenInntektEndring={false}
                saksbehandlerhandlingerTilKontroll={['Manuell vurdering av opptjening']}
            />,
        );
        const kontrollerElement = screen.getByText('Kontroller:');
        const handlingElement = screen.getByText('Manuell vurdering av opptjening');
        expect(handlingElement).toBeVisible();
        expect(kontrollerElement.parentElement).toContainElement(handlingElement);
    });

    test('viser ikke besluttervarsler for saksbehandlerhandlinger uten totrinnsvurdering', () => {
        render(
            <Saksbildevarsler
                periodState="utbetalt"
                varsler={[]}
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
                saksbehandlerhandlingerTilKontroll={['Manuell vurdering av opptjening']}
            />,
        );
        expect(screen.queryByText('Manuell vurdering av opptjening')).not.toBeInTheDocument();
    });

    describe('med nytt varseldesign', () => {
        beforeEach(() => {
            (useNyttVarseldesign as Mock).mockReturnValue(true);
        });

        test('viser meldinger utenfor varselområdet', () => {
            render(
                <Saksbildevarsler
                    periodState="utbetalingFeilet"
                    varsler={[varsel]}
                    harTotrinnsvurdering={true}
                    harTilkommenInntektEndring={true}
                />,
            );
            const varselområde = screen.getByRole('region', { name: 'Varsler' });
            expect(varselområde).toContainElement(screen.getByText('Et varsel'));
            expect(screen.getByText('Utbetalingen feilet.')).toBeVisible();
            expect(varselområde).not.toContainElement(screen.getByText('Utbetalingen feilet.'));
            expect(screen.getByText('Tilkommen inntekt')).toBeVisible();
            expect(varselområde).not.toContainElement(screen.getByText('Tilkommen inntekt'));
        });

        test('viser ikke varselområdet når perioden ikke har varsler', () => {
            render(
                <Saksbildevarsler
                    periodState="venterPåInntektsopplysninger"
                    varsler={[]}
                    harTotrinnsvurdering={false}
                    harTilkommenInntektEndring={false}
                />,
            );
            expect(screen.getByText('Ikke klar til behandling - venter på inntektsmelding')).toBeVisible();
            expect(screen.queryByRole('region', { name: 'Varsler' })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /varsler/i })).not.toBeInTheDocument();
        });

        test('viser varslene sortert etter kode uten varsler som ikke skal vises', async () => {
            render(
                <Saksbildevarsler
                    periodState="utbetalt"
                    varsler={[
                        { ...varsel, id: 'b', kode: 'RV_IM_2', tittel: 'Andre varsel' },
                        { ...varsel, id: 'skjult', kode: 'SB_EX_2', tittel: 'Skjult varsel' },
                        { ...varsel, id: 'a', kode: 'RV_IM_1', tittel: 'Første varsel' },
                    ]}
                    harTotrinnsvurdering={false}
                    harTilkommenInntektEndring={false}
                />,
            );
            const kort = screen.getByRole('region', { name: 'Varsler' });
            expect(kort).toHaveTextContent('Varsler (2)');
            await userEvent.click(within(kort).getAllByRole('button')[0]!);

            const varseltitler = within(kort).getAllByRole('heading', { level: 3 });
            expect(varseltitler.map((tittel) => tittel.textContent)).toEqual([
                expect.stringContaining('Første varsel'),
                expect.stringContaining('Andre varsel'),
            ]);
            expect(screen.queryByText('Skjult varsel')).not.toBeInTheDocument();
        });

        test('viser ikke varselområdet når perioden bare har varsler som ikke skal vises', () => {
            render(
                <Saksbildevarsler
                    periodState="utbetalt"
                    varsler={[{ ...varsel, kode: 'SB_EX_2' }]}
                    harTotrinnsvurdering={false}
                    harTilkommenInntektEndring={false}
                />,
            );
            expect(screen.queryByRole('region', { name: 'Varsler' })).not.toBeInTheDocument();
        });
    });
});

const varsel: ApiVarselDTO = {
    id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
    definisjonId: 'EN_ID',
    behandlingId: 'EN_ID',
    opprettet: '2020-01-01',
    kode: 'EN_KODE',
    tittel: 'Et varsel',
    forklaring: null,
    handling: null,
    vurdering: null,
};
