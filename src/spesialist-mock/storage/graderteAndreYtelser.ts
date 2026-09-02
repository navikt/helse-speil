import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserEvent,
    ApiGraderteAndreYtelserEventEndringer,
    ApiGraderteAndreYtelserEventMetadata,
    ApiGraderteAndreYtelserPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

export class GraderteAndreYtelserMock {
    static ytelser: Map<string, ApiGraderteAndreYtelser[]> = new Map();

    static {
        const url = path.join(cwd(), 'src/spesialist-mock/data/graderteAndreYtelser');
        const filenames = fs.readdirSync(url);
        const graderteAndreYtelserMockFiler = filenames.map((filename) => {
            const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
            return JSON.parse(raw);
        });

        graderteAndreYtelserMockFiler.forEach((graderteAndreYtelserMockFil) => {
            GraderteAndreYtelserMock.ytelser.set(
                graderteAndreYtelserMockFil.fodselsnummer,
                graderteAndreYtelserMockFil.data.graderteAndreYtelser,
            );
        });
    }

    static forPseudoId = (pseudoId: string): ApiGraderteAndreYtelser[] => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
        if (fødselsnummer === null) {
            return [];
        }
        return GraderteAndreYtelserMock.ytelser.get(fødselsnummer) ?? [];
    };

    static leggTil = (fødselsnummer: string, ytelse: ApiGraderteAndreYtelser): void => {
        const eksisterende = GraderteAndreYtelserMock.ytelser.get(fødselsnummer);
        if (eksisterende === undefined) {
            GraderteAndreYtelserMock.ytelser.set(fødselsnummer, [ytelse]);
            return;
        }
        eksisterende.push(ytelse);
    };

    static finn = (andreYtelserId: string): ApiGraderteAndreYtelser | undefined =>
        [...GraderteAndreYtelserMock.ytelser.values()]
            .flat()
            .find((ytelse) => ytelse.andreYtelserId === andreYtelserId);

    static endre = (
        andreYtelserId: string,
        endringer: Pick<ApiGraderteAndreYtelser, 'perioder' | 'andreYtelserType'>,
    ): ApiGraderteAndreYtelser | undefined => {
        const ytelse = GraderteAndreYtelserMock.finn(andreYtelserId);
        if (ytelse === undefined) return undefined;

        ytelse.perioder = endringer.perioder;
        ytelse.andreYtelserType = endringer.andreYtelserType;
        return ytelse;
    };

    static settFjernet = (andreYtelserId: string, fjernet: boolean): ApiGraderteAndreYtelser | undefined => {
        const ytelse = GraderteAndreYtelserMock.finn(andreYtelserId);
        if (ytelse === undefined) return undefined;

        ytelse.fjernet = fjernet;
        return ytelse;
    };

    static byggEventMetadata = (
        notatTilBeslutter: string,
        eksisterendeEvents: ApiGraderteAndreYtelserEvent[],
    ): ApiGraderteAndreYtelserEventMetadata => ({
        notatTilBeslutter: notatTilBeslutter,
        sekvensnummer:
            eksisterendeEvents.length === 0
                ? 1
                : Math.max(...eksisterendeEvents.map((it) => it.metadata.sekvensnummer)) + 1,
        tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        utfortAvSaksbehandlerIdent: 'a1234567',
    });

    static tilEventEndringer = (
        fra: Pick<ApiGraderteAndreYtelser, 'perioder' | 'andreYtelserType'>,
        til: Pick<ApiGraderteAndreYtelser, 'perioder' | 'andreYtelserType'>,
    ): ApiGraderteAndreYtelserEventEndringer => ({
        andreYtelserType:
            fra.andreYtelserType !== til.andreYtelserType
                ? { fra: fra.andreYtelserType, til: til.andreYtelserType }
                : null,
        perioder: !GraderteAndreYtelserMock.erLikePerioder(fra.perioder, til.perioder)
            ? {
                  fra: fra.perioder.map(GraderteAndreYtelserMock.tilGradertAnnenYtelse),
                  til: til.perioder.map(GraderteAndreYtelserMock.tilGradertAnnenYtelse),
              }
            : null,
    });

    static harEndringer = (endringer: ApiGraderteAndreYtelserEventEndringer): boolean =>
        endringer.andreYtelserType != null || endringer.perioder != null;

    private static tilGradertAnnenYtelse = (periode: ApiGraderteAndreYtelserPeriode) => ({
        periode: { fom: periode.fom, tom: periode.tom },
        grad: periode.grad,
    });

    private static erLikePerioder = (a: ApiGraderteAndreYtelserPeriode[], b: ApiGraderteAndreYtelserPeriode[]) =>
        a.length === b.length &&
        a.every((periode, index) => {
            const annen = b[index];
            return (
                annen !== undefined &&
                periode.fom === annen.fom &&
                periode.tom === annen.tom &&
                periode.grad === annen.grad
            );
        });
}
