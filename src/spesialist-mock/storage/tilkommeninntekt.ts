import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { v4 } from 'uuid';

import { LeggTilTilkommenInntektResponse, TilkommenInntektFjernetEvent, TilkommenInntektInput } from '@io/graphql';
import { TilkommenInntektOpprettetEvent, TilkommenInntektskilde } from '@spesialist-mock/schemaTypes';

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
}
