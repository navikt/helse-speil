import {
    Alder,
    Basisvilkår,
    DagerIgjen,
    Opptjening,
    SykepengegrunnlagVilkår,
    Søknadsfrist,
    Vilkår,
} from 'internal-types';
import { SpesialistVedtaksperiode, SpleisForlengelseFraInfotrygd, SpleisMedlemskapstatus } from 'external-types';
import { somDato, somKanskjeDato } from './vedtaksperiode';
import { ReactNode } from 'react';

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

const sykepengegrunnlagVilkår = ({ vilkår }: SpesialistVedtaksperiode): SykepengegrunnlagVilkår => ({
    sykepengegrunnlag: vilkår.sykepengegrunnlag.sykepengegrunnlag,
    oppfylt: vilkår.sykepengegrunnlag.oppfylt,
    grunnebeløp: vilkår.sykepengegrunnlag.grunnbeløp,
});

const dagerIgjenVilkår = ({ vilkår }: SpesialistVedtaksperiode): DagerIgjen => ({
    dagerBrukt: vilkår.sykepengedager.forbrukteSykedager,
    skjæringstidspunkt: somDato(vilkår.sykepengedager.beregningsdato),
    førsteSykepengedag: somKanskjeDato(vilkår.sykepengedager.førsteSykepengedag),
    maksdato: somKanskjeDato(vilkår.sykepengedager.maksdato),
    oppfylt: vilkår.sykepengedager.oppfylt,
    gjenståendeDager: vilkår.sykepengedager.gjenståendeDager,
    tidligerePerioder: [],
});

const søknadsfristVilkår = ({ vilkår }: SpesialistVedtaksperiode): Søknadsfrist | undefined =>
    vilkår.søknadsfrist
        ? {
              sendtNav: somDato(vilkår.søknadsfrist.sendtNav),
              søknadTom: somDato(vilkår.søknadsfrist.søknadTom),
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
    vilkår.medlemskapstatus === SpleisMedlemskapstatus.JA ? { oppfylt: true } : undefined;

type MapVilkårResult = {
    vilkår: Vilkår | undefined;
    problems: Error[];
};

export const mapVilkår = async (unmapped: SpesialistVedtaksperiode): Promise<MapVilkårResult> => {
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
        sykepengegrunnlag: mapVilkår(sykepengegrunnlagVilkår),
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
