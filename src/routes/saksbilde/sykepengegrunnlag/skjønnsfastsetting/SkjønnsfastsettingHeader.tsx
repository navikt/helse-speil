import dayjs from 'dayjs';
import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { SkjønnsfastsettingMal } from '@external/sanity';
import {
    BeregnetPeriodeFragment,
    Maybe,
    PersonFragment,
    Sykepengegrunnlagsgrense,
    Sykepengegrunnlagskjonnsfastsetting,
} from '@io/graphql';
import { EndringsloggSkjønnsfastsettingButton } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/EndringsloggSkjønnsfastsettingButton';
import { useActivePeriod } from '@state/periode';
import { somPenger, toKronerOgØre } from '@utils/locale';
import { isSykepengegrunnlagskjønnsfastsetting } from '@utils/typeguards';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    person: PersonFragment;
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: Maybe<number>;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    editing: boolean;
    setEditing: (state: boolean) => void;
    maler: SkjønnsfastsettingMal[] | undefined;
    malerError: string | undefined;
    organisasjonsnummer: string;
    closeAndResetForm: () => void;
}

export const SkjønnsfastsettingHeader = ({
    person,
    sykepengegrunnlag,
    endretSykepengegrunnlag,
    sykepengegrunnlagsgrense,
    editing,
    setEditing,
    maler,
    malerError,
    closeAndResetForm,
}: SkjønnsfastsettingHeaderProps) => {
    const aktivPeriode = useActivePeriod(person);
    const harMaler = maler && maler.length > 0;

    if (!person || !aktivPeriode) return <></>;

    const skjønnsfastsettingEndringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo[] =
        person.arbeidsgivere.flatMap((arbeidsgiver) =>
            arbeidsgiver.overstyringer
                .filter(isSykepengegrunnlagskjønnsfastsetting)
                .filter((overstyring) =>
                    dayjs(overstyring.skjonnsfastsatt.skjaeringstidspunkt).isSame(aktivPeriode.skjaeringstidspunkt),
                )
                .map((overstyring) => ({
                    ...overstyring,
                    arbeidsgiverIdentifikator: arbeidsgiver.organisasjonsnummer,
                    arbeidsgivernavn: arbeidsgiver.navn,
                })),
        );

    const erBeslutteroppgave = (aktivPeriode as BeregnetPeriodeFragment).totrinnsvurdering?.erBeslutteroppgave ?? false;
    const visningEndretSykepengegrunnlag = endretSykepengegrunnlag
        ? endretSykepengegrunnlag > sykepengegrunnlagsgrense.grense
            ? sykepengegrunnlagsgrense.grense
            : endretSykepengegrunnlag
        : null;
    const visningharEndring = visningEndretSykepengegrunnlag && visningEndretSykepengegrunnlag !== sykepengegrunnlag;

    return (
        <div className={styles.header}>
            {!editing && (
                <>
                    <BodyShort weight="semibold" className={styles.label}>
                        Sykepengegrunnlag
                    </BodyShort>
                    <div className={styles.beløp}>
                        {visningharEndring && <Endringstrekant />}
                        <BodyShort>{somPenger(visningEndretSykepengegrunnlag ?? sykepengegrunnlag)}</BodyShort>
                    </div>
                    {visningharEndring && (
                        <p className={styles.opprinneligSykepengegrunnlag}>{toKronerOgØre(sykepengegrunnlag)}</p>
                    )}
                    {skjønnsfastsettingEndringer.length > 0 && (
                        <EndringsloggSkjønnsfastsettingButton
                            endringer={skjønnsfastsettingEndringer}
                            className={styles.kildeIkon}
                        />
                    )}
                </>
            )}
            {!erBeslutteroppgave &&
                harMaler &&
                (!editing ? (
                    <Button
                        onClick={() => setEditing(true)}
                        size="xsmall"
                        variant="secondary"
                        icon={<PersonPencilIcon />}
                        className={styles.redigeringsknapp}
                    >
                        Skjønnsfastsett
                    </Button>
                ) : (
                    <Button
                        onClick={closeAndResetForm}
                        size="xsmall"
                        variant="tertiary"
                        icon={<XMarkIcon />}
                        className={styles.redigeringsknapp}
                        style={{ marginRight: '1rem' }}
                    >
                        Avbryt
                    </Button>
                ))}
            {malerError && <ErrorMessage>{malerError}</ErrorMessage>}
        </div>
    );
};

export interface SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo extends Sykepengegrunnlagskjonnsfastsetting {
    arbeidsgiverIdentifikator: string;
    arbeidsgivernavn: string;
}
