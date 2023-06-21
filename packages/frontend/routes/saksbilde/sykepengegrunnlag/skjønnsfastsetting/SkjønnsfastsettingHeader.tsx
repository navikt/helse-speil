import React from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { Kildetype } from '@io/graphql';
import { kanSkjønnsfastsetteSykepengegrunnlag } from '@utils/featureToggles';
import { somPenger } from '@utils/locale';

import styles from './SkjønnsfastsettingHeader.module.css';

interface SkjønnsfastsettingHeaderProps {
    sykepengegrunnlag: number;
    skjønnsmessigFastsattÅrlig?: Maybe<number>;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const SkjønnsfastsettingHeader = ({
    sykepengegrunnlag,
    skjønnsmessigFastsattÅrlig,
    editing,
    setEditing,
}: SkjønnsfastsettingHeaderProps) => (
    <div className={styles.header}>
        <Bold className={styles.label}>Sykepengegrunnlag</Bold>
        <BodyShort className={styles.beløp}>{somPenger(sykepengegrunnlag)} </BodyShort>
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
                className={styles.redigeringsknapp}
            />
        )}
    </div>
);
