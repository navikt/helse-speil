import React from 'react';
import Vilkårsgruppe from './Vilkårsgruppe';
import Vilkårsgrupperad from './Vilkårsgruppe/Vilkårsgrupperad';
import { Optional } from '../../context/types';
import { toDate } from '../../utils/date';
import { toKronerOgØre } from '../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';

interface AlderProps {
    alder: Optional<number>;
}

const Alder = ({ alder }: AlderProps) => (
    <Vilkårsgruppe tittel="Under 70 år" paragraf="§8-51" ikontype="ok">
        <Vilkårsgrupperad label="Alder">{alder}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface SøknadsfristProps {
    sendtNav: string;
    sisteSykepengedag: string;
    innen3Mnd?: boolean;
}

const Søknadsfrist = ({ sendtNav, sisteSykepengedag, innen3Mnd }: SøknadsfristProps) => (
    <Vilkårsgruppe tittel="Søknadsfrist" paragraf="§22-13" ikontype={innen3Mnd ? 'ok' : 'advarsel'}>
        <Vilkårsgrupperad label="Sendt NAV">{toDate(sendtNav)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Siste sykepengedag">{toDate(sisteSykepengedag)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Innen 3 mnd">{innen3Mnd ? 'Ja' : 'Nei'}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface OpptjeningstidProps {
    førsteFraværsdag: string;
    opptjeningFra: string;
    harOpptjening?: boolean;
    antallOpptjeningsdagerErMinst: number;
}

const Opptjeningstid = ({
    harOpptjening,
    førsteFraværsdag,
    opptjeningFra,
    antallOpptjeningsdagerErMinst
}: OpptjeningstidProps) => (
    <Vilkårsgruppe tittel="Opptjeningstid" paragraf="§8-2" ikontype={harOpptjening ? 'ok' : 'advarsel'}>
        <Vilkårsgrupperad label="Første sykdomsdag">{toDate(førsteFraværsdag)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">{opptjeningFra}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${antallOpptjeningsdagerErMinst}`}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface KravTilSykepengegrunnlagProps {
    sykepengegrunnlag: number;
}

const KravTilSykepengegrunnlag = ({ sykepengegrunnlag }: KravTilSykepengegrunnlagProps) => (
    <Vilkårsgruppe tittel="Krav til minste sykepengegrunnlag" paragraf="§8-3" ikontype="ok">
        <Vilkårsgrupperad label="Sykepengegrunnlaget">{`${toKronerOgØre(sykepengegrunnlag)} kr`}</Vilkårsgrupperad>
        <Normaltekst>{`0,5G er ${toKronerOgØre(99858 / 2)} kr`}</Normaltekst>
    </Vilkårsgruppe>
);

interface DagerIgjenProps {
    førsteFraværsdag: string;
    dagerBrukt: number;
    maksdato: string;
    førsteSykepengedag: Optional<string>;
}

const DagerIgjen = ({ førsteFraværsdag, førsteSykepengedag, dagerBrukt, maksdato }: DagerIgjenProps) => {
    const dagerIgjen = 248 - dagerBrukt;
    return (
        <Vilkårsgruppe tittel="Dager igjen" paragraf="§8-11 og §8-12" ikontype="ok">
            <Vilkårsgrupperad label="Første fraværsdag">{toDate(førsteFraværsdag)}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Første sykepengedag">
                {førsteSykepengedag ? toDate(førsteSykepengedag) : 'Ikke funnet'}
            </Vilkårsgrupperad>
            <Vilkårsgrupperad label="Yrkesstatus">Arbeidstaker</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Dager brukt">{dagerBrukt}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Dager igjen">{dagerIgjen}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Maks dato">{toDate(maksdato)}</Vilkårsgrupperad>
        </Vilkårsgruppe>
    );
};

export default {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnlag,
    DagerIgjen
};
