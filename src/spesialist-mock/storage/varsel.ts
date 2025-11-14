import dayjs from 'dayjs';
import { GraphQLError } from 'graphql';

import { PersonFragment } from '@io/graphql';
import { ApiHttpProblemDetailsGetVarselErrorCode, ApiVarsel } from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';

import { MutationSettVarselstatusArgs, Person, VarselDto, Varselstatus } from '../schemaTypes';

const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

export class VarselMock {
    private static varslerMedEndring: VarselDto[] = [];

    static getVarsel = (varselIdString: string): ApiVarsel | ApiHttpProblemDetailsGetVarselErrorCode => {
        const varsel = VarselMock.varslerMedEndring.find((varsel) => varsel.id === varselIdString);
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
            const varselMedEndring = this.varslerMedEndring.find(
                (varselMedEndring) =>
                    varselMedEndring.generasjonId === varsel.generasjonId && varselMedEndring.kode === varsel.kode,
            );
            return varselMedEndring
                ? { ...varsel, definisjonId: varselMedEndring.definisjonId, vurdering: varselMedEndring.vurdering }
                : varsel;
        });
    };

    static settVarselstatusVurdert = (
        { generasjonIdString, definisjonIdString, varselkode, ident }: MutationSettVarselstatusArgs,
        person?: Person,
    ): VarselDto | GraphQLError => {
        const gjeldendeVarsel = finnAlleInntektsforhold((person as PersonFragment) ?? null)
            .flatMap((arbeidsgiver) =>
                arbeidsgiver.generasjoner.flatMap((generasjon) =>
                    generasjon.perioder.flatMap((periode) => periode.varsler),
                ),
            )
            .find((varsel) => varsel.kode === varselkode && varsel.generasjonId === generasjonIdString);

        const { varselMedEndring, index } = this.findWithIndex(
            this.varslerMedEndring,
            (varselMedEndring) =>
                varselMedEndring.generasjonId === generasjonIdString && varselMedEndring.kode === varselkode,
        );

        if (varselMedEndring?.vurdering && [Varselstatus.Vurdert].includes(varselMedEndring.vurdering.status)) {
            return new GraphQLError(
                `Varsel med varselkode=${varselkode}, generasjonId=${generasjonIdString} har ikke status AKTIV`,
                { extensions: { code: 409 } },
            );
        }

        const varselMedVurdering: VarselDto = varselMedEndring
            ? {
                  ...varselMedEndring,
                  vurdering: {
                      status: Varselstatus.Vurdert,
                      ident: ident,
                      tidsstempel: dayjs().format(ISO_TIDSPUNKTFORMAT),
                  },
              }
            : {
                  id: gjeldendeVarsel?.id ?? crypto.randomUUID(),
                  definisjonId: definisjonIdString ?? '',
                  generasjonId: generasjonIdString,
                  opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
                  kode: varselkode,
                  tittel: gjeldendeVarsel?.tittel ?? '',
                  forklaring: gjeldendeVarsel?.forklaring ?? '',
                  handling: gjeldendeVarsel?.handling ?? '',
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

        return varselMedVurdering;
    };

    static settVarselstatusAktiv = ({
        generasjonIdString,
        varselkode,
        ident,
    }: MutationSettVarselstatusArgs): VarselDto | GraphQLError => {
        const { varselMedEndring, index } = this.findWithIndex(
            this.varslerMedEndring,
            (varselMedEndring) =>
                varselMedEndring.generasjonId === generasjonIdString && varselMedEndring.kode === varselkode,
        );

        if (varselMedEndring?.vurdering && [Varselstatus.Godkjent].includes(varselMedEndring.vurdering.status)) {
            return new GraphQLError(
                `Varsel med varselkode=${varselkode}, generasjonId=${generasjonIdString} har ikke status GODKJENT`,
                { extensions: { code: 409 } },
            );
        }

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
                  id: crypto.randomUUID(),
                  definisjonId: '',
                  generasjonId: generasjonIdString,
                  opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
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
        return this.varslerMedEndring[index];
    };

    static findWithIndex = (arr: VarselDto[], predicate: (varsel: VarselDto) => boolean) => {
        const index = arr.findIndex(predicate);

        return {
            varselMedEndring: index !== -1 ? arr[index] : null,
            index,
        };
    };
}
