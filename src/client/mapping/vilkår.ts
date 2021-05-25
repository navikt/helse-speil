import {
    SpesialistInntektsgrunnlag,
    SpesialistVedtaksperiode,
    SpleisForlengelseFraInfotrygd,
    SpleisMedlemskapstatus,
    SpleisVilkår,
} from 'external-types';
import {
    Alder,
    Basisvilkår,
    DagerIgjen,
    Opptjening,
    SykepengegrunnlagVilkår,
    Søknadsfrist,
    Vilkår,
} from 'internal-types';
import { ReactNode } from 'react';

import { somDato, somKanskjeDato } from './vedtaksperiode';

// noinspection JSUnusedGlobalSymbols
export enum Vilkårstype {
    Alder = 'alder',
    Søknadsfrist = 'søknadsfrist',
    Opptjeningstid = 'opptjening',
    Sykepengegrunnlag = 'sykepengegrunnlag',
    DagerIgjen = 'dagerIgjen',
    Medlemskap = 'medlemskap',
    Institusjonsopphold = 'institusjonsopphold',
    Risikovurdering = 'risikovurdering',
    Arbeidsuførhet = 'arbeidsuførhet',
    Medvirkning = 'medvirkning',
}

export interface Vilkårdata {
    type: Vilkårstype;
    tittel: string;
    komponent: ReactNode;
    oppfylt?: boolean;
    paragraf?: ReactNode;
}

const alderVilkår = ({ vilkår }: SpesialistVedtaksperiode): Alder => ({
    alderSisteSykedag: vilkår.alder.alderSisteSykedag,
    oppfylt: vilkår.alder.oppfylt,
});

const sykepengegrunnlagVilkår = (
    vilkår: SpleisVilkår,
    inntektsgrunnlag?: SpesialistInntektsgrunnlag
): SykepengegrunnlagVilkår => ({
    sykepengegrunnlag: inntektsgrunnlag?.sykepengegrunnlag ?? vilkår.sykepengegrunnlag.sykepengegrunnlag,
    oppfylt: inntektsgrunnlag?.oppfyllerKravOmMinstelønn ?? vilkår.sykepengegrunnlag.oppfylt,
    grunnebeløp: inntektsgrunnlag?.grunnbeløp ?? vilkår.sykepengegrunnlag.grunnbeløp,
});

const dagerIgjenVilkår = ({ vilkår }: SpesialistVedtaksperiode): DagerIgjen => ({
    dagerBrukt: vilkår.sykepengedager.forbrukteSykedager,
    skjæringstidspunkt: somDato(vilkår.sykepengedager.skjæringstidspunkt),
    førsteSykepengedag: somKanskjeDato(vilkår.sykepengedager.førsteSykepengedag),
    maksdato:
        vilkår.sykepengedager.maksdato !== '+999999999-12-31'
            ? somKanskjeDato(vilkår.sykepengedager.maksdato)
            : undefined,
    oppfylt: vilkår.sykepengedager.oppfylt,
    gjenståendeDager: vilkår.sykepengedager.gjenståendeDager,
    tidligerePerioder: [],
});

const søknadsfristVilkår = ({ vilkår }: SpesialistVedtaksperiode): Søknadsfrist | undefined =>
    vilkår.søknadsfrist
        ? {
              sendtNav: somDato(vilkår.søknadsfrist.sendtNav),
              søknadFom: somDato(vilkår.søknadsfrist.søknadFom),
              oppfylt: vilkår.søknadsfrist.oppfylt,
          }
        : undefined;

const opptjeningVilkår = ({ vilkår, forlengelseFraInfotrygd }: SpesialistVedtaksperiode): Opptjening | undefined => {
    if (forlengelseFraInfotrygd === SpleisForlengelseFraInfotrygd.JA) return { oppfylt: true } as Opptjening;
    return vilkår.opptjening !== undefined && vilkår.opptjening !== null
        ? {
              antallOpptjeningsdagerErMinst: vilkår.opptjening.antallKjenteOpptjeningsdager,
              oppfylt: vilkår.opptjening.oppfylt,
              opptjeningFra: somDato(vilkår.opptjening.fom),
          }
        : undefined;
};

const medlemskapVilkår = ({ vilkår }: SpesialistVedtaksperiode): Basisvilkår | undefined =>
    vilkår.medlemskapstatus === SpleisMedlemskapstatus.JA
        ? { oppfylt: true }
        : vilkår.medlemskapstatus === SpleisMedlemskapstatus.NEI
        ? { oppfylt: false }
        : undefined;

type MapVilkårResult = {
    vilkår: Vilkår | undefined;
    problems: Error[];
};

export const mapVilkår = (
    unmapped: SpesialistVedtaksperiode,
    inntektsgrunnlag?: SpesialistInntektsgrunnlag
): MapVilkårResult => {
    const problems: Error[] = [];

    const mapVilkår = (callback: (unmapped: SpesialistVedtaksperiode) => any): any => {
        try {
            return callback(unmapped);
        } catch (error) {
            problems.push(error);
        }
    };

    const vilkår = {
        alder: mapVilkår(alderVilkår),
        sykepengegrunnlag: mapVilkår(() => sykepengegrunnlagVilkår(unmapped.vilkår, inntektsgrunnlag)),
        dagerIgjen: mapVilkår(dagerIgjenVilkår),
        søknadsfrist: mapVilkår(søknadsfristVilkår),
        opptjening: mapVilkår(opptjeningVilkår),
        medlemskap: mapVilkår(medlemskapVilkår),
    };

    return {
        vilkår: vilkår,
        problems: problems,
    };
};
