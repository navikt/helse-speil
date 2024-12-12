import React from 'react';

import { PersonPencilFillIcon, PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { SkjønnsfastsettingMal } from '@external/sanity';
import { BeregnetPeriodeFragment, Maybe, PersonFragment, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { somPenger, toKronerOgØre } from '@utils/locale';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    person: PersonFragment;
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    editing: boolean;
    setEditing: (state: boolean) => void;
    maler: SkjønnsfastsettingMal[] | undefined;
    malerError: string | undefined;
}

export const SkjønnsfastsettingHeader = ({
    person,
    sykepengegrunnlag,
    endretSykepengegrunnlag,
    skjønnsmessigFastsattÅrlig,
    sykepengegrunnlagsgrense,
    editing,
    setEditing,
    maler,
    malerError,
}: SkjønnsfastsettingHeaderProps) => {
    const aktivPeriode = useActivePeriod(person);
    const harMaler = maler && maler.length > 0;

    if (!person || !aktivPeriode) return <></>;

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
                    {skjønnsmessigFastsattÅrlig != null && (
                        <Kilde type={'Saksbehandler'} className={styles.kildeIkon}>
                            <PersonPencilFillIcon title="Saksbehandler ikon" />
                        </Kilde>
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
                        onClick={() => setEditing(false)}
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
