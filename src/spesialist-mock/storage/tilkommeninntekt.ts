import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { v4 } from 'uuid';

import {
    LeggTilTilkommenInntektResponse,
    TilkommenInntekt,
    TilkommenInntektEndretEvent,
    TilkommenInntektEventEndringer,
    TilkommenInntektFjernetEvent,
    TilkommenInntektGjenopprettetEvent,
    TilkommenInntektInput,
    TilkommenInntektOpprettetEvent,
    TilkommenInntektskilde,
} from '@spesialist-mock/schemaTypes';

export class TilkommenInntektMock {
    private static tilkomneInntektskilder: Map<string, Array<TilkommenInntektskilde>> = new Map();

    static {
        const url = path.join(cwd(), 'src/spesialist-mock/data/tilkommenInntekt');
        const filenames = fs.readdirSync(url);
        const tilkommenInntektMockFiler = filenames.map((filename) => {
            const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
            return JSON.parse(raw);
        });

        tilkommenInntektMockFiler.forEach((tilkommenInntektMockFil) => {
            TilkommenInntektMock.tilkomneInntektskilder.set(
                tilkommenInntektMockFil.fodselsnummer,
                tilkommenInntektMockFil.data.tilkomneInntektskilder,
            );
        });
    }

    static getTilkomneInntektskilder = (fødselsnummer: string): Array<TilkommenInntektskilde> => {
        return TilkommenInntektMock.tilkomneInntektskilder.get(fødselsnummer) ?? [];
    };

    static fjernTilkommenInntekt = (notatTilBeslutter: string, tilkommenInntektId: string): void => {
        TilkommenInntektMock.tilkomneInntektskilder
            .values()
            .flatMap((liste) => liste)
            .flatMap((tilkommenInntektskilde) => tilkommenInntektskilde.inntekter)
            .filter((inntekt) => inntekt.tilkommenInntektId === tilkommenInntektId)
            .forEach((inntekt) => {
                const høyesteSekvensnummer = Math.max(...inntekt.events.map((it) => it.metadata.sekvensnummer));
                const event: TilkommenInntektFjernetEvent = {
                    __typename: 'TilkommenInntektFjernetEvent',
                    metadata: {
                        __typename: 'TilkommenInntektEventMetadata',
                        notatTilBeslutter: notatTilBeslutter,
                        sekvensnummer: høyesteSekvensnummer + 1,
                        tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                        utfortAvSaksbehandlerIdent: 'a1234567',
                    },
                };
                inntekt.events.push(event);
                inntekt.fjernet = true;
            });
    };

    static addTilkommenInntekt = (
        fødselsnummer: string,
        notatTilBeslutter: string,
        verdier: TilkommenInntektInput,
    ): LeggTilTilkommenInntektResponse => {
        const nyTilkommenInntektId = v4();
        const tilkomneInntektskilder = TilkommenInntektMock.getTilkomneInntektskilder(fødselsnummer);
        const eksisterende = tilkomneInntektskilder.find(
            (eksisterendeInntektskilde: TilkommenInntektskilde) =>
                eksisterendeInntektskilde.organisasjonsnummer == verdier.organisasjonsnummer,
        );
        const tilkommenInntektskilde = eksisterende ?? {
            __typename: 'TilkommenInntektskilde',
            organisasjonsnummer: verdier.organisasjonsnummer,
            inntekter: [],
        };
        if (!eksisterende) {
            tilkomneInntektskilder.push(tilkommenInntektskilde);
        }
        const event: TilkommenInntektOpprettetEvent = {
            __typename: 'TilkommenInntektOpprettetEvent',
            metadata: {
                __typename: 'TilkommenInntektEventMetadata',
                notatTilBeslutter: notatTilBeslutter,
                sekvensnummer: 1,
                tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                utfortAvSaksbehandlerIdent: 'a1234567',
            },
            ekskluderteUkedager: verdier.ekskluderteUkedager,
            organisasjonsnummer: verdier.organisasjonsnummer,
            periode: verdier.periode,
            periodebelop: verdier.periodebelop,
        };
        tilkommenInntektskilde.inntekter.push({
            __typename: 'TilkommenInntekt',
            ekskluderteUkedager: verdier.ekskluderteUkedager,
            events: [event],
            fjernet: false,
            periode: verdier.periode,
            periodebelop: verdier.periodebelop,
            tilkommenInntektId: nyTilkommenInntektId,
        });
        return { __typename: 'LeggTilTilkommenInntektResponse', tilkommenInntektId: nyTilkommenInntektId };
    };

