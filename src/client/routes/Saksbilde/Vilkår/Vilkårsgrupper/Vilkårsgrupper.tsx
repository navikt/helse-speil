import React, { ReactNode } from 'react';
import Vilkårsgruppe from './Vilkårsgruppe';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import { Dayjs } from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../../utils/locale';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import {
    Alder as AlderType,
    Basisvilkår,
    DagerIgjen as DagerIgjenType,
    Opptjening as OpptjeningType,
    Risikovurdering,
    SykepengegrunnlagVilkår,
    Søknadsfrist as SøknadsfristType,
    Vilkår,
} from 'internal-types';
import { Vilkårgrid } from '../Vilkår.styles';
import styled from '@emotion/styled';

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

const Vurderinger = styled.ul`
    list-style: inside;
    margin: 0 0 0.5rem 2rem;
    color: #3e3832;
`;

const VurderingElement = styled(Normaltekst)`
    display: inline;
`;

export const ArbeidsuførhetIkkeVurdert = (risikovurdering?: Risikovurdering) => {
    return <Vilkårsgrupperad label="Arbeidsuførhet">§ 8-4 FØRSTE LEDD</Vilkårsgrupperad>;
};

export const ArbeidsuførhetVurdert = (risikovurdering?: Risikovurdering) => {
    return null;
};

export const alder = ({ alder }: Vilkår): ReactNode => <Alder {...alder} key="alder" />;

export const søknadsfrist = ({ søknadsfrist }: Vilkår): ReactNode =>
    søknadsfrist && <Søknadsfrist {...søknadsfrist} key="søknadsfrist" />;

export const opptjeningstid = (vilkår: Vilkår): ReactNode =>
    vilkår.opptjening && (
        <Opptjeningstid
            opptjeningVilkår={vilkår.opptjening!}
            førsteFraværsdag={vilkår.dagerIgjen.førsteFraværsdag}
            key="opptjeningstid"
        />
    );

export const sykepengegrunnlag = (vilkår: Vilkår): ReactNode => (
    <KravTilSykepengegrunnlag
        sykepengegrunnlagVilkår={vilkår.sykepengegrunnlag}
        alderSisteSykedag={vilkår.alder.alderSisteSykedag}
        key="kravtilsykepengegrunnlag"
    />
);

export const dagerIgjen = ({ dagerIgjen }: Vilkår): ReactNode =>
    dagerIgjen && <DagerIgjen {...dagerIgjen} key="dagerigjen" />;

export const medlemskap = ({ medlemskap }: Vilkår): ReactNode =>
    medlemskap && medlemskap.oppfylt && <Vilkårsgruppe tittel="Medlemskap" paragraf="§ 2" ikontype="ok" />;

export default {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnlag,
    DagerIgjen,
};
