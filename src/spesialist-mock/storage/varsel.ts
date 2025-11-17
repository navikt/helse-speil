import { ApiHttpProblemDetailsGetVarselErrorCode, ApiVarsel } from '@io/rest/generated/spesialist.schemas';

import { VarselDto } from '../schemaTypes';

export class VarselMock {
    private static varsler: VarselDto[] = [];

    static getVarsel = (varselIdString: string): ApiVarsel | ApiHttpProblemDetailsGetVarselErrorCode => {
        const varsel = VarselMock.varsler.find((varsel) => varsel.id === varselIdString);
        if (!varsel) {
            return {
                code: 'VARSEL_IKKE_FUNNET',
                status: 404,
                title: 'Varsel ikke funnet',
                type: 'about:blank',
            } as ApiHttpProblemDetailsGetVarselErrorCode;
        }
        return {
            id: varselIdString,
            tittel: varsel.tittel,
            forklaring: varsel.forklaring,
            handling: varsel.handling,
            definisjonId: varsel.definisjonId,
            status: varsel.vurdering?.status,
            vurdering: {
                ident: varsel.vurdering?.ident,
                tidsstempel: varsel.vurdering?.tidsstempel,
            },
        } as ApiVarsel;
    };

    static getVarslerForPeriode = (varsler: VarselDto[]): VarselDto[] => {
        if (varsler === undefined || varsler === null) return [];
        const varslerCopy = [...varsler];
        return varslerCopy.map((varsel) => {
            const varselMedEndring = this.varsler.find(
                (varselMedEndring) =>
                    varselMedEndring.generasjonId === varsel.generasjonId && varselMedEndring.kode === varsel.kode,
            );
            return varselMedEndring
                ? { ...varsel, definisjonId: varselMedEndring.definisjonId, vurdering: varselMedEndring.vurdering }
                : varsel;
        });
    };
    static leggTilEndretVarsel = (varsel: VarselDto): 'uendret' | 'endret' => {
        const funnetVarselIndex = VarselMock.varsler.findIndex((it) => it.id === varsel.id);
        const funnetVarsel = VarselMock.varsler[funnetVarselIndex];
        if (funnetVarsel) {
            VarselMock.varsler[funnetVarselIndex] = varsel;
            return funnetVarsel === varsel ? 'uendret' : 'endret';
        } else {
            VarselMock.varsler.push(varsel);
            return 'endret';
        }
    };
}
