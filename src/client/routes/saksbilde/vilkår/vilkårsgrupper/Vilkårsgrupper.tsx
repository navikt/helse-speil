import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { toKronerOgØre } from '../../../../utils/locale';

import { Vilkårsgrupperad } from './Vilkårsgrupperad';

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
        <BodyShort component="p">{`2G er ${toKronerOgØre(grunnbeløp * 2)} kr`}</BodyShort>
    ) : (
        <BodyShort component="p">{`0,5G er ${toKronerOgØre(grunnbeløp / 2)} kr`}</BodyShort>
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
