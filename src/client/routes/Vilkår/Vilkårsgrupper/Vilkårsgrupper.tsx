import React from 'react';
import Vilkårsgruppe from './Vilkårsgruppe';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import { toKronerOgØre } from '../../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../utils/date';

interface AlderProps {
    alder: number | undefined;
}

const Alder = ({ alder }: AlderProps) => (
    <Vilkårsgruppe tittel="Under 70 år" paragraf="§8-51" ikontype="ok">
        <Vilkårsgrupperad label="Alder">{alder}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface SøknadsfristProps {
    sendtNav?: Dayjs;
    innen3Mnd?: boolean;
    sisteSykepengedag: Dayjs;
}

const Søknadsfrist = ({ sendtNav, sisteSykepengedag, innen3Mnd }: SøknadsfristProps) => (
    <Vilkårsgruppe tittel="Søknadsfrist" paragraf="§22-13" ikontype={innen3Mnd ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Sendt NAV">{sendtNav?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Siste sykepengedag">{sisteSykepengedag.format(NORSK_DATOFORMAT)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Innen 3 mnd">{innen3Mnd ? 'Ja' : 'Nei'}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface OpptjeningstidProps {
    førsteFraværsdag?: Dayjs;
    opptjeningFra: Dayjs;
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
        <Vilkårsgrupperad label="Første sykdomsdag">
            {førsteFraværsdag?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">{opptjeningFra.format(NORSK_DATOFORMAT)}</Vilkårsgrupperad>
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
    førsteFraværsdag?: Dayjs;
    dagerBrukt?: number;
    maksdato?: Dayjs;
    førsteSykepengedag?: Dayjs;
}

const DagerIgjen = ({ førsteFraværsdag, førsteSykepengedag, dagerBrukt, maksdato }: DagerIgjenProps) => {
    const dagerIgjen: number | undefined = dagerBrukt ? 248 - dagerBrukt : undefined;
    return (
        <Vilkårsgruppe tittel="Dager igjen" paragraf="§8-11 og §8-12" ikontype="ok">
            <Vilkårsgrupperad label="Første fraværsdag">
                {førsteFraværsdag?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
            </Vilkårsgrupperad>
            <Vilkårsgrupperad label="Første sykepengedag">
                {førsteSykepengedag?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
            </Vilkårsgrupperad>
            <Vilkårsgrupperad label="Yrkesstatus">Arbeidstaker</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Dager brukt">{dagerBrukt ?? 'Ikke funnet'}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Dager igjen">{dagerIgjen ?? 'Ikke funnet'}</Vilkårsgrupperad>
            <Vilkårsgrupperad label="Maks dato">{maksdato?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}</Vilkårsgrupperad>
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
