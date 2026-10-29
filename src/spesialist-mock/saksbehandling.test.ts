// @vitest-environment node
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { stub as forkastingStub } from '@app/api/spesialist/behandlinger/[behandlingId]/forkasting/stub';
import { stub as vedtakStub } from '@app/api/spesialist/behandlinger/[behandlingId]/vedtak/stub';
import { putStub as påVentStub } from '@app/api/spesialist/oppgaver/[oppgaveId]/pa-vent/putStub';
import { postStub as sendIReturStub } from '@app/api/spesialist/oppgaver/[oppgaveId]/totrinnsvurdering/send-i-retur/postStub';
import { postStub as sendTilGodkjenningStub } from '@app/api/spesialist/oppgaver/[oppgaveId]/totrinnsvurdering/send-til-godkjenning/postStub';
import { stub as arbeidsforholdStub } from '@app/api/spesialist/personer/[pseudoId]/arbeidsforhold/stub';
import { stub as inntekterFraAordningenStub } from '@app/api/spesialist/personer/[pseudoId]/inntekter-fra-aordningen/stub';
import { stub as paVentForPersonStub } from '@app/api/spesialist/personer/[pseudoId]/pa-vent/stub';
import { stub as skjønnsfastsettingStub } from '@app/api/spesialist/personer/[pseudoId]/sykefravaerstilfeller/[skjæringstidspunkt]/sykepengegrunnlag/stub';
import { stub as annullerStub } from '@app/api/spesialist/vedtaksperioder/[vedtaksperiodeId]/annuller/stub';
import { stub as annulleringStub } from '@app/api/spesialist/vedtaksperioder/[vedtaksperiodeId]/annullering/stub';
import { stub as overstyrArbeidsforholdStub } from '@app/api/spesialist/vedtaksperioder/[vedtaksperiodeId]/overstyringer/arbeidsforhold/stub';
import { stub as overstyrInntektStub } from '@app/api/spesialist/vedtaksperioder/[vedtaksperiodeId]/overstyringer/inntekt-og-refusjon/stub';
import { stub as overstyrTidslinjeStub } from '@app/api/spesialist/vedtaksperioder/[vedtaksperiodeId]/overstyringer/tidslinje/stub';
import { stub as risikovurderingStub } from '@app/api/spesialist/vedtaksperioder/[vedtaksperiodeId]/risikovurdering/stub';
import { stub as manuellOpptjeningStub } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/manuell/opptjening/stub';
import { hentVilkårsvurderinger } from '@app/api/vilkarsproving/personer/[personPseudoId]/vilkarsvurderinger/vilkarsvurderingerMock';
import {
    ApiDag,
    ApiEgenskap,
    ApiKildetype,
    ApiPeriodehistorikkType,
    ApiPeriodetilstand,
    ApiSykdomsdagtype,
    ApiUtbetalingsdagtype,
} from '@io/rest/generated/spesialist.schemas';
import { hentSynkedeOppgaver } from '@spesialist-mock/oppgaveliste';
import { finnNyestePeriodeForVedtaksperiodeId, finnPeriodeForBehandlingId } from '@spesialist-mock/periodeoppslag';
import { opprettTotrinnsvurderingHvisMangler } from '@spesialist-mock/saksbehandling';
import { fetchPersondata, hentSaksbilde } from '@spesialist-mock/saksbilde';
import { finnAktivOppgave, finnPåVent, finnTotrinnsvurdering } from '@spesialist-mock/storage/aktivOppgave';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { HistorikkinnslagMock } from '@spesialist-mock/storage/historikkinnslag';
import { OverstyringMock } from '@spesialist-mock/storage/overstyring';
import { PersonMock, lesTestpersonfiler } from '@spesialist-mock/storage/person';
import { PaVentMock } from '@spesialist-mock/storage/påvent';
import { SaksbehandlerhandlingMock } from '@spesialist-mock/storage/saksbehandlerhandling';
import { TildelingMock } from '@spesialist-mock/storage/tildeling';

