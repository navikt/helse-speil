import React from 'react';
import Vilkårsgruppe from './Vilkårsgruppe';
import Vilkårsgrupperad from './Vilkårsgrupperad';
import { toKronerOgØre } from '../../../utils/locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Dayjs } from 'dayjs';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { GRUNNBELØP } from '../Vilkår';
import { Sykepengegrunnlag, Vilkår as VilkårData } from '../../../context/types';

interface AlderProps {
    alder: number | undefined;
    oppfylt: boolean;
}

const Alder = ({ alder, oppfylt }: AlderProps) => (
    <Vilkårsgruppe tittel="Under 70 år" paragraf="§8-51" ikontype={oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Alder">{alder}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface SøknadsfristProps {
    sendtNav?: Dayjs;
    innen3Mnd?: boolean;
    sisteSykepengedag: Dayjs;
    oppfylt: boolean;
}

const Søknadsfrist = ({ sendtNav, sisteSykepengedag, innen3Mnd, oppfylt }: SøknadsfristProps) => (
    <Vilkårsgruppe tittel="Søknadsfrist" paragraf="§22-13" ikontype={oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Sendt NAV">{sendtNav?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Siste sykepengedag">{sisteSykepengedag.format(NORSK_DATOFORMAT)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Innen 3 mnd">{innen3Mnd ? 'Ja' : 'Nei'}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface OpptjeningstidProps {
    førsteFraværsdag?: Dayjs;
    opptjeningFra: Dayjs;
    antallOpptjeningsdagerErMinst: number;
    oppfylt: boolean;
}

const Opptjeningstid = ({
    førsteFraværsdag,
    opptjeningFra,
    antallOpptjeningsdagerErMinst,
    oppfylt
}: OpptjeningstidProps) => (
    <Vilkårsgruppe tittel="Opptjeningstid" paragraf="§8-2" ikontype={oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Første sykdomsdag">
            {førsteFraværsdag?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">{opptjeningFra.format(NORSK_DATOFORMAT)}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${antallOpptjeningsdagerErMinst}`}</Vilkårsgrupperad>
    </Vilkårsgruppe>
);

interface KravTilSykepengegrunnlagProps {
    sykepengegrunnlag: number;
    oppfylt: boolean;
}

const KravTilSykepengegrunnlag = ({ sykepengegrunnlag, oppfylt }: KravTilSykepengegrunnlagProps) => (
    <Vilkårsgruppe tittel="Krav til minste sykepengegrunnlag" paragraf="§8-3" ikontype={oppfylt ? 'ok' : 'kryss'}>
        <Vilkårsgrupperad label="Sykepengegrunnlaget">{`${toKronerOgØre(sykepengegrunnlag)} kr`}</Vilkårsgrupperad>
        <Normaltekst>{`0,5G er ${toKronerOgØre(GRUNNBELØP / 2)} kr`}</Normaltekst>
    </Vilkårsgruppe>
);

interface DagerIgjenProps {
    førsteFraværsdag?: Dayjs;
    dagerBrukt?: number;
    maksdato?: Dayjs;
    førsteSykepengedag?: Dayjs;
    oppfylt: boolean;
}

const DagerIgjen = ({ førsteFraværsdag, førsteSykepengedag, dagerBrukt, maksdato, oppfylt }: DagerIgjenProps) => {
    const dagerIgjen: number | undefined = dagerBrukt ? 248 - dagerBrukt : undefined;
    return (
        <Vilkårsgruppe tittel="Dager igjen" paragraf="§8-11 og §8-12" ikontype={oppfylt ? 'ok' : 'kryss'}>
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

export const alder = (vilkår: VilkårData, oppfylt: boolean) => (
    <Alder alder={vilkår.alderISykmeldingsperioden} oppfylt={oppfylt} key="alder" />
);
export const søknadsfrist = (vilkår: VilkårData, oppfylt: boolean) => (
    <Søknadsfrist
        innen3Mnd={vilkår.søknadsfrist?.oppfylt}
        sendtNav={vilkår.søknadsfrist?.sendtNav!}
        sisteSykepengedag={vilkår.søknadsfrist?.søknadTom!}
        oppfylt={oppfylt}
        key="søknadsfrist"
    />
);
export const opptjeningstid = (vilkår: VilkårData, oppfylt: boolean) => (
    <Opptjeningstid
        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
        opptjeningFra={vilkår.opptjening!.opptjeningFra}
        antallOpptjeningsdagerErMinst={vilkår.opptjening!.antallOpptjeningsdagerErMinst}
        oppfylt={oppfylt}
        key="opptjeningstid"
    />
);
export const kravTilSykepengegrunnlag = (sykepengegrunnlag: Sykepengegrunnlag, oppfylt: boolean) => (
    <KravTilSykepengegrunnlag
        sykepengegrunnlag={sykepengegrunnlag.årsinntektFraInntektsmelding!}
        oppfylt={oppfylt}
        key="kravtilsykepengegrunnlag"
    />
);
export const dagerIgjen = (vilkår: VilkårData, oppfylt: boolean) => (
    <DagerIgjen
        førsteFraværsdag={vilkår.dagerIgjen?.førsteFraværsdag}
        førsteSykepengedag={vilkår.dagerIgjen?.førsteSykepengedag}
        dagerBrukt={vilkår.dagerIgjen?.dagerBrukt}
        maksdato={vilkår.dagerIgjen?.maksdato}
        oppfylt={oppfylt}
        key="dagerigjen"
    />
);

export default {
    Alder,
    Søknadsfrist,
    Opptjeningstid,
    KravTilSykepengegrunnlag,
    DagerIgjen
};
