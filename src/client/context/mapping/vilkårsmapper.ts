import { Alder, DagerIgjen, Opptjening, SykepengegrunnlagVilkår, Søknadsfrist, Vilkår } from '../types.internal';
import { SpleisVilkår } from './types.external';
import { somDato } from './vedtaksperiodemapper';

export enum Vilkårstype {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnlag,
    DagerIgjen
}

export interface VurdertVilkår {
    oppfylt: boolean;
    vilkår: Vilkårstype;
}

export const aldersVilkår = (vilkår: SpleisVilkår): Alder => ({
    alderSisteSykedag: vilkår.alder.alderSisteSykedag,
    oppfylt: vilkår.alder.oppfylt
});

export const sykepengegrunnlagsVilkår = (vilkår: SpleisVilkår): SykepengegrunnlagVilkår => ({
    sykepengegrunnlag: vilkår.sykepengegrunnlag.sykepengegrunnlag,
    oppfylt: vilkår.sykepengegrunnlag.oppfylt,
    grunnebeløp: vilkår.sykepengegrunnlag.grunnbeløp
});

export const dagerIgjenVilkår = (vilkår: SpleisVilkår): DagerIgjen => ({
    dagerBrukt: vilkår.sykepengedager.forbrukteSykedager!,
    førsteFraværsdag: somDato(vilkår.sykepengedager.førsteFraværsdag!),
    førsteSykepengedag: somDato(vilkår.sykepengedager.førsteSykepengedag!),
    maksdato: somDato(vilkår.sykepengedager.maksdato!),
    oppfylt: vilkår.sykepengedager.oppfylt,
    gjenståendeDager: vilkår.sykepengedager.gjenståendeDager,
    tidligerePerioder: []
});

export const søknadsfristVilkår = (vilkår: SpleisVilkår): Søknadsfrist | undefined =>
    vilkår.søknadsfrist !== undefined
        ? {
              sendtNav: somDato(vilkår.søknadsfrist.sendtNav),
              søknadTom: somDato(vilkår.søknadsfrist.søknadTom),
              // TODO: oppfylt undefined burde legge kravet i liste over ting vi ikke har sjekket
              oppfylt: vilkår.søknadsfrist.oppfylt
          }
        : undefined;

export const opptjeningsVilkår = (vilkår: SpleisVilkår): Opptjening | undefined =>
    vilkår.opptjening !== undefined && vilkår.opptjening !== null
        ? {
              antallOpptjeningsdagerErMinst: vilkår.opptjening.antallKjenteOpptjeningsdager,
              oppfylt: vilkår.opptjening.oppfylt,
              opptjeningFra: somDato(vilkår.opptjening.fom)
          }
        : undefined;

export const mapVilkår = (vilkår: Vilkår): VurdertVilkår[] => [
    {
        vilkår: Vilkårstype.Alder,
        oppfylt: vilkår.alder.oppfylt
    },
    {
        vilkår: Vilkårstype.Søknadsfrist,
        oppfylt: vilkår.søknadsfrist?.oppfylt!
    },
    {
        vilkår: Vilkårstype.Opptjeningstid,
        oppfylt: vilkår.opptjening?.oppfylt!
    },
    {
        vilkår: Vilkårstype.KravTilSykepengegrunnlag,
        oppfylt: vilkår.sykepengegrunnlag.oppfylt!
    },
    {
        vilkår: Vilkårstype.DagerIgjen,
        oppfylt: vilkår.dagerIgjen?.oppfylt!
    }
];
