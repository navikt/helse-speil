import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { v4 } from 'uuid';

import {
    LeggTilTilkommenInntektResponse,
    TilkommenInntekt,
    TilkommenInntektEndretEvent,
    TilkommenInntektEvent,
    TilkommenInntektEventEndringer,
    TilkommenInntektEventMetadata,
    TilkommenInntektFjernetEvent,
    TilkommenInntektGjenopprettetEvent,
    TilkommenInntektInput,
    TilkommenInntektOpprettetEvent,
    TilkommenInntektskilde,
} from '@spesialist-mock/schemaTypes';

export class TilkommenInntektMock {
    private static inntektskilder: Map<string, Array<TilkommenInntektskilde>> = new Map();

    static {
        const url = path.join(cwd(), 'src/spesialist-mock/data/tilkommenInntekt');
        const filenames = fs.readdirSync(url);
        const tilkommenInntektMockFiler = filenames.map((filename) => {
            const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
            return JSON.parse(raw);
        });

        tilkommenInntektMockFiler.forEach((tilkommenInntektMockFil) => {
            TilkommenInntektMock.inntektskilder.set(
                tilkommenInntektMockFil.fodselsnummer,
                tilkommenInntektMockFil.data.tilkomneInntektskilder,
            );
        });
    }

    static leggTilTilkommenInntekt = (
        fødselsnummer: string,
        notatTilBeslutter: string,
        verdier: TilkommenInntektInput,
    ): LeggTilTilkommenInntektResponse => {
        const nyTilkommenInntektId = v4();
        const tilkommenInntektskilde = TilkommenInntektMock.finnEllerLeggTilInntektskilde(
            verdier.organisasjonsnummer,
            TilkommenInntektMock.inntektskilder.get(fødselsnummer) ?? [],
        );
        const inntekt: TilkommenInntekt = {
            __typename: 'TilkommenInntekt',
            ekskluderteUkedager: verdier.ekskluderteUkedager,
            erDelAvAktivTotrinnsvurdering: true,
            events: [
                {
                    __typename: 'TilkommenInntektOpprettetEvent',
                    metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, []),
                    ekskluderteUkedager: verdier.ekskluderteUkedager,
                    organisasjonsnummer: verdier.organisasjonsnummer,
                    periode: verdier.periode,
                    periodebelop: verdier.periodebelop,
                } as TilkommenInntektOpprettetEvent,
            ],
            fjernet: false,
            periode: verdier.periode,
            periodebelop: verdier.periodebelop,
            tilkommenInntektId: nyTilkommenInntektId,
        };
        tilkommenInntektskilde.inntekter.push(inntekt);

