import classNames from 'classnames';
import React, { useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { Arbeidsgiverinntekt, Kildetype, Sykepengegrunnlagsgrense } from '@io/graphql';
import { kanSkjønnsfastsetteSykepengegrunnlag } from '@utils/featureToggles';
import { somPenger } from '@utils/locale';

import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView/SykepengegrunnlagsgrenseView';

import styles from './SkjønnsfastsettingSykepengegrunnlag.module.css';

interface SkjønnsfastsettingSykepengegrunnlagProps {
    sykepengegrunnlag: number;
    sykepengegrunnlagsgrense: Sykepengegrunnlagsgrense;
    omregnetÅrsinntekt?: Maybe<number>;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    inntekter: Arbeidsgiverinntekt[];
}

export const SkjønnsfastsettingSykepengegrunnlag = ({
    sykepengegrunnlag,
    sykepengegrunnlagsgrense,
    omregnetÅrsinntekt,
    skjønnsmessigFastsattÅrlig,
    inntekter,
}: SkjønnsfastsettingSykepengegrunnlagProps) => {
    const [editing, setEditing] = useState(false);

    return (
        <div className={styles.Wrapper}>
            {!editing && (
                <div className={styles.Sykepengegrunnlag}>
                    <Bold className={styles.Tittel}>Sykepengegrunnlag</Bold>
                    <BodyShort className={styles.Beløp}>{somPenger(sykepengegrunnlag)} </BodyShort>
                    {skjønnsmessigFastsattÅrlig != null && (
                        <Kilde type={Kildetype.Saksbehandler}>
                            <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                        </Kilde>
                    )}
                    {kanSkjønnsfastsetteSykepengegrunnlag && (
                        <EditButton
                            isOpen={editing}
                            openText="Avbryt"
                            closedText="Skjønnsfastsett"
                            onOpen={() => setEditing(true)}
                            onClose={() => setEditing(false)}
                            className={styles.Redigeringsknapp}
                        />
                    )}
                </div>
            )}
            {editing && (
                <div className={classNames(styles.Sykepengegrunnlag, { [styles.Redigerer]: editing })}>
                    <Bold className={styles.Tittel}>Sykepengegrunnlag</Bold>
                    <BodyShort className={styles.Beløp}>{somPenger(sykepengegrunnlag)} </BodyShort>
                    {skjønnsmessigFastsattÅrlig != null && (
                        <Kilde type={Kildetype.Saksbehandler}>
                            <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                        </Kilde>
                    )}
                    {kanSkjønnsfastsetteSykepengegrunnlag && (
                        <EditButton
                            isOpen={editing}
                            openText="Avbryt"
                            closedText="Skjønnsfastsett"
                            onOpen={() => setEditing(true)}
                            onClose={() => setEditing(false)}
                            className={styles.Redigeringsknapp}
                        />
                    )}
                </div>
            )}
            {omregnetÅrsinntekt != null && (
                <SykepengegrunnlagsgrenseView
                    sykepengegrunnlagsgrense={sykepengegrunnlagsgrense}
                    omregnetÅrsinntekt={omregnetÅrsinntekt}
                />
            )}
        </div>
    );
};
