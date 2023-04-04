import { Vilkårsgrupperad } from './Vilkårsgrupperad';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '@utils/date';
import { somPenger } from '@utils/locale';

interface OpptjeningstidProps {
    skjæringstidspunkt: DateString;
    opptjeningFra: string;
    antallOpptjeningsdagerErMinst: number;
}

export const Opptjeningstid: React.FC<OpptjeningstidProps> = ({
    skjæringstidspunkt,
    opptjeningFra,
    antallOpptjeningsdagerErMinst,
}) => (
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
        <BodyShort>{`2G er ${somPenger(grunnbeløp * 2)}`}</BodyShort>
    ) : (
        <BodyShort>{`0,5G er ${somPenger(grunnbeløp / 2)}`}</BodyShort>
    );

interface SykepengegrunnlagProps {
    sykepengegrunnlag: number;
    grunnbeløp: number;
    alderVedSkjæringstidspunkt: number;
}

export const Sykepengegrunnlag: React.FC<SykepengegrunnlagProps> = ({
    sykepengegrunnlag,
    grunnbeløp,
    alderVedSkjæringstidspunkt,
}) => (
    <>
        <Vilkårsgrupperad label="Sykepengegrunnlaget">
            {sykepengegrunnlag ? somPenger(sykepengegrunnlag) : 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Grunnbeløp grunnbeløp={grunnbeløp} alder={alderVedSkjæringstidspunkt} />
    </>
);
