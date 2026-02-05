import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useFetchPersonQuery } from '@state/person';
import { cn } from '@utils/tw';

import { UnntattFraAutomatisering } from './UnntattFraAutomatisering';

import styles from '../personHeader/PersonHeader.module.css';

const InfovarselOmStansContainer = (): ReactElement | null => {
    const { data, loading } = useFetchPersonQuery();

    const currentPerson = data?.person;
    if (loading || currentPerson == null) {
        return null;
    }

    const unntattFraAutomatisering = currentPerson.personinfo.unntattFraAutomatisering;

    if (unntattFraAutomatisering && unntattFraAutomatisering.erUnntatt) {
        return (
            <UnntattFraAutomatisering
                årsaker={unntattFraAutomatisering.arsaker}
                tidspunkt={unntattFraAutomatisering.tidspunkt!}
                fødselsnummer={currentPerson.fodselsnummer}
            />
        );
    }

    return null;
};

const InfovarselOmStansError = (): ReactElement => {
    return (
        <div className={cn(styles.Error)}>
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </div>
    );
};

export const InfovarselOmStans = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<InfovarselOmStansError />}>
            <InfovarselOmStansContainer />
        </ErrorBoundary>
    );
};