    static endreTilkommenInntekt = (
        endretTil: TilkommenInntektInput,
        notatTilBeslutter: string,
        tilkommenInntektId: string,
    ): void => {
        const inntektMedOrganisasjonsnummer = TilkommenInntektMock.tilkomneInntektskilder
            .values()
            .flatMap((liste) => liste)
            .flatMap((tilkommenInntektskilde) =>
                tilkommenInntektskilde.inntekter.map((tilkommenInntekt) => ({
                    organisasjonsnummer: tilkommenInntektskilde.organisasjonsnummer,
                    tilkommenInntekt: tilkommenInntekt,
                })),
            )
            .find(
                (inntektMedOrganisasjonsnummer) =>
                    inntektMedOrganisasjonsnummer.tilkommenInntekt.tilkommenInntektId === tilkommenInntektId,
            );
        if (inntektMedOrganisasjonsnummer === undefined) return;
        const { organisasjonsnummer, tilkommenInntekt } = inntektMedOrganisasjonsnummer;
        const høyesteSekvensnummer = Math.max(...tilkommenInntekt.events.map((it) => it.metadata.sekvensnummer));
        const event: TilkommenInntektEndretEvent = {
            __typename: 'TilkommenInntektEndretEvent',
            metadata: {
                __typename: 'TilkommenInntektEventMetadata',
                notatTilBeslutter: notatTilBeslutter,
                sekvensnummer: høyesteSekvensnummer + 1,
                tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                utfortAvSaksbehandlerIdent: 'a1234567',
            },
            endringer: this.tilEventEndringer(tilkommenInntekt, endretTil, organisasjonsnummer),
        };
        tilkommenInntekt.events.push(event);
        tilkommenInntekt.periode.fom = endretTil.periode.fom;
        tilkommenInntekt.periode.tom = endretTil.periode.tom;
        tilkommenInntekt.periodebelop = endretTil.periodebelop;
        tilkommenInntekt.ekskluderteUkedager = endretTil.ekskluderteUkedager;
        if (endretTil.organisasjonsnummer !== organisasjonsnummer) {
            // Flytt til annen inntektskilde
        }
    };

    static gjenopprettTilkommenInntekt = (
        endretTil: TilkommenInntektInput,
        notatTilBeslutter: string,
        tilkommenInntektId: string,
    ): void => {
        const inntektMedOrganisasjonsnummer = TilkommenInntektMock.tilkomneInntektskilder
            .values()
            .flatMap((liste) => liste)
            .flatMap((tilkommenInntektskilde) =>
                tilkommenInntektskilde.inntekter.map((tilkommenInntekt) => ({
                    organisasjonsnummer: tilkommenInntektskilde.organisasjonsnummer,
                    tilkommenInntekt: tilkommenInntekt,
                })),
            )
            .find(
                (inntektMedOrganisasjonsnummer) =>
                    inntektMedOrganisasjonsnummer.tilkommenInntekt.tilkommenInntektId === tilkommenInntektId,
            );
        if (inntektMedOrganisasjonsnummer === undefined) return;
        const { organisasjonsnummer, tilkommenInntekt } = inntektMedOrganisasjonsnummer;
        const høyesteSekvensnummer = Math.max(...tilkommenInntekt.events.map((it) => it.metadata.sekvensnummer));
        const event: TilkommenInntektGjenopprettetEvent = {
            __typename: 'TilkommenInntektGjenopprettetEvent',
            metadata: {
                __typename: 'TilkommenInntektEventMetadata',
                notatTilBeslutter: notatTilBeslutter,
                sekvensnummer: høyesteSekvensnummer + 1,
                tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                utfortAvSaksbehandlerIdent: 'a1234567',
            },
            endringer: this.tilEventEndringer(tilkommenInntekt, endretTil, organisasjonsnummer),
        };
        tilkommenInntekt.events.push(event);
        tilkommenInntekt.periode.fom = endretTil.periode.fom;
        tilkommenInntekt.periode.tom = endretTil.periode.tom;
        tilkommenInntekt.periodebelop = endretTil.periodebelop;
        tilkommenInntekt.ekskluderteUkedager = endretTil.ekskluderteUkedager;
        if (endretTil.organisasjonsnummer !== organisasjonsnummer) {
            // Flytt til annen inntektskilde
        }
        tilkommenInntekt.fjernet = false;
    };

    private static tilEventEndringer(
        tilkommenInntekt: TilkommenInntekt,
        endretTil: TilkommenInntektInput,
        organisasjonsnummer: string,
    ): TilkommenInntektEventEndringer {
        return {
            __typename: 'TilkommenInntektEventEndringer',
            ekskluderteUkedager:
                tilkommenInntekt.ekskluderteUkedager !== endretTil.ekskluderteUkedager
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
                tilkommenInntekt.periodebelop !== endretTil.periodebelop
                    ? {
                          __typename: 'TilkommenInntektEventBigDecimalEndring',
                          fra: tilkommenInntekt.periodebelop,
                          til: endretTil.periodebelop,
                      }
                    : null,
        };
    }
}
