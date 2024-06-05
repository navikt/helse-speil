import styles from './Vurderingsmomenter.module.scss';
import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AgurkErrorBoundary } from '@components/AgurkErrorBoundary';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';
import { Faresignal, Maybe, Risikovurdering } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

const harFunn = (funn?: Maybe<Faresignal[]>): funn is Faresignal[] => {
    return typeof funn === 'object';
};

interface VurderingsmomenterkategoriProps {
    ikon: ReactNode;
    overskrift: string;
    vurderingsmomenter: Faresignal[];
    vurderingIkon: ReactNode;
}

const VurderingsmomentKategori = ({
    ikon,
    overskrift,
    vurderingsmomenter,
    vurderingIkon,
}: VurderingsmomenterkategoriProps) => (
    <div className={styles.kolonne}>
        <div className={styles.linje}>
            <div className={styles.ikoncontainer}>{ikon}</div>
            <BodyShort>{overskrift}</BodyShort>
        </div>
        {vurderingsmomenter.map((vurderingsmoment, i) => (
            <div className={styles.linje} key={i}>
                <div className={styles.ikoncontainer}>{vurderingIkon}</div>
                <BodyShort>{vurderingsmoment.beskrivelse}</BodyShort>
            </div>
        ))}
    </div>
);

interface VurderingsmomenterWithContentProps {
    risikovurdering: Risikovurdering;
}

export const VurderingsmomenterWithContent: React.FC<VurderingsmomenterWithContentProps> = ({ risikovurdering }) => (
    <AgurkErrorBoundary sidenavn="Vurderingsmomenter">
        <div className={styles.container}>
            {risikovurdering && harFunn(risikovurdering.funn) && risikovurdering.funn.length > 0 && (
                <VurderingsmomentKategori
                    ikon={<Advarselikon />}
                    overskrift="Vurderingsmomenter oppdaget"
                    vurderingsmomenter={risikovurdering.funn}
                    vurderingIkon={<Utropstegnikon alt="Oppdaget" />}
                />
            )}
            {risikovurdering && (risikovurdering.kontrollertOk?.length ?? 0) > 0 && (
                <VurderingsmomentKategori
                    ikon={<GrøntSjekkikon />}
                    overskrift="Vurderingsmomenter kontrollert"
                    vurderingsmomenter={risikovurdering.kontrollertOk}
                    vurderingIkon={<Sjekkikon alt="Kontrollert" />}
                />
            )}
        </div>
    </AgurkErrorBoundary>
);

const VurderingsmomenterContainer = () => {
    const activePeriod = useActivePeriod();

    if (isBeregnetPeriode(activePeriod) && activePeriod.risikovurdering) {
        return <VurderingsmomenterWithContent risikovurdering={activePeriod.risikovurdering} />;
    }

    return null;
};

export const Vurderingsmomenter = () => {
    return <VurderingsmomenterContainer />;
};

export default Vurderingsmomenter;