// uten_varsler.json: periode til godkjenning uten varsler
const oppgaveId = '4959';
const behandlingId = '5e588350-c9bf-443b-be70-1098d12e5663';
// punktlig_jakke.json: periode til godkjenning med uvurdert varsel
const behandlingIdMedUvurdertVarsel = 'd43d63b3-9241-4ea8-a86c-ff9da316cc0c';
// sindig_globus.json: eldre behandling av en vedtaksperiode som har en nyere behandling
const eldreBehandlingId = 'b5ff942e-0a59-4060-8433-1104a6761dad';
const sindigGlobusFødselsnummer = '19886497256';

describe('saksbehandlingsflyt i spesialist-mock', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        BehandlingMock.nullstill();
        PaVentMock.nullstill();
        TildelingMock.nullstill();
        HistorikkinnslagMock.nullstill();
        SaksbehandlerhandlingMock.nullstill();
        OverstyringMock.nullstill();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('fatter vedtak, ferdigstiller oppgaven og utbetaler etter en stund', async () => {
        const response = await fattVedtak(behandlingId);

        expect(response.status).toBe(204);
        expect(periode(behandlingId).periodetilstand).toBe(ApiPeriodetilstand.TilUtbetaling);
        expect(finnAktivOppgave(fødselsnummer())).toBeNull();
        expect(hentSynkedeOppgaver().map((it) => it.id)).not.toContain(oppgaveId);
        expect(BehandlingMock.getBehandledeOppgaver().map((it) => it.oppgaveId)).toContain(oppgaveId);

        vi.advanceTimersByTime(2000);
        expect(periode(behandlingId).periodetilstand).toBe(ApiPeriodetilstand.Utbetalt);
    });

    it('avviser vedtak som allerede er fattet', async () => {
        await fattVedtak(behandlingId);

        await forventFeil(fattVedtak(behandlingId), 409, 'VEDTAK_ALLEREDE_FATTET');
    });

    it('avviser vedtak når perioden har uvurderte varsler', async () => {
        await forventFeil(fattVedtak(behandlingIdMedUvurdertVarsel), 400, 'VARSLER_MANGLER_VURDERING');
    });

    it('avviser vedtak på eldre behandling', async () => {
        await forventFeil(fattVedtak(eldreBehandlingId), 400, 'KAN_IKKE_FATTE_VEDTAK_PÅ_ELDRE_BEHANDLING');
    });

    it('avviser vedtak på ukjent behandling', async () => {
        await forventFeil(fattVedtak('ukjent'), 404, 'BEHANDLING_IKKE_FUNNET');
    });

    it('krever totrinnsvurdering for å sende til godkjenning', async () => {
        await forventFeil(sendTilGodkjenning(oppgaveId), 409, 'TOTRINNSVURDERING_IKKE_FUNNET');
        await forventFeil(sendTilGodkjenning('ukjent'), 404, 'OPPGAVE_IKKE_FUNNET');
    });

    it('går gjennom hele totrinnsflyten', async () => {
        opprettTotrinnsvurderingHvisMangler(fødselsnummer());
        expect(finnTotrinnsvurdering(fødselsnummer())).toMatchObject({ erBeslutteroppgave: false });

        expect((await sendTilGodkjenning(oppgaveId)).status).toBe(204);
        expect(finnTotrinnsvurdering(fødselsnummer())).toMatchObject({ erBeslutteroppgave: true, erRetur: false });
        expect(egenskaperForOppgave()).toContain(ApiEgenskap.BESLUTTER);
        expect(periode(behandlingId).egenskaper.map((it) => it.egenskap)).toContain(ApiEgenskap.BESLUTTER);
        expect(historikktyper()).toContain(ApiPeriodehistorikkType.TOTRINNSVURDERING_TIL_GODKJENNING);
        await forventFeil(sendTilGodkjenning(oppgaveId), 409, 'OPPGAVE_ALLEREDE_SENDT_TIL_BESLUTTER');
        await forventFeil(forkast(behandlingId), 400, 'TOTRINNSVURDERING_SENDT_TIL_BESLUTTER');

        expect((await sendIRetur(oppgaveId)).status).toBe(204);
        expect(finnTotrinnsvurdering(fødselsnummer())).toMatchObject({ erBeslutteroppgave: false, erRetur: true });
        expect(egenskaperForOppgave()).toContain(ApiEgenskap.RETUR);
        expect(egenskaperForOppgave()).not.toContain(ApiEgenskap.BESLUTTER);
        expect(periode(behandlingId).egenskaper.map((it) => it.egenskap)).not.toContain(ApiEgenskap.BESLUTTER);
        await forventFeil(sendIRetur(oppgaveId), 409, 'OPPGAVE_ALLEREDE_SENDT_I_RETUR');

        expect((await sendTilGodkjenning(oppgaveId)).status).toBe(204);
        expect((await fattVedtak(behandlingId)).status).toBe(204);
        expect(historikktyper()).toContain(ApiPeriodehistorikkType.TOTRINNSVURDERING_ATTESTERT);
        expect(BehandlingMock.getBehandledeOppgaver().find((it) => it.oppgaveId === oppgaveId)?.beslutter).toBe(
            'Utvikler, Lokal',
        );
    });

    it('tar oppgaven av vent når den sendes til godkjenning, også etter fattet vedtak', async () => {
        PaVentMock.setPåVent(oppgaveId, { frist: '2030-01-01', oid: 'oid' });
        expect(finnPåVent(fødselsnummer())).toBeTruthy();
        opprettTotrinnsvurderingHvisMangler(fødselsnummer());

        expect((await sendTilGodkjenning(oppgaveId)).status).toBe(204);
        expect(finnPåVent(fødselsnummer())).toBeNull();
        expect((await hentPåVent()).paVent).toBeNull();
        expect(periode(behandlingId).egenskaper.map((it) => it.egenskap)).not.toContain(ApiEgenskap.PA_VENT);
        expect(egenskaperForOppgave()).not.toContain(ApiEgenskap.PA_VENT);

        expect((await fattVedtak(behandlingId)).status).toBe(204);
        expect(finnPåVent(fødselsnummer())).toBeNull();
        expect(periode(behandlingId).egenskaper.map((it) => it.egenskap)).not.toContain(ApiEgenskap.PA_VENT);
    });

    it('legger oppgaven på vent med historikkinnslag på vedtaksperioden', async () => {
        expect((await leggPåVent(oppgaveId)).status).toBe(204);

        expect(finnPåVent(fødselsnummer())).toBeTruthy();
        expect((await hentPåVent()).paVent).toMatchObject({ frist: expect.any(String) });
        expect(historikktyper()).toContain(ApiPeriodehistorikkType.LEGG_PA_VENT);
        expect(TildelingMock.harTildeling(personPseudoId())).toBe(true);
    });

    it('avviser å legge ukjent oppgave på vent', async () => {
        await forventFeil(leggPåVent('finnes-ikke'), 404, 'OPPGAVE_IKKE_FUNNET');
    });

    it('forkaster perioden og ferdigstiller oppgaven', async () => {
        expect((await forkast(behandlingId)).status).toBe(204);

        expect(periode(behandlingId)).toMatchObject({
            periodetilstand: ApiPeriodetilstand.TilInfotrygd,
            erForkastet: true,
        });
        expect(finnAktivOppgave(fødselsnummer())).toBeNull();
        await forventFeil(forkast(behandlingId), 400, 'OPPGAVE_IKKE_FUNNET');
    });

    it('annullerer en utbetalt periode', async () => {
        const vedtaksperiodeId = finnUtbetaltVedtaksperiodeId();
        expect((await hentAnnullering(vedtaksperiodeId)).annullering).toBeNull();

        expect((await annuller(vedtaksperiodeId)).status).toBe(204);
        expect((await hentAnnullering(vedtaksperiodeId)).annullering).toMatchObject({
            vedtaksperiodeId,
            arsaker: ['Feil'],
        });
        expect(finnNyestePeriodeForVedtaksperiodeId(vedtaksperiodeId)?.periode.periodetilstand).toBe(
            ApiPeriodetilstand.TilAnnullering,
        );

        vi.advanceTimersByTime(2000);
        expect(finnNyestePeriodeForVedtaksperiodeId(vedtaksperiodeId)?.periode.periodetilstand).toBe(
            ApiPeriodetilstand.Annullert,
        );
        await forventFeil(annuller(vedtaksperiodeId), 409, 'ALLEREDE_ANNULLERT');
    });
    it('gir risikovurderingen til nyeste behandling av vedtaksperioden', async () => {
        const { vedtaksperiodeId } = periode(behandlingId);
        const risikovurdering = lesTestpersonfiler().find((fil) => fil.saksbilde.fodselsnummer === fødselsnummer())
            ?.risikovurderinger[vedtaksperiodeId];
        const response = await risikovurderingStub(lagRequest({}), Promise.resolve({ vedtaksperiodeId }));

        expect(risikovurdering).toBeTruthy();
        expect((await response.json()).risikovurdering).toEqual(risikovurdering);
    });

    it('gir arbeidsforholdene til personen med organisasjonsnummer', async () => {
        const saksbilde = hentSaksbilde(personPseudoId())!;
        const forventet = saksbilde.arbeidsgivere.flatMap((arbeidsgiver) =>
            arbeidsgiver.arbeidsforhold.map((it) => ({ ...it, organisasjonsnummer: arbeidsgiver.organisasjonsnummer })),
        );

        const response = await arbeidsforholdStub(lagRequest({}), Promise.resolve({ pseudoId: personPseudoId() }));

        expect(forventet.length).toBeGreaterThan(0);
        expect(await response.json()).toEqual(forventet);
    });

    it('gir 404 for arbeidsforhold til ukjent person', async () => {
        const response = await arbeidsforholdStub(lagRequest({}), Promise.resolve({ pseudoId: 'ukjent' }));

        expect(response.status).toBe(404);
    });

    it('gir inntektene fra a-ordningen per arbeidsgiver og skjæringstidspunkt', async () => {
        const fil = lesTestpersonfiler().find((it) =>
            it.saksbilde.arbeidsgivere.some((arbeidsgiver) => arbeidsgiver.inntekterFraAordningen.length > 0),
        )!;
        const pseudoId = PersonMock.findPersonPseudoId(fil.saksbilde.fodselsnummer)!;
        const saksbilde = hentSaksbilde(pseudoId)!;
        const forventet = saksbilde.arbeidsgivere.flatMap((arbeidsgiver) =>
            arbeidsgiver.inntekterFraAordningen.map((it) => ({
                ...it,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            })),
        );

        const response = await inntekterFraAordningenStub(lagRequest({}), Promise.resolve({ pseudoId }));

        expect(forventet.length).toBeGreaterThan(0);
        expect(await response.json()).toEqual(forventet);
    });

    it('gir 404 for inntekter fra a-ordningen til ukjent person', async () => {
        const response = await inntekterFraAordningenStub(lagRequest({}), Promise.resolve({ pseudoId: 'ukjent' }));

        expect(response.status).toBe(404);
    });

    it('gir personer uten seedet opptjening skjæringstidspunktet til perioden med oppgave', () => {
        expect(hentVilkårsvurderinger(personPseudoId()).skjæringstidspunkt).toBe(
            periode(behandlingId).skjaeringstidspunkt,
        );
    });

    it('knytter manuell vurdering av opptjening til behandlingen og oppretter totrinnsvurdering', async () => {
        const { opptjeningsvurderingId } = await (await vurderOpptjeningManuelt('1999-01-01')).json();

        const handling = SaksbehandlerhandlingMock.hentHandlinger(personPseudoId()).find(
            (it) => it.handlingId === opptjeningsvurderingId,
        );
        expect(handling).toMatchObject({
            behandlingId,
            skjæringstidspunkt: periode(behandlingId).skjaeringstidspunkt,
            erDelAvAktivTotrinnsvurdering: true,
        });
        expect(finnTotrinnsvurdering(fødselsnummer())).toMatchObject({ erBeslutteroppgave: false });

        expect((await sendTilGodkjenning(oppgaveId)).status).toBe(204);
        expect((await fattVedtak(behandlingId)).status).toBe(204);
        expect(
            SaksbehandlerhandlingMock.hentHandlinger(personPseudoId()).some((it) => it.erDelAvAktivTotrinnsvurdering),
        ).toBe(false);
    });
    it('viser overstyringer av tidslinje, inntekt, arbeidsforhold og skjønnsfastsetting på arbeidsgiveren', async () => {
        const { vedtaksperiodeId, skjaeringstidspunkt } = periode(behandlingId);
        const organisasjonsnummer = arbeidsgiverForBehandling().organisasjonsnummer;

        await overstyrTidslinjeStub(
            lagRequest({
                begrunnelse: 'Feil dag',
                dager: [{ dato: skjaeringstidspunkt, type: 'Feriedag', fraType: 'Sykedag', grad: null, fraGrad: 100 }],
            }),
            Promise.resolve({ vedtaksperiodeId }),
        );
        await overstyrInntektStub(
            lagRequest({
                skjæringstidspunkt: skjaeringstidspunkt,
                arbeidsgivere: [
                    {
                        organisasjonsnummer,
                        månedligInntekt: 50000,
                        fraMånedligInntekt: 40000,
                        refusjonsopplysninger: [{ fom: skjaeringstidspunkt, tom: null, beløp: 50000 }],
                        fraRefusjonsopplysninger: [],
                        begrunnelse: 'Begrunnelse',
                        forklaring: 'Forklaring',
                    },
                ],
            }),
            Promise.resolve({ vedtaksperiodeId }),
        );
        await overstyrArbeidsforholdStub(
            lagRequest({
                skjæringstidspunkt: skjaeringstidspunkt,
                overstyrteArbeidsforhold: [
                    { organisasjonsnummer, deaktivert: true, begrunnelse: 'Begrunnelse', forklaring: 'Forklaring' },
                ],
            }),
            Promise.resolve({ vedtaksperiodeId }),
        );
        await skjønnsfastsettingStub(
            lagRequest({
                årsak: 'Skjønnsfastsettelse ved mer enn 25 % avvik',
                sykepengegrunnlagstype: {
                    discriminatorType: 'ApiSkjønnsfastsatt',
                    skjønnsfastsettelsestype: 'OMREGNET_ÅRSINNTEKT',
                    skjønnsfastsatteInntekter: [{ organisasjonsnummer, årlig: 600000, fraÅrlig: 480000 }],
                    lovverksreferanse: { paragraf: '8-30', lovverk: 'folketrygdloven', lovverksversjon: '2019-01-01' },
                },
                begrunnelseFritekst: 'Fritekst',
                intierendeVedtaksperiodeId: vedtaksperiodeId,
            }),
            Promise.resolve({ pseudoId: personPseudoId(), skjæringstidspunkt: skjaeringstidspunkt }),
        );

        const overstyringer = arbeidsgiverForBehandling().overstyringer;
        expect(overstyringer.map((it) => it.type)).toEqual(
            expect.arrayContaining([
                'ApiDagoverstyring',
                'ApiInntektoverstyring',
                'ApiArbeidsforholdoverstyring',
                'ApiSykepengegrunnlagskjonnsfastsetting',
            ]),
        );
        const mockOverstyringer = overstyringer.filter((it) => it.saksbehandler.navn === 'Utvikler, Lokal');
        expect(mockOverstyringer).toHaveLength(4);
        expect(mockOverstyringer.every((it) => it.vedtaksperiodeId === vedtaksperiodeId && !it.ferdigstilt)).toBe(true);
        expect(mockOverstyringer).toContainEqual(
            expect.objectContaining({
                type: 'ApiInntektoverstyring',
                inntekt: expect.objectContaining({
                    manedligInntekt: 50000,
                    refusjonsopplysninger: [{ fom: skjaeringstidspunkt, tom: null, belop: 50000 }],
                }),
            }),
        );
        expect(mockOverstyringer).toContainEqual(
            expect.objectContaining({
                type: 'ApiSykepengegrunnlagskjonnsfastsetting',
                skjonnsfastsatt: expect.objectContaining({ type: 'OMREGNET_ARSINNTEKT', arlig: 600000 }),
            }),
        );

        expect((await sendTilGodkjenning(oppgaveId)).status).toBe(204);
        expect((await fattVedtak(behandlingId)).status).toBe(204);
        expect(
            arbeidsgiverForBehandling()
                .overstyringer.filter((it) => it.saksbehandler.navn === 'Utvikler, Lokal')
                .every((it) => it.ferdigstilt),
        ).toBe(true);
    });

    it('legger overstyrte dager inn i tidslinja, og siste overstyring vinner', async () => {
        const { vedtaksperiodeId, tidslinje } = periode(behandlingId);
        const navdag = tidslinje.find((dag) => dag.utbetalingsdagtype === ApiUtbetalingsdagtype.NAVDAG)!;
        const overstyrDag = (type: string, grad: number | null) =>
            overstyrTidslinjeStub(
                lagRequest({
                    begrunnelse: 'Feil dag',
                    dager: [{ dato: navdag.dato, type, fraType: 'Sykedag', grad, fraGrad: 100 }],
                }),
                Promise.resolve({ vedtaksperiodeId }),
            );

        await overstyrDag('Feriedag', null);
        expect(dagI(periode(behandlingId).tidslinje, navdag.dato)).toEqual(
            expect.objectContaining({
                sykdomsdagtype: ApiSykdomsdagtype.FERIEDAG,
                utbetalingsdagtype: ApiUtbetalingsdagtype.FERIEDAG,
                utbetalingsinfo: null,
                kilde: expect.objectContaining({ type: ApiKildetype.SAKSBEHANDLER }),
            }),
        );

        await overstyrDag('Sykedag', 50);
        expect(dagI(periode(behandlingId).tidslinje, navdag.dato)).toEqual(
            expect.objectContaining({
                sykdomsdagtype: ApiSykdomsdagtype.SYKEDAG,
                utbetalingsdagtype: ApiUtbetalingsdagtype.NAVDAG,
                grad: 50,
                utbetalingsinfo: navdag.utbetalingsinfo,
            }),
        );
    });

    it('lar tidslinja i testdataene være uendret når mocken ikke har overstyringer', () => {
        const fil = lesTestpersonfiler().find((it) => it.saksbilde.fodselsnummer === sindigGlobusFødselsnummer)!;
        const persondata = fetchPersondata()[sindigGlobusFødselsnummer]!;

        fil.saksbilde.arbeidsgivere.forEach((arbeidsgiver, index) =>
            expect(persondata.arbeidsgivere[index]!.behandlinger[0]?.perioder.map((it) => it.tidslinje)).toEqual(
                arbeidsgiver.behandlinger[0]?.perioder.map((it) => it.tidslinje),
            ),
        );
    });
});

