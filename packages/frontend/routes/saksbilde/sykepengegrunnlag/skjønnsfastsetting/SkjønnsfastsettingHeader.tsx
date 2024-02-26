import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { BeregnetPeriode, Kildetype, Sykepengegrunnlagsgrense } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { somPenger, toKronerOgØre } from '@utils/locale';

import { skjønnsfastsettingMaler } from './state';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    sykepengegrunnlag: number;
    endretSykepengegrunnlag: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    avviksprosent: number;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const SkjønnsfastsettingHeader = ({
    sykepengegrunnlag,
    endretSykepengegrunnlag,
    skjønnsmessigFastsattÅrlig,
    sykepengegrunnlagsgrense,
    avviksprosent,
    editing,
    setEditing,
}: SkjønnsfastsettingHeaderProps) => {
    const person = useCurrentPerson();
    const aktivPeriode = useActivePeriod();
    const maler = useRecoilValue(skjønnsfastsettingMaler);
    const [harMaler, setHarMaler] = useState(false);

    useEffect(() => {
        setHarMaler(maler.length > 0);
    }, [maler]);

    if (!person || !aktivPeriode) return <></>;
    console.log(avviksprosent);

    const erBeslutteroppgave = (aktivPeriode as BeregnetPeriode).totrinnsvurdering?.erBeslutteroppgave ?? false;
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
