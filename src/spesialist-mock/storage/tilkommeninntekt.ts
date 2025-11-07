import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

import {
    ApiTilkommenInntekt,
    ApiTilkommenInntektEvent,
    ApiTilkommenInntektEventEndringer,
    ApiTilkommenInntektEventMetadata,
    ApiTilkommenInntektInput,
    ApiTilkommenInntektskilde,
} from '@/io/rest/generated/spesialist.schemas';

export class TilkommenInntektMock {
    static inntektskilder: Map<string, ApiTilkommenInntektskilde[]> = new Map();
    private static pseudoIdtoFødselsnummerMap: Map<string, string> = new Map();

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
            TilkommenInntektMock.pseudoIdtoFødselsnummerMap.set(
                tilkommenInntektMockFil.personPseudoId,
                tilkommenInntektMockFil.fodselsnummer,
            );
        });
    }

    static tilkomneInntektskilder = (pseudoId: string): ApiTilkommenInntektskilde[] => {
        const fødselsnummer = TilkommenInntektMock.pseudoIdtoFødselsnummerMap.get(pseudoId);
        if (fødselsnummer === undefined) {
            return [];
        }
        return TilkommenInntektMock.inntektskilder.get(fødselsnummer) ?? [];
    };

    static finnEllerLeggTilInntektskilde(
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

    static finnTilkommenInntektMedKontekst(tilkommenInntektId: string) {
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

    static utførEndring(
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

    static byggEventMetadata(
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

    static tilEventEndringer(
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