function dagI(tidslinje: ApiDag[], dato: string): ApiDag | undefined {
    return tidslinje.find((dag) => dag.dato === dato);
}

function arbeidsgiverForBehandling() {
    const { person } = finnPeriodeForBehandlingId(behandlingId)!;
    return person.arbeidsgivere.find((arbeidsgiver) =>
        arbeidsgiver.behandlinger.some((behandling) =>
            behandling.perioder.some((it) => (it as { behandlingId?: string }).behandlingId === behandlingId),
        ),
    )!;
}

function personPseudoId(): string {
    return PersonMock.findPersonPseudoId(fødselsnummer())!;
}

function vurderOpptjeningManuelt(skjæringstidspunkt: string) {
    return manuellOpptjeningStub(
        lagRequest({
            skjæringstidspunkt,
            minst4Uker: true,
            opptjeningsaktiviteter: ['ARBEID'],
            fritekstbegrunnelse: 'Ok',
            journalpostId: [],
        }),
        Promise.resolve({ personPseudoId: personPseudoId() }),
    );
}

function periode(id: string) {
    const oppslag = finnPeriodeForBehandlingId(id);
    if (!oppslag) throw Error(`Fant ikke behandling ${id}`);
    return oppslag.periode;
}

function fødselsnummer(): string {
    return finnPeriodeForBehandlingId(behandlingId)!.person.fodselsnummer;
}

