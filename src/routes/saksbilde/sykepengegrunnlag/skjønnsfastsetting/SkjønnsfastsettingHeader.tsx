import React from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { SkjønnsfastsettingMal } from '@external/sanity';
import { BeregnetPeriodeFragment, Kildetype, Maybe, PersonFragment, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useActivePeriodOld } from '@state/periode';
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
}: SkjønnsfastsettingHeaderProps) => {
    const aktivPeriode = useActivePeriodOld();
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
                    <Bold className={styles.label}>Sykepengegrunnlag</Bold>
                    <div className={styles.beløp}>
                        {visningharEndring && <Endringstrekant />}
                        <BodyShort>{somPenger(visningEndretSykepengegrunnlag ?? sykepengegrunnlag)}</BodyShort>
                    </div>
                    {visningharEndring && (
                        <p className={styles.opprinneligSykepengegrunnlag}>{toKronerOgØre(sykepengegrunnlag)}</p>
                    )}
                    {skjønnsmessigFastsattÅrlig != null && (
                        <Kilde type={Kildetype.Saksbehandler} className={styles.kildeIkon}>
                            <PersonPencilFillIcon title="Saksbehandler ikon" height={20} width={20} />
                        </Kilde>
                    )}
                </>
            )}
            {!erBeslutteroppgave && harMaler && (
                <EditButton
                    isOpen={editing}
                    openText="Avbryt"
                    closedText="Skjønnsfastsett"
                    onOpen={() => setEditing(true)}
                    onClose={() => setEditing(false)}
                    className={styles.redigeringsknapp}
                />
            )}
        </div>
    );
};
