import React, { ReactElement, ReactNode } from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';
import { BeregnetPeriodeFragment, Faresignal, Maybe, Risikovurdering } from '@io/graphql';

import styles from './Vurderingsmomenter.module.scss';

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

export const VurderingsmomenterWithContent = ({
    risikovurdering,
}: VurderingsmomenterWithContentProps): ReactElement => (
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
);

interface VurderingsmomenterContainerProps {
    periode: BeregnetPeriodeFragment;
}

const VurderingsmomenterContainer = ({ periode }: VurderingsmomenterContainerProps): ReactElement | null =>
    periode.risikovurdering ? <VurderingsmomenterWithContent risikovurdering={periode.risikovurdering} /> : null;

const VilkårsmomenterError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise inngangsvilkår for denne perioden.
    </Alert>
);

interface VurderingsmomenterProps {
    periode: BeregnetPeriodeFragment;
}

export const Vurderingsmomenter = ({ periode }: VurderingsmomenterProps): ReactElement => (
    <ErrorBoundary fallback={<VilkårsmomenterError />}>
        <VurderingsmomenterContainer periode={periode} />
    </ErrorBoundary>
);
