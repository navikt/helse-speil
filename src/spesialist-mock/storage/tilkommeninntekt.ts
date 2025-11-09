import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

import {
    ApiTilkommenInntekt,
    ApiTilkommenInntektEvent,
    ApiTilkommenInntektEventEndringer,
    ApiTilkommenInntektEventMetadata,
    ApiTilkommenInntektPatchApiTilkommenInntektEndringer,
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
        endringer: ApiTilkommenInntektPatchApiTilkommenInntektEndringer,
    ) {
        if (endringer.organisasjonsnummer) {
            inntektskilde.inntekter.splice(inntektskilde.inntekter.indexOf(inntekt), 1);
            if (inntektskilde.inntekter.length === 0) {
                inntektskilder.splice(inntektskilder.indexOf(inntektskilde), 1);
            }
            TilkommenInntektMock.finnEllerLeggTilInntektskilde(
                endringer.organisasjonsnummer.til,
                inntektskilder,
            ).inntekter.push(inntekt);
        }
        if (endringer.periode) {
            inntekt.periode.fom = endringer.periode.til.fom;
            inntekt.periode.tom = endringer.periode.til.tom;
        }
        if (endringer.periodebeløp) {
            inntekt.periodebelop = endringer.periodebeløp.til;
        }
        if (endringer.ekskluderteUkedager) {
            inntekt.ekskluderteUkedager = endringer.ekskluderteUkedager.til;
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
        endringer: ApiTilkommenInntektPatchApiTilkommenInntektEndringer,
    ): ApiTilkommenInntektEventEndringer {
        return {
            ekskluderteUkedager:
                endringer.ekskluderteUkedager &&
                !TilkommenInntektMock.erLikeSett(endringer.ekskluderteUkedager.fra, endringer.ekskluderteUkedager.til)
                    ? {
                          fra: endringer.ekskluderteUkedager.fra,
                          til: endringer.ekskluderteUkedager.til,
                      }
                    : null,
            organisasjonsnummer:
                endringer.organisasjonsnummer && endringer.organisasjonsnummer.fra !== endringer.organisasjonsnummer.til
                    ? {
                          fra: endringer.organisasjonsnummer.fra,
                          til: endringer.organisasjonsnummer.til,
                      }
                    : null,
            periode:
                endringer.periode &&
                (endringer.periode.fra.fom !== endringer.periode.til.fom ||
                    endringer.periode.fra.tom !== endringer.periode.til.tom)
                    ? {
                          fra: {
                              fom: endringer.periode.fra.fom,
                              tom: endringer.periode.fra.tom,
                          },
                          til: {
                              fom: endringer.periode.til.fom,
                              tom: endringer.periode.til.tom,
                          },
                      }
                    : null,
            periodebelop:
                endringer.periodebeløp && Number(endringer.periodebeløp.fra) !== Number(endringer.periodebeløp.til)
                    ? {
                          fra: endringer.periodebeløp.fra,
                          til: endringer.periodebeløp.til,
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
