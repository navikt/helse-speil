import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Kildetype, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useCurrentPerson } from '@state/person';
import { kanSkjønnsfastsetteSykepengegrunnlag } from '@utils/featureToggles';
import { somPenger, toKronerOgØre } from '@utils/locale';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const SkjønnsfastsettingHeader = ({
    sykepengegrunnlag,
    endretSykepengegrunnlag,
    skjønnsmessigFastsattÅrlig,
    sykepengegrunnlagsgrense,
    editing,
    setEditing,
}: SkjønnsfastsettingHeaderProps) => {
    const person = useCurrentPerson();
    if (!person) return <></>;

    const harKunnEnArbeidsgiver = person?.arbeidsgivere && person?.arbeidsgivere.length === 1;
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
            {kanSkjønnsfastsetteSykepengegrunnlag && harKunnEnArbeidsgiver && (
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
