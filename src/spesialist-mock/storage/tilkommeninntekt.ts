import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { v4 } from 'uuid';

import {
    ApiLeggTilTilkommenInntektResponse,
    ApiTilkommenInntekt,
    ApiTilkommenInntektEndretEvent,
    ApiTilkommenInntektEvent,
    ApiTilkommenInntektEventEndringer,
    ApiTilkommenInntektEventMetadata,
    ApiTilkommenInntektFjernetEvent,
    ApiTilkommenInntektGjenopprettetEvent,
    ApiTilkommenInntektInput,
    ApiTilkommenInntektOpprettetEvent,
    ApiTilkommenInntektskilde,
} from '@/io/rest/generated/spesialist.schemas';

export class TilkommenInntektMock {
    private static inntektskilder: Map<string, ApiTilkommenInntektskilde[]> = new Map();
    private static aktørIdToFødselsnummerMap: Map<string, string> = new Map();

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
            TilkommenInntektMock.aktørIdToFødselsnummerMap.set(
                tilkommenInntektMockFil.aktorId,
                tilkommenInntektMockFil.fodselsnummer,
            );
        });
    }

    static leggTilTilkommenInntekt = (
        fødselsnummer: string,
        notatTilBeslutter: string,
        verdier: ApiTilkommenInntektInput,
    ): ApiLeggTilTilkommenInntektResponse => {
        const nyTilkommenInntektId = v4();
        if (TilkommenInntektMock.inntektskilder.get(fødselsnummer) === undefined) {
            TilkommenInntektMock.inntektskilder.set(fødselsnummer, []);
        }
        const tilkommenInntektskilde = TilkommenInntektMock.finnEllerLeggTilInntektskilde(
            verdier.organisasjonsnummer,
            TilkommenInntektMock.inntektskilder.get(fødselsnummer) ?? [],
        );
        const inntekt: ApiTilkommenInntekt = {
            ekskluderteUkedager: verdier.ekskluderteUkedager,
            erDelAvAktivTotrinnsvurdering: true,
            events: [
                {
                    type: 'ApiTilkommenInntektOpprettetEvent',
                    metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, []),
                    ekskluderteUkedager: verdier.ekskluderteUkedager,
                    organisasjonsnummer: verdier.organisasjonsnummer,
                    periode: verdier.periode,
                    periodebelop: verdier.periodebelop,
                } as ApiTilkommenInntektOpprettetEvent,
            ],
            fjernet: false,
            periode: verdier.periode,
            periodebelop: verdier.periodebelop,
            tilkommenInntektId: nyTilkommenInntektId,
        };
        tilkommenInntektskilde.inntekter.push(inntekt);

        return { tilkommenInntektId: nyTilkommenInntektId };
    };

    static tilkomneInntektskilder = (aktørId: string): ApiTilkommenInntektskilde[] => {
        const fødselsnummer = TilkommenInntektMock.aktørIdToFødselsnummerMap.get(aktørId);
        if (fødselsnummer === undefined) {
            return [];
        }
        return TilkommenInntektMock.inntektskilder.get(fødselsnummer) ?? [];
    };

    static endreTilkommenInntekt = (
        endretTil: ApiTilkommenInntektInput,
        notatTilBeslutter: string,
        tilkommenInntektId: string,
    ): boolean => {
        const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
        if (tilkommenInntektMedKontekst === undefined) return false;
        const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

        inntekt.events.push({
            type: 'ApiTilkommenInntektEndretEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, inntekt.events),
            endringer: TilkommenInntektMock.tilEventEndringer(inntekt, inntektskilde.organisasjonsnummer, endretTil),
        } as ApiTilkommenInntektEndretEvent);

        TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, endretTil);

        return true;
    };

    static fjernTilkommenInntekt = (notatTilBeslutter: string, tilkommenInntektId: string): boolean => {
        const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
        if (tilkommenInntektMedKontekst === undefined) return false;
        const { inntekt } = tilkommenInntektMedKontekst;

        inntekt.events.push({
            type: 'ApiTilkommenInntektFjernetEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, inntekt.events),
        } as ApiTilkommenInntektFjernetEvent);

        inntekt.fjernet = true;

        return true;
    };

    static gjenopprettTilkommenInntekt = (
        endretTil: ApiTilkommenInntektInput,
        notatTilBeslutter: string,
        tilkommenInntektId: string,
    ): boolean => {
        const tilkommenInntektMedKontekst = TilkommenInntektMock.finnTilkommenInntektMedKontekst(tilkommenInntektId);
        if (tilkommenInntektMedKontekst === undefined) return false;
        const { inntekt, inntektskilde, inntektskilder } = tilkommenInntektMedKontekst;

        inntekt.events.push({
            type: 'ApiTilkommenInntektGjenopprettetEvent',
            metadata: TilkommenInntektMock.byggEventMetadata(notatTilBeslutter, inntekt.events),
            endringer: TilkommenInntektMock.tilEventEndringer(inntekt, inntektskilde.organisasjonsnummer, endretTil),
        } as ApiTilkommenInntektGjenopprettetEvent);

        TilkommenInntektMock.utførEndring(inntekt, inntektskilde, inntektskilder, endretTil);
        inntekt.fjernet = false;

        return true;
    };

    private static finnEllerLeggTilInntektskilde(
        organisasjonsnummer: string,
        inntektskilder: ApiTilkommenInntektskilde[],
    ): ApiTilkommenInntektskilde {
        const eksisterende = inntektskilder.find(
            (eksisterendeInntektskilde: ApiTilkommenInntektskilde) =>
                eksisterendeInntektskilde.organisasjonsnummer == organisasjonsnummer,
        );
        const inntektskilde = eksisterende ?? {
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
        inntekt: ApiTilkommenInntekt,
        inntektskilde: ApiTilkommenInntektskilde,
        inntektskilder: ApiTilkommenInntektskilde[],
        endretTil: ApiTilkommenInntektInput,
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
        eksisterendeEvents: ApiTilkommenInntektEvent[],
    ): ApiTilkommenInntektEventMetadata {
        return {
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
        tilkommenInntekt: ApiTilkommenInntekt,
        organisasjonsnummer: string,
        endretTil: ApiTilkommenInntektInput,
    ): ApiTilkommenInntektEventEndringer {
        return {
            ekskluderteUkedager: !TilkommenInntektMock.erLikeSett(
                tilkommenInntekt.ekskluderteUkedager,
                endretTil.ekskluderteUkedager,
            )
                ? {
                      fra: tilkommenInntekt.ekskluderteUkedager,
                      til: endretTil.ekskluderteUkedager,
                  }
                : null,
            organisasjonsnummer:
                organisasjonsnummer !== endretTil.organisasjonsnummer
                    ? {
                          fra: organisasjonsnummer,
                          til: endretTil.organisasjonsnummer,
                      }
                    : null,
            periode:
                tilkommenInntekt.periode.fom !== endretTil.periode.fom ||
                tilkommenInntekt.periode.tom !== endretTil.periode.tom
                    ? {
                          fra: {
                              fom: tilkommenInntekt.periode.fom,
                              tom: tilkommenInntekt.periode.tom,
                          },
                          til: {
                              fom: endretTil.periode.fom,
                              tom: endretTil.periode.tom,
                          },
                      }
                    : null,
            periodebelop:
                Number(tilkommenInntekt.periodebelop) !== Number(endretTil.periodebelop)
                    ? {
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
