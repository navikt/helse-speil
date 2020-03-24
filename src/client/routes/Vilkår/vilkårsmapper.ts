import { Sykepengegrunnlag, Vilkår } from '../../context/types';
import { GRUNNBELØP } from './Vilkår';

export enum Vilkårstype {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnalg,
    DagerIgjen
}

export interface VurdertVilkår {
    oppfylt: boolean;
    vilkår: Vilkårstype;
}

const erYngreEnn70År = (vilkår: Vilkår): boolean => vilkår.alderISykmeldingsperioden! < 70;
const søknadsfristOppholdt = (vilkår: Vilkår): boolean => vilkår.søknadsfrist?.innen3Mnd!;
const harOpptjeningOppfyldt = (vilkår: Vilkår): boolean => vilkår.opptjening.harOpptjening;
const er67EllerEldre = (vilkår: Vilkår): boolean => vilkår.alderISykmeldingsperioden! >= 67;
const årsinntektStørreEnn2G = (sykepengegrunnlag: Sykepengegrunnlag): boolean =>
    sykepengegrunnlag.årsinntektFraAording! > 2 * GRUNNBELØP;
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
        oppfylt: harOpptjeningOppfyldt(vilkår)
    },
    {
        vilkår: Vilkårstype.KravTilSykepengegrunnalg,
        oppfylt: er67EllerEldre(vilkår) && årsinntektStørreEnn2G(sykepengegrunnlag)
    },
    {
        vilkår: Vilkårstype.DagerIgjen,
        oppfylt: harBruktUnder248Dager(vilkår) || (er67EllerEldre(vilkår) && harBruktMindreEnn60Dager(vilkår))
    }
];
