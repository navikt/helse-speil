import React from 'react';
import Vilkårsgruppe from './Vilkårsgruppe';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import { toKronerOgØre } from '../../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import {
    Alder as AlderType,
    Basisvilkår,
    DagerIgjen as DagerIgjenType,
    Opptjening as OpptjeningType,
    SykepengegrunnlagVilkår,
    Søknadsfrist as SøknadsfristType,
} from '../../../context/types.internal';

const Alder = (props: AlderType) => (
    <Vilkårsgruppe tittel="Under 70 år" paragraf="§ 8-51" ikontype={props.oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Alder">{props.alderSisteSykedag}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

const Søknadsfrist = (props: SøknadsfristType) => (
    <Vilkårsgruppe tittel="Søknadsfrist" paragraf="§ 22-13" ikontype={props.oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Sendt NAV">
            {props.sendtNav!.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Siste sykepengedag">{props.søknadTom!.format(NORSK_DATOFORMAT)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Innen 3 mnd">{props.oppfylt ? 'Ja' : 'Nei'}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface OpptjeningstidProps {
    opptjeningVilkår: OpptjeningType | Basisvilkår;
    førsteFraværsdag?: Dayjs;
}

const Opptjeningstid = ({ opptjeningVilkår, førsteFraværsdag }: OpptjeningstidProps) => (
    <Vilkårsgruppe tittel="Opptjeningstid" paragraf="§ 8-2" ikontype={opptjeningVilkår.oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Første sykdomsdag">
            {førsteFraværsdag?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">
            {(opptjeningVilkår as OpptjeningType).opptjeningFra.format(NORSK_DATOFORMAT)}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${
            (opptjeningVilkår as OpptjeningType).antallOpptjeningsdagerErMinst
        }`}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface KravTilSykepengegrunnlagProps {
    sykepengegrunnlagVilkår: SykepengegrunnlagVilkår;
    alderSisteSykedag: number;
}

const KravTilSykepengegrunnlag = ({ sykepengegrunnlagVilkår, alderSisteSykedag }: KravTilSykepengegrunnlagProps) => (
    <Vilkårsgruppe
        tittel="Krav til minste sykepengegrunnlag"
        paragraf="§ 8-3"
        ikontype={sykepengegrunnlagVilkår.oppfylt ? 'ok' : 'kryss'}
    >
        <Vilkårsgrupperad label="Sykepengegrunnlaget">
            {sykepengegrunnlagVilkår.sykepengegrunnlag
                ? `${toKronerOgØre(sykepengegrunnlagVilkår.sykepengegrunnlag)} kr`
                : 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Grunnbeløp grunnbeløp={sykepengegrunnlagVilkår.grunnebeløp} alder={alderSisteSykedag} />
    </Vilkårsgruppe>
);

interface Grunnbeløp {
    grunnbeløp: number;
    alder: number;
}

const Grunnbeløp = ({ grunnbeløp, alder }: Grunnbeløp) =>
    alder >= 67 ? (
        <Normaltekst>{`2G er ${toKronerOgØre(grunnbeløp * 2)} kr`}</Normaltekst>
    ) : (
        <Normaltekst>{`0,5G er ${toKronerOgØre(grunnbeløp / 2)} kr`}</Normaltekst>
    );

const DagerIgjen = (props: DagerIgjenType) => {
    return (
        <Vilkårsgruppe tittel="Dager igjen" paragraf="§§ 8-11 og 8-12" ikontype={props.oppfylt ? 'ok' : 'kryss'}>
            <Vilkårsgrupperad label="Første fraværsdag">
                {props.førsteFraværsdag?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
            </Vilkårsgrupperad>
            <Vilkårsgrupperad label="Første sykepengedag">
                {props.førsteSykepengedag?.format(NORSK_DATOFORMAT) ?? 'Ingen sykepengedager'}
            </Vilkårsgrupperad>
            <Vilkårsgrupperad label="Yrkesstatus">Arbeidstaker</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Dager brukt">{props.dagerBrukt ?? 'Ikke funnet'}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Dager igjen">{props.gjenståendeDager ?? 'Ikke funnet'}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Maks dato">
                {props.maksdato?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
            </Vilkårsgrupperad>
        </Vilkårsgruppe>
    );
};

export const alder = (alder: AlderType) => <Alder {...alder} key="alder" />;
export const søknadsfrist = (søknadsfrist: SøknadsfristType) => <Søknadsfrist {...søknadsfrist} key="søknadsfrist" />;
export const opptjeningstid = (opptjeningstid: OpptjeningType, førsteFraværsdag?: Dayjs) => (
    <Opptjeningstid opptjeningVilkår={opptjeningstid} førsteFraværsdag={førsteFraværsdag} key="opptjeningstid" />
);
export const kravTilSykepengegrunnlag = (sykepengegrunnlag: SykepengegrunnlagVilkår, alderSisteSykedag: number) => (
    <KravTilSykepengegrunnlag
        sykepengegrunnlagVilkår={sykepengegrunnlag}
        alderSisteSykedag={alderSisteSykedag}
        key="kravtilsykepengegrunnlag"
    />
);
export const dagerIgjen = (dagerIgjen: DagerIgjenType) => <DagerIgjen {...dagerIgjen} key="dagerigjen" />;

export default {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnlag,
    DagerIgjen,
};
