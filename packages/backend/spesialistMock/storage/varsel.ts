import dayjs from 'dayjs';

import { MutationSettStatusAktivArgs, MutationSettStatusVurdertArgs, VarselDto, Varselstatus } from '../schemaTypes';

const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export class VarselMock {
    private static varslerMedEndring: Array<VarselDto> = new Array<VarselDto>();

    static getVarslerForPeriode = (varsler: Array<VarselDto>): Array<VarselDto> => {
        const varslerCopy = [...varsler];
        return varslerCopy.map((varsel) => {
            const varselMedEndring = this.varslerMedEndring.find(
                (varselMedEndring) =>
                    varselMedEndring.generasjonId === varsel.generasjonId && varselMedEndring.kode === varsel.kode
            );
            return varselMedEndring
                ? { ...varsel, definisjonId: varselMedEndring.definisjonId, vurdering: varselMedEndring.vurdering }
                : varsel;
        });
    };

    static settStatusVurdert = ({ generasjonId, definisjonId, varselkode, ident }: MutationSettStatusVurdertArgs) => {
        const { varselMedEndring, index } = this.findWithIndex(
            this.varslerMedEndring,
            (varselMedEndring) => varselMedEndring.generasjonId === generasjonId && varselMedEndring.kode === varselkode
        );

        let varselMedVurdering: VarselDto = varselMedEndring
            ? {
                  ...varselMedEndring,
                  vurdering: {
                      status: Varselstatus.Vurdert,
                      ident: ident,
                      tidsstempel: dayjs().format(ISO_TIDSPUNKTFORMAT),
                  },
              }
            : {
                  definisjonId,
                  generasjonId,
                  kode: varselkode,
                  tittel: '',
                  forklaring: null,
                  handling: null,
                  vurdering: {
                      status: Varselstatus.Vurdert,
                      ident: ident,
                      tidsstempel: dayjs().format(ISO_TIDSPUNKTFORMAT),
                  },
              };
        if (index !== -1) {
            this.varslerMedEndring[index] = varselMedVurdering;
        } else {
            this.varslerMedEndring.push(varselMedVurdering);
        }
    };

    static settStatusAktiv = ({ generasjonId, varselkode, ident }: MutationSettStatusAktivArgs) => {
        const { varselMedEndring, index } = this.findWithIndex(
            this.varslerMedEndring,
            (varselMedEndring) => varselMedEndring.generasjonId === generasjonId && varselMedEndring.kode === varselkode
        );
        this.varslerMedEndring[index] = varselMedEndring
            ? {
                  ...varselMedEndring,
                  vurdering: {
                      status: Varselstatus.Aktiv,
                      ident: ident,
                      tidsstempel: dayjs().format(ISO_TIDSPUNKTFORMAT),
                  },
              }
            : {
                  definisjonId: '',
                  generasjonId,
                  kode: varselkode,
                  tittel: '',
                  forklaring: null,
                  handling: null,
                  vurdering: {
                      status: Varselstatus.Aktiv,
                      ident: ident,
                      tidsstempel: dayjs().format(ISO_TIDSPUNKTFORMAT),
                  },
              };
    };

    static findWithIndex = (arr: Array<VarselDto>, predicate: (varsel: VarselDto) => boolean) => {
        const index = arr.findIndex(predicate);

        return {
            varselMedEndring: index !== -1 ? arr[index] : null,
            index,
        };
    };
}