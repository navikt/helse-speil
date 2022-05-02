import React from 'react';
import dayjs from 'dayjs';

import { BodyShort } from '@navikt/ds-react';

import { Varsel } from '@components/Varsel';
import { Feilikon } from '@components/ikoner/Feilikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { BeregnetPeriode, Person, Vilkarsgrunnlag } from '@io/graphql';
import { getVilkårsgrunnlag } from '@state/selectors/person';

import { CardTitle } from './CardTitle';
import { kategoriserteInngangsvilkår } from '../vilkår/kategoriserteInngangsvilkår';

import styles from './VilkårCard.module.css';

const getAlderVedSkjæringstidspunkt = (period: BeregnetPeriode, person: Person): number => {
    return dayjs(person.personinfo.fodselsdato).diff(dayjs(period.skjaeringstidspunkt), 'year');
};

interface VilkårCardProps {
    activePeriod: BeregnetPeriode;
    currentPerson: Person;
}

export const VilkårCard = ({ activePeriod, currentPerson }: VilkårCardProps) => {
    const vilkårsgrunnlag = getVilkårsgrunnlag(
        currentPerson,
        activePeriod.vilkarsgrunnlaghistorikkId,
        activePeriod.skjaeringstidspunkt,
        activePeriod.tom,
    );

    if (!vilkårsgrunnlag) {
        return <Varsel variant="feil">Vilkår mangler</Varsel>;
    }

    const alderVedSkjæringstidspunkt = getAlderVedSkjæringstidspunkt(activePeriod, currentPerson);

    const { ikkeVurderteVilkår, ikkeOppfylteVilkår, ...oppfylteVilkår } = kategoriserteInngangsvilkår(
        vilkårsgrunnlag,
        alderVedSkjæringstidspunkt,
        activePeriod.utbetaling.vurdering ?? null,
    );

    return (
        <section>
            <CardTitle>INNGANGSVILKÅR</CardTitle>
            <ul>
                {ikkeOppfylteVilkår?.map((vilkår, i) => (
                    <li key={i} className={styles.ListItem}>
                        <span className={styles.IconContainer}>
                            <Feilikon alt="Ikke oppfylt" />
                        </span>
                        <BodyShort>{vilkår.tittel}</BodyShort>
                    </li>
                ))}
                {ikkeVurderteVilkår?.map((vilkår, i) => (
                    <li key={i} className={styles.ListItem}>
                        <span className={styles.IconContainer}>
                            <Advarselikon alt="Til vurdering" />
                        </span>
                        <BodyShort>{vilkår.tittel}</BodyShort>
                    </li>
                ))}
                {Object.values(oppfylteVilkår ?? {})
                    .flat()
                    .map((vilkår, i) => (
                        <li key={i} className={styles.ListItem}>
                            <span className={styles.IconContainer}>
                                <Sjekkikon alt="Oppfylt" />
                            </span>
                            <BodyShort>{vilkår.tittel}</BodyShort>
                        </li>
                    ))}
            </ul>
        </section>
    );
};
