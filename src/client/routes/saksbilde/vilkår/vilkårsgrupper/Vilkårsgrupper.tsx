import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { toKronerOgØre } from '../../../../utils/locale';

import { Vilkårsgrupperad } from './Vilkårsgrupperad';

interface OpptjeningstidProps {
    skjæringstidspunkt: DateString;
    opptjeningFra: ExternalSpleisVilkårsgrunnlag['opptjeningFra'];
    antallOpptjeningsdagerErMinst: ExternalSpleisVilkårsgrunnlag['antallOpptjeningsdagerErMinst'];
}

export const Opptjeningstid = ({
    skjæringstidspunkt,
    opptjeningFra,
    antallOpptjeningsdagerErMinst,
}: OpptjeningstidProps) => (
    <>
        <Vilkårsgrupperad label="Skjæringstidspunkt">
            {dayjs(skjæringstidspunkt).format(NORSK_DATOFORMAT) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">
            {dayjs(opptjeningFra).format(NORSK_DATOFORMAT) ?? 'ukjent'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${antallOpptjeningsdagerErMinst}`}</Vilkårsgrupperad>
    </>
);

type GrunnbeløpProps = {
    grunnbeløp: number;
    alder: number;
};

const Grunnbeløp = ({ grunnbeløp, alder }: GrunnbeløpProps) =>
    alder >= 67 ? (
        <BodyShort as="p">{`2G er ${toKronerOgØre(grunnbeløp * 2)} kr`}</BodyShort>
    ) : (
        <BodyShort as="p">{`0,5G er ${toKronerOgØre(grunnbeløp / 2)} kr`}</BodyShort>
    );

interface SykepengegrunnlagProps {
    sykepengegrunnlag: ExternalSpleisVilkårsgrunnlag['sykepengegrunnlag'];
    grunnbeløp: ExternalSpleisVilkårsgrunnlag['grunnbeløp'];
    alderVedSkjæringstidspunkt: number;
}

export const Sykepengegrunnlag = ({
    sykepengegrunnlag,
    grunnbeløp,
    alderVedSkjæringstidspunkt,
}: SykepengegrunnlagProps) => (
    <>
        <Vilkårsgrupperad label="Sykepengegrunnlaget">
            {sykepengegrunnlag ? `${toKronerOgØre(sykepengegrunnlag)} kr` : 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Grunnbeløp grunnbeløp={grunnbeløp} alder={alderVedSkjæringstidspunkt} />
    </>
);
