import { Sykepengegrunnlag, Vilkår } from '../../context/types';
import { GRUNNBELØP } from './Vilkår';

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

const erYngreEnn70År = (vilkår: Vilkår): boolean => vilkår.alderISykmeldingsperioden! < 70;
const søknadsfristOppholdt = (vilkår: Vilkår): boolean => vilkår.søknadsfrist?.oppfylt!;
const harOpptjeningOppfylt = (vilkår: Vilkår): boolean => vilkår.opptjening?.oppfylt!;
const er67EllerEldre = (vilkår: Vilkår): boolean => vilkår.alderISykmeldingsperioden! >= 67;
const årsinntektStørreEnnHalvG = (sykepengegrunnlag: Sykepengegrunnlag): boolean =>
    sykepengegrunnlag.årsinntektFraInntektsmelding! > 0.5 * GRUNNBELØP;
const årsinntektStørreEnn2G = (sykepengegrunnlag: Sykepengegrunnlag): boolean =>
    sykepengegrunnlag.årsinntektFraInntektsmelding! > 2 * GRUNNBELØP;
const harBruktUnder248Dager = (vilkår: Vilkår): boolean => vilkår.dagerIgjen?.dagerBrukt! < 248;
const harBruktMindreEnn60Dager = (vilkår: Vilkår): boolean => vilkår.dagerIgjen?.dagerBrukt! < 60;

export const mapVilkår = (vilkår: Vilkår, sykepengegrunnlag: Sykepengegrunnlag): VurdertVilkår[] => [
    {
        vilkår: Vilkårstype.Alder,
        oppfylt: erYngreEnn70År(vilkår)
    },
    {
        vilkår: Vilkårstype.Søknadsfrist,
        oppfylt: søknadsfristOppholdt(vilkår)
    },
    {
        vilkår: Vilkårstype.Opptjeningstid,
        oppfylt: harOpptjeningOppfylt(vilkår)
    },
    {
        vilkår: Vilkårstype.KravTilSykepengegrunnlag,
        oppfylt:
            (er67EllerEldre(vilkår) && årsinntektStørreEnn2G(sykepengegrunnlag)) ||
            årsinntektStørreEnnHalvG(sykepengegrunnlag)
    },
    {
        vilkår: Vilkårstype.DagerIgjen,
        oppfylt: harBruktUnder248Dager(vilkår) || (er67EllerEldre(vilkår) && harBruktMindreEnn60Dager(vilkår))
    }
];
