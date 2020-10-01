import {
    Alder,
    Basisvilkår,
    DagerIgjen,
    Opptjening,
    SykepengegrunnlagVilkår,
    Søknadsfrist,
    Vilkår,
} from 'internal-types';
import {
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisMedlemskapstatus,
    SpleisVilkår,
} from 'external-types';
import { somDato, somKanskjeDato } from './vedtaksperiode';

export enum Vilkårstype {
    Alder = 'alder',
    Søknadsfrist = 'søknadsfrist',
    Opptjeningstid = 'opptjening',
    KravTilSykepengegrunnlag = 'sykepengegrunnlag',
    DagerIgjen = 'dagerIgjen',
    Medlemskap = 'medlemskap',
}

export interface VurdertVilkår {
    oppfylt: boolean;
    vilkår: Vilkårstype;
}

const alderVilkår = (vilkår: SpleisVilkår): Alder => ({
    alderSisteSykedag: vilkår.alder.alderSisteSykedag,
    oppfylt: vilkår.alder.oppfylt,
});

const sykepengegrunnlagVilkår = (vilkår: SpleisVilkår): SykepengegrunnlagVilkår => ({
    sykepengegrunnlag: vilkår.sykepengegrunnlag.sykepengegrunnlag,
    oppfylt: vilkår.sykepengegrunnlag.oppfylt,
    grunnebeløp: vilkår.sykepengegrunnlag.grunnbeløp,
});

const dagerIgjenVilkår = (vilkår: SpleisVilkår): DagerIgjen => ({
    dagerBrukt: vilkår.sykepengedager.forbrukteSykedager,
    førsteFraværsdag: somDato(vilkår.sykepengedager.førsteFraværsdag),
    førsteSykepengedag: somKanskjeDato(vilkår.sykepengedager.førsteSykepengedag),
    maksdato: somKanskjeDato(vilkår.sykepengedager.maksdato),
    oppfylt: vilkår.sykepengedager.oppfylt,
    gjenståendeDager: vilkår.sykepengedager.gjenståendeDager,
    tidligerePerioder: [],
});

const søknadsfristVilkår = (vilkår: SpleisVilkår): Søknadsfrist | undefined =>
    vilkår.søknadsfrist !== undefined
        ? {
              sendtNav: somDato(vilkår.søknadsfrist.sendtNav),
              søknadTom: somDato(vilkår.søknadsfrist.søknadTom),
              // TODO: oppfylt undefined burde legge kravet i liste over ting vi ikke har sjekket
              oppfylt: vilkår.søknadsfrist.oppfylt,
          }
        : undefined;

const opptjeningVilkår = (vilkår: SpleisVilkår): Opptjening | undefined =>
    vilkår.opptjening !== undefined && vilkår.opptjening !== null
        ? {
              antallOpptjeningsdagerErMinst: vilkår.opptjening.antallKjenteOpptjeningsdager,
              oppfylt: vilkår.opptjening.oppfylt,
              opptjeningFra: somDato(vilkår.opptjening.fom),
          }
        : undefined;

const medlemskapVilkår = (vilkår: SpleisVilkår): Basisvilkår | undefined =>
    vilkår.medlemskapstatus === SpleisMedlemskapstatus.JA
        ? {
              oppfylt: true,
          }
        : undefined;

export const mapVilkår = (unmapped: SpesialistVedtaksperiode): Vilkår | undefined =>
    (unmapped.vilkår && {
        alder: alderVilkår(unmapped.vilkår),
        dagerIgjen: dagerIgjenVilkår(unmapped.vilkår),
        opptjening:
            unmapped.forlengelseFraInfotrygd === SpleisForlengelseFraInfotrygd.JA
                ? { oppfylt: true }
                : opptjeningVilkår(unmapped.vilkår),
        søknadsfrist: søknadsfristVilkår(unmapped.vilkår),
        sykepengegrunnlag: sykepengegrunnlagVilkår(unmapped.vilkår),
        medlemskap: medlemskapVilkår(unmapped.vilkår),
    }) ??
    undefined;
