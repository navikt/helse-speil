import React from 'react';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import { toKronerOgØre } from '../../../../utils/locale';
import { Vilkårsgrupperad } from './Vilkårsgrupperad';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { Opptjening, Risikovurdering as RisikovurderingType, Vilkår } from 'internal-types';
import { Flex } from '../../../../components/Flex';
import { Paragraf } from '../vilkårstitler';
import { Advarselikon } from '../../../../components/ikoner/Advarselikon';
import { LovdataLenke } from '../../../../components/LovdataLenke';
import { har8_4Kategori } from '../tilKategoriserteVilkår';

export const Alder = ({ alder }: Vilkår) => (
    <Vilkårsgrupperad label="Alder">{alder.alderSisteSykedag}</Vilkårsgrupperad>
);

export const Søknadsfrist = ({ søknadsfrist }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Sendt NAV">
            {søknadsfrist?.sendtNav!.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Første sykepengedag">
            {søknadsfrist?.søknadFom?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Innen 3 mnd">{søknadsfrist?.oppfylt ? 'Ja' : 'Nei'}</Vilkårsgrupperad>
    </>
);

export const Opptjeningstid = ({ dagerIgjen, opptjening }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Skjæringstidspunkt">
            {dagerIgjen.skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">
            {(opptjening as Opptjening)?.opptjeningFra?.format(NORSK_DATOFORMAT) ?? 'ukjent'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${
            (opptjening as Opptjening)?.antallOpptjeningsdagerErMinst ?? false
        }`}</Vilkårsgrupperad>
    </>
);

type GrunnbeløpProps = {
    grunnbeløp: number;
    alder: number;
};

const Grunnbeløp = ({ grunnbeløp, alder }: GrunnbeløpProps) =>
    alder >= 67 ? (
        <Normaltekst>{`2G er ${toKronerOgØre(grunnbeløp * 2)} kr`}</Normaltekst>
    ) : (
        <Normaltekst>{`0,5G er ${toKronerOgØre(grunnbeløp / 2)} kr`}</Normaltekst>
    );

export const Sykepengegrunnlag = ({ sykepengegrunnlag, alder }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Sykepengegrunnlaget">
            {sykepengegrunnlag.sykepengegrunnlag
                ? `${toKronerOgØre(sykepengegrunnlag.sykepengegrunnlag)} kr`
                : 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Grunnbeløp grunnbeløp={sykepengegrunnlag.grunnebeløp} alder={alder.alderSisteSykedag} />
    </>
);

export const AlderIkon = styled(Advarselikon)`
    padding: 0 10px;
`;

interface GjenståendeDagerProps {
    gjenståendeDager: number;
    alderSisteSykedag: number;
}

const GjenståendeDager = ({ gjenståendeDager, alderSisteSykedag }: GjenståendeDagerProps) => (
    <Flex alignItems="center">
        {gjenståendeDager}
        {alderSisteSykedag >= 67 && alderSisteSykedag < 70 && (
            <>
                <AlderIkon width={16} height={16} />
                <Paragraf>
                    <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                </Paragraf>
            </>
        )}
    </Flex>
);

export const DagerIgjen = ({ dagerIgjen, alder }: Vilkår) => (
    <>
        <Vilkårsgrupperad label="Skjæringstidspunkt">
            {dagerIgjen.skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Første sykepengedag">
            {dagerIgjen.førsteSykepengedag?.format(NORSK_DATOFORMAT) ?? 'Ingen sykepengedager'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Yrkesstatus">Arbeidstaker</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Dager brukt">{dagerIgjen.dagerBrukt ?? 'Ikke funnet'}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Dager igjen">
            {dagerIgjen.gjenståendeDager ? (
                <GjenståendeDager
                    alderSisteSykedag={alder.alderSisteSykedag}
                    gjenståendeDager={dagerIgjen.gjenståendeDager}
                />
            ) : (
                <Normaltekst>Ikke funnet</Normaltekst>
            )}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Maksdato">
            {dagerIgjen.maksdato?.format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
    </>
);

const Vurderinger = styled.ul`
    list-style: initial;
    color: var(--navds-color-text-primary);
`;

export const Arbeidsuførhet = ({ risikovurdering }: { risikovurdering?: RisikovurderingType }) => (
    <Vurderinger>
        {risikovurdering?.funn.filter(har8_4Kategori).map((funn, i) => (
            <li key={i}>
                <Normaltekst>{funn.beskrivelse}</Normaltekst>
            </li>
        ))}
    </Vurderinger>
);
