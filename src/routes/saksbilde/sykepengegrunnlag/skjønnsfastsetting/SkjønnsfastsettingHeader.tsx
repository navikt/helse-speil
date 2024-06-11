import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { SkjønnsfastsettingMal } from '@/external/sanity';
import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { BeregnetPeriodeFragment, Kildetype, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useCurrentPerson } from '@person/query';
import { useActivePeriod } from '@state/periode';
import { somPenger, toKronerOgØre } from '@utils/locale';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    editing: boolean;
    setEditing: (state: boolean) => void;
    maler: SkjønnsfastsettingMal[] | undefined;
}

export const SkjønnsfastsettingHeader = ({
    sykepengegrunnlag,
    endretSykepengegrunnlag,
    skjønnsmessigFastsattÅrlig,
    sykepengegrunnlagsgrense,
    editing,
    setEditing,
    maler,
}: SkjønnsfastsettingHeaderProps) => {
    const person = useCurrentPerson();
    const aktivPeriode = useActivePeriod();
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
                            <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
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