        return { __typename: 'LeggTilTilkommenInntektResponse', tilkommenInntektId: nyTilkommenInntektId };
    };

    static tilkomneInntektskilderV2 = (fødselsnummer: string): Array<TilkommenInntektskilde> => {
        return TilkommenInntektMock.inntektskilder.get(fødselsnummer) ?? [];
    };

    static endreTilkommenInntekt = (
        endretTil: TilkommenInntektInput,
        notatTilBeslutter: string,
        tilkommenInntektId: string,
    ): boolean => {
        const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
        if (tilkommenInntektMedKontekst === undefined) return false;
        const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

        inntekt.events.push({
            __typename: 'TilkommenInntektEndretEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, inntekt.events),
            endringer: TilkommenInntektMock.tilEventEndringer(inntekt, inntektskilde.organisasjonsnummer, endretTil),
        } as TilkommenInntektEndretEvent);

        TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, endretTil);

        return true;
    };

    static fjernTilkommenInntekt = (notatTilBeslutter: string, tilkommenInntektId: string): boolean => {
        const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
        if (tilkommenInntektMedKontekst === undefined) return false;
        const { inntekt } = tilkommenInntektMedKontekst;

        inntekt.events.push({
            __typename: 'TilkommenInntektFjernetEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, inntekt.events),
        } as TilkommenInntektFjernetEvent);

        inntekt.fjernet = true;

        return true;
    };

    static gjenopprettTilkommenInntekt = (
        endretTil: TilkommenInntektInput,
        notatTilBeslutter: string,
        tilkommenInntektId: string,
    ): boolean => {
        const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
        if (tilkommenInntektMedKontekst === undefined) return false;
        const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

        inntekt.events.push({
            __typename: 'TilkommenInntektGjenopprettetEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, inntekt.events),
            endringer: TilkommenInntektMock.tilEventEndringer(inntekt, inntektskilde.organisasjonsnummer, endretTil),
        } as TilkommenInntektGjenopprettetEvent);

        TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, endretTil);
        inntekt.fjernet = false;

        return true;
    };

    private static finnEllerLeggTilInntektskilde(
        organisasjonsnummer: string,
        inntektskilder: TilkommenInntektskilde[],
    ) {
        const eksisterende = inntektskilder.find(
            (eksisterendeInntektskilde: TilkommenInntektskilde) =>
                eksisterendeInntektskilde.organisasjonsnummer == organisasjonsnummer,
        );
        const inntektskilde = eksisterende ?? {
            __typename: 'TilkommenInntektskilde',
            organisasjonsnummer: organisasjonsnummer,
            inntekter: [],
        };
        if (!eksisterende) {
            inntektskilder.push(inntektskilde);
        }
        return inntektskilde;
    }

    private static finnTilkommenInntektMedKontekst(tilkommenInntektId: string) {
        return TilkommenInntektMock.inntektskilder
            .values()
            .flatMap((inntektskilder) =>
                inntektskilder.map((inntektskilde) => {
                    return {
                        inntektskilde: inntektskilde,
                        inntektskilder: inntektskilder,
                    };
                }),
            )
            .flatMap(({ inntektskilde, inntektskilder }) =>
                inntektskilde.inntekter.map((inntekt) => ({
                    inntekt: inntekt,
                    inntektskilde: inntektskilde,
                    inntektskilder: inntektskilder,
                })),
            )
            .find(({ inntekt }) => inntekt.tilkommenInntektId === tilkommenInntektId);
    }

    private static utførEndring(
        inntekt: TilkommenInntekt,
        inntektskilde: TilkommenInntektskilde,
        inntektskilder: TilkommenInntektskilde[],
        endretTil: TilkommenInntektInput,
    ) {
        inntekt.periode.fom = endretTil.periode.fom;
        inntekt.periode.tom = endretTil.periode.tom;
        inntekt.periodebelop = endretTil.periodebelop;
        inntekt.ekskluderteUkedager = endretTil.ekskluderteUkedager;
        if (endretTil.organisasjonsnummer !== inntektskilde.organisasjonsnummer) {
            inntektskilde.inntekter.splice(inntektskilde.inntekter.indexOf(inntekt), 1);
            if (inntektskilde.inntekter.length === 0) {
                inntektskilder.splice(inntektskilder.indexOf(inntektskilde), 1);
            }
            TilkommenInntektMock.finnEllerLeggTilInntektskilde(
                endretTil.organisasjonsnummer,
                inntektskilder,
            ).inntekter.push(inntekt);
        }
    }

    private static byggEventMetadata(
        notatTilBeslutter: string,
        eksisterendeEvents: TilkommenInntektEvent[],
    ): TilkommenInntektEventMetadata {
        return {
            __typename: 'TilkommenInntektEventMetadata',
            notatTilBeslutter: notatTilBeslutter,
            sekvensnummer:
                eksisterendeEvents.length == 0
                    ? 1
                    : Math.max(...eksisterendeEvents.map((it) => it.metadata.sekvensnummer)) + 1,
            tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            utfortAvSaksbehandlerIdent: 'a1234567',
        };
    }

    private static tilEventEndringer(
        tilkommenInntekt: TilkommenInntekt,
        organisasjonsnummer: string,
        endretTil: TilkommenInntektInput,
    ): TilkommenInntektEventEndringer {
        return {
            __typename: 'TilkommenInntektEventEndringer',
            ekskluderteUkedager: !TilkommenInntektMock.erLikeSett(
                tilkommenInntekt.ekskluderteUkedager,
                endretTil.ekskluderteUkedager,
            )
                ? {
                      __typename: 'TilkommenInntektEventListLocalDateEndring',
                      fra: tilkommenInntekt.ekskluderteUkedager,
                      til: endretTil.ekskluderteUkedager,
                  }
                : null,
            organisasjonsnummer:
                organisasjonsnummer !== endretTil.organisasjonsnummer
                    ? {
                          __typename: 'TilkommenInntektEventStringEndring',
                          fra: organisasjonsnummer,
                          til: endretTil.organisasjonsnummer,
                      }
                    : null,
            periode:
                tilkommenInntekt.periode.fom !== endretTil.periode.fom ||
                tilkommenInntekt.periode.tom !== endretTil.periode.tom
                    ? {
                          __typename: 'TilkommenInntektEventDatoPeriodeEndring',
                          fra: {
                              __typename: 'DatoPeriode',
                              fom: tilkommenInntekt.periode.fom,
                              tom: tilkommenInntekt.periode.tom,
                          },
                          til: {
                              __typename: 'DatoPeriode',
                              fom: endretTil.periode.fom,
                              tom: endretTil.periode.tom,
                          },
                      }
                    : null,
            periodebelop:
                Number(tilkommenInntekt.periodebelop) !== Number(endretTil.periodebelop)
                    ? {
                          __typename: 'TilkommenInntektEventBigDecimalEndring',
                          fra: tilkommenInntekt.periodebelop,
                          til: endretTil.periodebelop,
                      }
                    : null,
        };
    }

    private static erLikeSett(a: string[], b: string[]) {
        const setA = new Set(a);
        const setB = new Set(b);
        return setA.size === setB.size && setA.values().every((value) => setB.has(value));
    }
}