function egenskaperForOppgave(): ApiEgenskap[] {
    return hentSynkedeOppgaver().find((it) => it.id === oppgaveId)!.egenskaper;
}

function historikktyper(): ApiPeriodehistorikkType[] {
    return periode(behandlingId).historikkinnslag.map((innslag) => innslag.historikktype);
}

function finnUtbetaltVedtaksperiodeId(): string {
    const vedtaksperiodeId = lesTestpersonfiler()
        .flatMap((fil) => fil.saksbilde.arbeidsgivere)
        .flatMap((arbeidsgiver) => arbeidsgiver.behandlinger[0]?.perioder ?? [])
        .find((periode) => periode.periodetilstand === ApiPeriodetilstand.Utbetalt)?.vedtaksperiodeId;
    if (!vedtaksperiodeId) throw Error('Fant ingen utbetalt periode i testdataene');
    return vedtaksperiodeId;
}

async function forventFeil(response: Promise<Response>, status: number, code: string) {
    const svar = await response;
    expect(svar.status).toBe(status);
    expect(await svar.json()).toMatchObject({ status, code });
}

function fattVedtak(id: string) {
    return vedtakStub(lagRequest({ begrunnelse: null }), Promise.resolve({ behandlingId: id }));
}

function forkast(id: string) {
    return forkastingStub(
        lagRequest({ årsak: 'Feil', begrunnelser: [], kommentar: null }),
        Promise.resolve({ behandlingId: id }),
    );
}

