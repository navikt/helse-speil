import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { DateString } from '@typer/shared';
import { somNorskDato } from '@utils/date';
import { somPenger } from '@utils/locale';

import { Vilkårsgrupperad } from './Vilkårsgrupperad';

interface OpptjeningstidProps {
    skjæringstidspunkt: DateString;
    opptjeningFra: string;
    antallOpptjeningsdagerErMinst: number;
}

export const Opptjeningstid = ({
    skjæringstidspunkt,
    opptjeningFra,
    antallOpptjeningsdagerErMinst,
}: OpptjeningstidProps): ReactElement => (
    <>
        <Vilkårsgrupperad label="Skjæringstidspunkt">
            {somNorskDato(skjæringstidspunkt) ?? 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Vilkårsgrupperad label="Opptjening fra">{somNorskDato(opptjeningFra) ?? 'ukjent'}</Vilkårsgrupperad>
        <Vilkårsgrupperad label="Antall dager (>28)">{`${antallOpptjeningsdagerErMinst}`}</Vilkårsgrupperad>
    </>
);

type GrunnbeløpProps = {
    grunnbeløp: number;
    alder: number;
};

const Grunnbeløp = ({ grunnbeløp, alder }: GrunnbeløpProps): ReactElement =>
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

export const Sykepengegrunnlag = ({
    sykepengegrunnlag,
    grunnbeløp,
    alderVedSkjæringstidspunkt,
}: SykepengegrunnlagProps): ReactElement => (
    <>
        <Vilkårsgrupperad label="Sykepengegrunnlaget">
            {sykepengegrunnlag ? somPenger(sykepengegrunnlag) : 'Ikke funnet'}
        </Vilkårsgrupperad>
        <Grunnbeløp grunnbeløp={grunnbeløp} alder={alderVedSkjæringstidspunkt} />
    </>
);
