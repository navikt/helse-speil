import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Arbeidsgiver, Arbeidsgiverinntekt, InntektFraAOrdningen } from '@io/graphql';
import { useVilkårsgrunnlag } from '@state/person';
import { getMonthName, somPenger } from '@utils/locale';

import { ArbeidsgiverCard } from './ArbeidsgiverCard';

import styles from './Venstremeny.module.css';

const useInntekterFraAOrdningen = (
    vilkårsgrunnlagId: string,
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string
): Array<InntektFraAOrdningen> => {
    const inntekter: Array<Arbeidsgiverinntekt> =
        useVilkårsgrunnlag(vilkårsgrunnlagId, skjæringstidspunkt)?.inntekter ?? [];

    const inntektFraAOrdningen: Array<InntektFraAOrdningen> =
        inntekter.find((it) => it.arbeidsgiver === organisasjonsnummer)?.omregnetArsinntekt?.inntektFraAOrdningen ?? [];

    return Array.from(inntektFraAOrdningen).sort((a, b) =>
        dayjs(a.maned, 'YYYY-MM').isAfter(dayjs(b.maned, 'YYYY-MM')) ? -1 : 1
    );
};

interface VenstremenyGhostPeriodeProps {
    activePeriod: GhostPeriode;
    currentArbeidsgiver: Arbeidsgiver;
}

export const VenstremenyGhostPeriode: React.VFC<VenstremenyGhostPeriodeProps> = ({
    activePeriod,
    currentArbeidsgiver,
}) => {
    if (!activePeriod.vilkarsgrunnlaghistorikkId || !activePeriod.skjaeringstidspunkt) {
        throw Error('Mangler skjæringstidspunkt eller vilkårsgrunnlag. Ta kontakt med en utvikler.');
    }

    const inntekter = useInntekterFraAOrdningen(
        activePeriod.vilkarsgrunnlaghistorikkId,
        activePeriod.skjaeringstidspunkt,
        currentArbeidsgiver.organisasjonsnummer
    );

    return (
        <section className={styles.Venstremeny}>
            <ArbeidsgiverCard.Ghost
                navn={currentArbeidsgiver.navn}
                organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                arbeidsforhold={currentArbeidsgiver.arbeidsforhold}
            />
            {inntekter && (
                <div className={classNames(styles.InntektFraAOrdningen, activePeriod.deaktivert && styles.deactivated)}>
                    <div className={styles.Title}>
                        <Bold>Rapportert siste 3 måneder</Bold>
                        <div className={styles.InfoButtonContainer}>
                            <PopoverHjelpetekst ikon={<SortInfoikon />}>
                                <p>
                                    Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra
                                    A-ordningen til grunn
                                </p>
                            </PopoverHjelpetekst>
                        </div>
                    </div>
                    <div className={styles.Table}>
                        {inntekter.map((inntekt, i) => (
                            <React.Fragment key={i}>
                                <BodyShort>{getMonthName(inntekt.maned)}</BodyShort>
                                <BodyShort className={styles.RightAligned}>{somPenger(inntekt.sum)}</BodyShort>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};