function sendTilGodkjenning(id: string) {
    return sendTilGodkjenningStub(lagRequest({ begrunnelse: null }), Promise.resolve({ oppgaveId: id }));
}

function leggPåVent(id: string) {
    return påVentStub(
        lagRequest({ frist: '2030-01-01', skalTildeles: true, notattekst: null, årsaker: [] }),
        Promise.resolve({ oppgaveId: id }),
    );
}

function sendIRetur(id: string) {
    return sendIReturStub(lagRequest({ notatTekst: 'Må se på dette' }), Promise.resolve({ oppgaveId: id }));
}

function annuller(id: string) {
    return annullerStub(
        lagRequest({
            arbeidsgiverFagsystemId: 'ag',
            personFagsystemId: 'p',
            årsaker: [{ key: '1', årsak: 'Feil' }],
            kommentar: null,
        }),
        Promise.resolve({ vedtaksperiodeId: id }),
    );
}

async function hentPåVent() {
    const response = await paVentForPersonStub(lagRequest({}), Promise.resolve({ pseudoId: personPseudoId() }));
    return response.json();
}

async function hentAnnullering(vedtaksperiodeId: string) {
    const response = await annulleringStub(lagRequest({}), Promise.resolve({ vedtaksperiodeId }));
    return response.json();
}

function lagRequest(body: object): NextRequest {
    return new NextRequest('http://localhost/api/spesialist', { method: 'POST', body: JSON.stringify(body) });
}
