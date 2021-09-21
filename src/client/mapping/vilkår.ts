import { ReactNode } from 'react';

import { somDato, somKanskjeDato } from './vedtaksperiode';

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

const alderVilkår = ({ vilkår }: ExternalVedtaksperiode): Alder => ({
    alderSisteSykedag: vilkår.alder.alderSisteSykedag,
    oppfylt: vilkår.alder.oppfylt,
});

const sykepengegrunnlagVilkår = (
    vilkår: ExternalVedtaksperiode['vilkår'],
    inntektsgrunnlag?: ExternalInntektsgrunnlag
): SykepengegrunnlagVilkår => ({
    sykepengegrunnlag: inntektsgrunnlag?.sykepengegrunnlag ?? vilkår.sykepengegrunnlag.sykepengegrunnlag,
    oppfylt: inntektsgrunnlag?.oppfyllerKravOmMinstelønn ?? vilkår.sykepengegrunnlag.oppfylt,
    grunnebeløp: inntektsgrunnlag?.grunnbeløp ?? vilkår.sykepengegrunnlag.grunnbeløp,
});

const dagerIgjenVilkår = ({ vilkår }: ExternalVedtaksperiode): DagerIgjen => ({
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

const søknadsfristVilkår = ({ vilkår }: ExternalVedtaksperiode): Søknadsfrist | undefined =>
    vilkår.søknadsfrist
        ? {
              sendtNav: somDato(vilkår.søknadsfrist.sendtNav),
              søknadFom: somDato(vilkår.søknadsfrist.søknadFom),
              oppfylt: vilkår.søknadsfrist.oppfylt,
          }
        : undefined;

const opptjeningVilkår = ({ vilkår, forlengelseFraInfotrygd }: ExternalVedtaksperiode): Opptjening | undefined => {
    if (forlengelseFraInfotrygd === 'JA') return { oppfylt: true } as Opptjening;
    return vilkår.opptjening !== undefined && vilkår.opptjening !== null
        ? {
              antallOpptjeningsdagerErMinst: vilkår.opptjening.antallKjenteOpptjeningsdager,
              oppfylt: vilkår.opptjening.oppfylt,
              opptjeningFra: somDato(vilkår.opptjening.fom),
          }
        : undefined;
};

const medlemskapVilkår = ({ vilkår }: ExternalVedtaksperiode): Basisvilkår | undefined =>
    vilkår.medlemskapstatus === 'JA'
        ? { oppfylt: true }
        : vilkår.medlemskapstatus === 'NEI'
        ? { oppfylt: false }
        : undefined;

type MapVilkårResult = {
    vilkår: Vilkår | undefined;
    problems: Error[];
};

export const mapVilkår = (
    unmapped: ExternalVedtaksperiode,
    inntektsgrunnlag?: ExternalInntektsgrunnlag
): MapVilkårResult => {
    const problems: Error[] = [];

    const mapVilkår = (callback: (unmapped: ExternalVedtaksperiode) => any): any => {
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
