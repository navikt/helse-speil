import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import styles from './Søknadsinnhold.module.css';

export const DokumentLoader: React.FC = () => {
    return (
        <div className={styles.skeleton}>
            <BodyShort>
                <LoadingShimmer />
            </BodyShort>
            <BodyShort>
                <LoadingShimmer />
            </BodyShort>
            <BodyShort>
                <LoadingShimmer />
            </BodyShort>
        </div>
    );
};
