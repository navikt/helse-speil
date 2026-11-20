import { ApiDagtype, ApiPeriodetilstand, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { enArbeidsforholdoverstyring, enDagoverstyring, enInntektoverstyring } from '@test-data/overstyring';

import {
    BeslutterkontrollGrunnlag,
    annulleringsbeskjed,
    beslutterkontroll,
    feilbeskjeder,
    statusbeskjeder,
} from './saksbildeBeskjeder';

describe('beslutterkontroll', () => {
    it('er tom når perioden ikke har totrinnsvurdering', () => {
        expect(
            beslutterkontroll({
                ...grunnlag,
                harTotrinnsvurdering: false,
                harDagOverstyringer: true,
                åpneEndringerPåPerson: [],
            }),
        ).toEqual([]);
    });

    it('er tom når det ikke finnes noe å kontrollere', () => {
        expect(beslutterkontroll({ ...grunnlag, harDagOverstyringer: true })).toEqual([]);
    });

    it('ber om kontroll av overstyrte dager', () => {
        expect(beslutterkontroll({ ...grunnlag, åpneEndringerPåPerson: [], harDagOverstyringer: true })).toEqual([
            'Overstyring av dager',
        ]);
    });

    it('ber om kontroll av dager overstyrt før periodens slutt', () => {
        const overstyring = enDagoverstyring({
            dager: [{ dato: '2020-01-10', type: ApiDagtype.Sykedag, grad: 100, fraGrad: null, fraType: null }],
        });

        expect(
            beslutterkontroll({ ...grunnlag, åpneEndringerPåPerson: [overstyring], activePeriodTom: '2020-01-31' }),
        ).toEqual(['Overstyring av dager']);
        expect(
            beslutterkontroll({ ...grunnlag, åpneEndringerPåPerson: [overstyring], activePeriodTom: '2020-01-05' }),
        ).toEqual([]);
    });

    it('ser bort fra ferdigstilte overstyringer', () => {
        expect(
            beslutterkontroll({
                ...grunnlag,
                åpneEndringerPåPerson: [enArbeidsforholdoverstyring({ ferdigstilt: true })],
            }),
        ).toEqual([]);
    });

    it('ber om kontroll av endret månedsinntekt og refusjon', () => {
        const overstyring = enInntektoverstyring();
        overstyring.inntekt = {
            ...overstyring.inntekt,
            manedligInntekt: 40000,
            refusjonsopplysninger: [{ fom: '2020-01-01', tom: null, belop: 40000 }],
        };

        expect(beslutterkontroll({ ...grunnlag, åpneEndringerPåPerson: [overstyring] })).toEqual([
            'Overstyring av månedsinntekt',
            'Overstyring av Refusjon',
        ]);
    });

    it('ber om kontroll av månedsinntekt på tilkommen inntekt', () => {
        const overstyring = enInntektoverstyring();
        overstyring.inntekt = { ...overstyring.inntekt, manedligInntekt: 40000, begrunnelse: 'tilkommen' };

        expect(beslutterkontroll({ ...grunnlag, åpneEndringerPåPerson: [overstyring] })).toEqual([
            'Overstyring av månedsinntekt på tilkommen inntekt',
        ]);
    });

    it('navngir arbeidsgiverne med deaktivert arbeidsforhold', () => {
        expect(
            beslutterkontroll({
                ...grunnlag,
                åpneEndringerPåPerson: [enArbeidsforholdoverstyring()],
                navnPåDeaktiverteGhostArbeidsgivere: 'Bedrift AS',
            }),
        ).toEqual(['Overstyring av annet arbeidsforhold (Bedrift AS)']);
    });

    it('ber om kontroll av varsler om manglende inntektsmelding og medlemskap', () => {
        expect(
            beslutterkontroll({
                ...grunnlag,
                åpneEndringerPåPerson: [],
                varsler: [varsel('RV_IV_10'), varsel('RV_MV_1'), varsel('RV_IM_1')],
            }),
        ).toEqual([
            'Brukerutbetaling og refusjon på grunn av manglende inntektsmelding',
            'Lovvalg og medlemskapsvurdering',
        ]);
    });

    it('legger saksbehandlerhandlinger og tilkommen inntekt til slutt', () => {
        expect(
            beslutterkontroll({
                ...grunnlag,
                harTilkommenInntektEndring: true,
                saksbehandlerhandlingerTilKontroll: ['Manuell vurdering av opptjening'],
            }),
        ).toEqual(['Tilkommen inntekt', 'Manuell vurdering av opptjening']);
    });
});

describe('statusbeskjeder', () => {
    it('sier fra til tidligere saksbehandler at oppgaven er sendt til beslutter', () => {
        expect(statusbeskjeder('tilGodkjenning', true)).toEqual([
            { grad: 'info', tekst: 'Oppgaven er sendt til beslutter' },
        ]);
    });

    it.each([
        ['venter', 'Ikke klar til behandling - avventer system'],
        ['venterPåInntektsopplysninger', 'Ikke klar til behandling - venter på inntektsmelding'],
        ['avventerAnnullering', 'Avventer behandling av en annen periode. Denne perioden vil bli annullert.'],
    ] as const)('sier fra når perioden er i tilstanden %s', (periodState, tekst) => {
        expect(statusbeskjeder(periodState, false)).toEqual([{ grad: 'info', tekst }]);
    });

    it('er tom når perioden ikke venter og ikke er sendt til beslutter', () => {
        expect(statusbeskjeder('tilGodkjenning', false)).toEqual([]);
    });
});

describe('feilbeskjeder', () => {
    it.each([
        ['annulleringFeilet', 'Annulleringen feilet. Kontakt utviklerteamet.'],
        ['utbetalingFeilet', 'Utbetalingen feilet.'],
        ['ukjent', 'Kunne ikke lese informasjon om periodens tilstand.'],
    ] as const)('sier fra når perioden er i tilstanden %s', (periodState, tekst) => {
        expect(feilbeskjeder(periodState, 'en-oppgave')).toEqual([{ grad: 'error', tekst }]);
    });

    it('sier fra når en periode til godkjenning mangler oppgavereferanse', () => {
        expect(feilbeskjeder('tilGodkjenning', null)).toEqual([
            {
                grad: 'error',
                tekst: 'Denne perioden kan ikke utbetales. Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.',
            },
        ]);
        expect(feilbeskjeder('tilGodkjenning', 'en-oppgave')).toEqual([]);
    });
});

describe('annulleringsbeskjed', () => {
    it('sier fra når utbetalingen er annullert eller sendt til annullering', () => {
        expect(annulleringsbeskjed(ApiPeriodetilstand.Annullert)).toEqual({
            grad: 'info',
            tekst: 'Utbetalingen er annullert',
        });
        expect(annulleringsbeskjed(ApiPeriodetilstand.TilAnnullering)).toEqual({
            grad: 'info',
            tekst: 'Utbetalingen er sendt til annullering',
        });
        expect(annulleringsbeskjed(ApiPeriodetilstand.TilGodkjenning)).toBeNull();
    });
});

const grunnlag: BeslutterkontrollGrunnlag = {
    harTotrinnsvurdering: true,
    varsler: [],
    harDagOverstyringer: false,
    harTilkommenInntektEndring: false,
    saksbehandlerhandlingerTilKontroll: [],
    åpneEndringerPåPerson: null,
};

function varsel(kode: string): ApiVarselDTO {
    return {
        id: kode,
        definisjonId: kode,
        behandlingId: 'en-behandling',
        opprettet: '2020-01-01',
        kode,
        tittel: kode,
        forklaring: null,
        handling: null,
        vurdering: null,
    };
}
